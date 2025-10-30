const express = require("express");
const router = express.Router();
const Journal = require("../models/Journal");

// Get all notes
router.get("/", async (req, res) => {
  try {
    const notes = await Journal.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new note
router.post("/", async (req, res) => {
  try {
    const note = new Journal(req.body);
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update note
router.put("/:id", async (req, res) => {
  try {
    const updatedNote = await Journal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete note
router.delete("/:id", async (req, res) => {
  try {
    await Journal.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
