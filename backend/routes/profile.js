const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const Profile = require("../models/profile");

const router = express.Router();

// ✅ Set up multer for profile image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ✅ Get user profile
router.get("/:username", async (req, res) => {
  try {
    const user = await Profile.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Update user profile
router.put("/:username", upload.single("profilePic"), async (req, res) => {
  try {
    const { email, password } = req.body;
    const updateData = {};

    if (email) updateData.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }
    if (req.file) {
      updateData.profilePic = `/uploads/profile/${req.file.filename}`;
    }

    const updatedUser = await Profile.findOneAndUpdate(
      { username: req.params.username },
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.json({
      message: "Profile updated successfully!",
      updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
