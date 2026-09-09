const Course = require("../models/Course");
const Student = require("../models/Student");

exports.createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    const course = await Course.create({ title, description });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("students", "name email");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.enroll = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (!course.students.includes(req.studentId)) {
      course.students.push(req.studentId);
      await course.save();
    }

    await Student.findByIdAndUpdate(req.studentId, {
      $addToSet: { courses: courseId },
    });

    const updated = await Course.findById(courseId).populate("students", "name email");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
