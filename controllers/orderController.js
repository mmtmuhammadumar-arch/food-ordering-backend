const Stripe = require("stripe");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Student = require("../models/Student");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.checkout = async (req, res) => {
  try {
    const { address, phone, items } = req.body;

    // The frontend keeps its cart in the browser and sends it directly at
    // checkout time as: items: [{ productId, quantity }, ...]
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = [];
    for (const line of items) {
      const product = await Product.findById(line.productId);
      if (!product) continue;
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: line.quantity || 1,
      });
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ message: "No valid items found for checkout" });
    }

    const total = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const order = await Order.create({
      student: req.studentId,
      items: orderItems,
      total,
      address,
      phone,
      status: "pending",
    });

    // Get the logged-in student's email so Stripe can attach the invoice to them
    const student = await Student.findById(req.studentId);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: student?.email,
      // Automatically generates a full Stripe invoice once payment succeeds
      invoice_creation: { enabled: true },
      line_items: orderItems.map((i) => ({
        price_data: {
          currency: "pkr",
          product_data: { name: i.name },
          unit_amount: Math.round(i.price * 100),
        },
        quantity: i.quantity,
      })),
      success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
      metadata: { orderId: order._id.toString() },
    });

    order.stripeSessionId = session.id;
    await order.save();

    res.json({ url: session.url, orderId: order._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id) {
      return res.status(400).json({ message: "session_id is required" });
    }

    // Expand invoice and payment_intent so we get both full objects in one call
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["invoice", "payment_intent"],
    });

    const order = await Order.findOne({ stripeSessionId: session_id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (session.payment_status === "paid") {
      order.status = "paid";

      if (session.invoice) {
        const invoice = session.invoice;
        order.invoice = {
          id: invoice.id,
          number: invoice.number,
          hostedInvoiceUrl: invoice.hosted_invoice_url,
          invoicePdf: invoice.invoice_pdf,
          status: invoice.status,
          amountPaid: invoice.amount_paid,
          currency: invoice.currency,
          customerEmail: invoice.customer_email,
          created: invoice.created ? new Date(invoice.created * 1000) : undefined,
          paymentIntentId:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id,
        };
      }

      await order.save();
      await Cart.findOneAndUpdate({ student: order.student }, { items: [] });
    }

    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ student: req.studentId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};