const express = require("express");
const router = express.Router();
const Preference = require("../models/Preference");

router.post("/", async (req, res) => {
  try {
    const preference = new Preference(req.body);
    await preference.save();
    res.status(201).json({ message: "Preferences saved successfully", preference });
  } catch (err) {
    console.error("Error saving preferences:", err.message);
    res.status(500).json({ message: "Error saving preferences", error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const prefs = await Preference.find();
    res.json(prefs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
