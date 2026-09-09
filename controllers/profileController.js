const Profile = require("../models/Profile");

exports.createOrUpdateProfile = async (req, res) => {
  try {
    const { bio, address, phone } = req.body;
    let profile = await Profile.findOne({ student: req.studentId });

    if (profile) {
      profile.bio = bio ?? profile.bio;
      profile.address = address ?? profile.address;
      profile.phone = phone ?? profile.phone;
      await profile.save();
    } else {
      profile = await Profile.create({ student: req.studentId, bio, address, phone });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ student: req.studentId }).populate(
      "student",
      "name email"
    );
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
