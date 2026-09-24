require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const profileRoutes = require("./routes/profileRoutes");
const courseRoutes = require("./routes/courseRoutes");
const postRoutes = require("./routes/postRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// ---- CORS: allow the Next.js frontend to call this API ----
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---- Routes ----
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 4000;

connectDB();

// When running locally with "node server.js" or "npm run dev", start a
// normal server. On Vercel, this file is imported as a serverless function
// instead, so app.listen() never runs there — Vercel handles that itself.
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;