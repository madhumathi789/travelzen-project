const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// ✅ Load environment variables FIRST
dotenv.config();

const connectDB = require("./db/connect");

// ✅ Import Routes
const authRoutes = require("./routes/auth");
const tripRoutes = require("./routes/trips");
const budgetTripRoutes = require("./routes/budgetTrips");
const journalRoutes = require("./routes/journal");
const preferenceRoutes = require("./routes/preferenceRoutes");
const memoryRoutes = require("./routes/memory"); // ✅ Memories route (with multer)

// ✅ Initialize Express
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve static folder for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Connect to MongoDB
connectDB();

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/budget-trips", budgetTripRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/preferences", preferenceRoutes);
app.use("/api/memories", memoryRoutes);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🌍 TravelZen API is running successfully!");
});

// ✅ Error handler (for debugging)
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
