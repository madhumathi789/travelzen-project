const mongoose = require("mongoose");

const myTripSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  duration: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  budget: { type: String },
});

module.exports = mongoose.model("MyTrip", myTripSchema);
