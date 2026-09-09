const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createOrUpdateProfile, getMyProfile } = require("../controllers/profileController");

router.post("/", authMiddleware, createOrUpdateProfile);
router.get("/me", authMiddleware, getMyProfile);

module.exports = router;
