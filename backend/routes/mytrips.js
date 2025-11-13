// routes/myTrips.js
const express = require("express");
const router = express.Router();
const MyTrip = require("../models/MyTrips");

// Get all trips
router.get("/", async (req, res) => {
  try {
    const trips = await MyTrip.find();
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new trip
router.post("/", async (req, res) => {
  try {
    const { title, location, duration, startDate, endDate, budget } = req.body;

    if (!title || !location) {
      return res.status(400).json({ message: "Title and Location are required" });
    }

    const newTrip = new MyTrip({
      title,
      location,
      duration,
      startDate,
      endDate,
      budget,
    });

    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
