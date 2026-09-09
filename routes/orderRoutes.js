const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  checkout,
  verifyPayment,
  getMyOrders,
} = require("../controllers/orderController");

router.post("/checkout", authMiddleware, checkout);
router.get("/verify-payment", verifyPayment);
router.get("/", authMiddleware, getMyOrders);

module.exports = router;
