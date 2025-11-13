const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String }, // optional profile image
});

module.exports = mongoose.model("Profile", profileSchema);
