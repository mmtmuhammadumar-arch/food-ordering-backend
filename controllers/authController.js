const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

exports.register = async (req, res) => {
  try {
    const { name, email, password, age } = req.body;

    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const student = await Student.create({ name, email, password, age });
    const token = generateToken(student._id);

    res.status(201).json({
      token,
      user: { id: student._id, name: student.name, email: student.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const match = await student.comparePassword(password);
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(student._id);

    res.json({
      token,
      user: { id: student._id, name: student.name, email: student.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
