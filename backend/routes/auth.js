const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  try {
    console.log("Incoming data:", req.body); // Debug incoming data

    // 👇 Some frontends send 'name' instead of 'username', so handle both
    const { username, name, email, password } = req.body;
    const finalUsername = username || name; // pick whichever exists

    if (!finalUsername || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = new User({ username: finalUsername, email, password });
    await newUser.save();

    console.log("✅ User registered:", newUser);
    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
