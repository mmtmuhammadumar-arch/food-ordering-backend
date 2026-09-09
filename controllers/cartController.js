const Cart = require("../models/Cart");

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = quantity || 1;

    let cart = await Cart.findOne({ student: req.studentId });

    if (!cart) {
      cart = await Cart.create({
        student: req.studentId,
        items: [{ product: productId, quantity: qty }],
      });
    } else {
      const existingItem = cart.items.find(
        (i) => i.product.toString() === productId
      );
      if (existingItem) {
        existingItem.quantity += qty;
      } else {
        cart.items.push({ product: productId, quantity: qty });
      }
      await cart.save();
    }

    const populated = await cart.populate("items.product");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ student: req.studentId }).populate("items.product");
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ student: req.studentId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (i) => i.product.toString() !== req.params.productId
    );
    await cart.save();

    const populated = await cart.populate("items.product");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ student: req.studentId }, { items: [] });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
