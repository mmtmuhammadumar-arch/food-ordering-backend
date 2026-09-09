const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String },
    isPublished: { type: Boolean, default: false },
    image: { type: String },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
