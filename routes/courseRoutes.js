const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createCourse, getCourses, enroll } = require("../controllers/courseController");

router.post("/", authMiddleware, createCourse);
router.get("/", getCourses);
router.post("/enroll", authMiddleware, enroll);

module.exports = router;
