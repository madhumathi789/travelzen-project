const express = require("express");
const Trip = require("../models/Trip");
const router = express.Router();

router.get("/", async (req, res) => {
  const trips = await Trip.find();
  res.json(trips);
});

router.post("/", async (req, res) => {
  const trip = new Trip(req.body);
  await trip.save();
  res.json(trip);
});

router.delete("/:id", async (req, res) => {
  await Trip.findByIdAndDelete(req.params.id);
  res.json({ message: "Trip deleted" });
});

module.exports = router;
