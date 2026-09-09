const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number, default: 1 },
  },
  { _id: false }
);

// Full Stripe invoice details, saved after payment is confirmed
const invoiceSchema = new mongoose.Schema(
  {
    id: { type: String },
    number: { type: String },
    hostedInvoiceUrl: { type: String },
    invoicePdf: { type: String },
    status: { type: String },
    amountPaid: { type: Number },
    currency: { type: String },
    customerEmail: { type: String },
    created: { type: Date },
    paymentIntentId: { type: String },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    address: { type: String },
    phone: { type: String },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    stripeSessionId: { type: String },
    invoice: invoiceSchema,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);