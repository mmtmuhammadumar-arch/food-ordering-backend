const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, unique: true },
    bio: { type: String },
    address: { type: String },
    phone: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
