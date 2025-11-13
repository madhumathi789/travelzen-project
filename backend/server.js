// --- MODULES & SETUP ---
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Load environment variables FIRST
dotenv.config();

// Import DB connection & routes
const connectDB = require("./db/connect");
const authRoutes = require("./routes/auth");
const tripRoutes = require("./routes/trips");
const budgetTripRoutes = require("./routes/budgetTrips");
const journalRoutes = require("./routes/journal");
const preferenceRoutes = require("./routes/preferenceRoutes");
const memoryRoutes = require("./routes/memory");
const itineraryRoutes = require("./routes/itineraryRoutes"); // ✅ Existing route
const Itinerary = require("./models/Itinerary"); // ✅ Added model import
const myTripRoutes = require("./routes/mytrips"); // ✅ NEW IMPORT
const profileRoutes = require("./routes/profile"); // ✅ ADDED LINE

// Initialize Express app
const app = express();

// --- GEMINI AI SETUP ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("❌ ERROR: GEMINI_API_KEY not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- DATABASE CONNECTION ---
connectDB();

// --- AI ITINERARY CONTROLLER ---
const generateItinerary = async (req, res) => {
  const { destinations, startDate, endDate, budget, preferences } = req.body;

  const prompt = `
You are an AI travel planner specializing in Indian travel.
Generate a detailed, realistic itinerary in JSON format.

User Details:
Destination(s): ${JSON.stringify(destinations)}
Start Date: ${startDate}
End Date: ${endDate}
Budget: ${budget}
Traveler Preferences: ${JSON.stringify(preferences)}

Required JSON structure:
{
  "title": "Trip to [destination]",
  "startDate": "[YYYY-MM-DD]",
  "endDate": "[YYYY-MM-DD]",
  "budget": "[INR]",
  "days": [
    {
      "day": "Day 1",
      "date": "[YYYY-MM-DD]",
      "title": "Main highlight",
      "activities": [
        { "name": "Visit X Temple", "price": "500" },
        { "name": "Dinner at Y", "price": "2000" }
      ]
    }
  ],
  "transport": {
      "type": "Train/Bus/Flight",
      "detail": "Konkan Kanya Express, AC 3-Tier",
      "price": "12000"
  },
  "stays": [
      { "detail": "4 nights at The Tamarind Hotel, Vagator", "price": "18000" }
  ],
  "packingList": ["Clothes", "Toiletries", "Powerbank"],
  "apps": ["Google Maps", "Ola/Uber", "Zomato"]
}
`;

  const MAX_RETRIES = 3;
  let lastError = null;

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      let itinerary;
      try {
        itinerary = JSON.parse(text.trim());
      } catch (err) {
        const cleaned = text.replace(/```json|```/g, "").trim();
        itinerary = JSON.parse(cleaned);
      }

      // ✅ Save itinerary to MongoDB
      const newItinerary = new Itinerary({
        title: itinerary.title,
        startDate: itinerary.startDate,
        endDate: itinerary.endDate,
        budget: itinerary.budget,
        destinations: destinations.map((d) => `${d.from} to ${d.to}`),
        transport: itinerary.transport,
        stays: itinerary.stays,
        packingList: itinerary.packingList,
        apps: itinerary.apps,
        days: itinerary.days,
      });

      const savedItinerary = await newItinerary.save();
      console.log("✅ Itinerary saved:", savedItinerary._id);

      return res.json(savedItinerary);
    } catch (error) {
      lastError = error;
      console.error(`❌ Attempt ${i + 1} failed:`, error.message);

      const isTransient = error.status === 429 || error.status === 503;
      if (isTransient && i < MAX_RETRIES - 1) {
        const delay = Math.pow(2, i) * 1000;
        console.log(`Retrying in ${delay / 1000}s...`);
        await new Promise((r) => setTimeout(r, delay));
      } else break;
    }
  }

  res
    .status(500)
    .json({ error: "Failed to generate itinerary after multiple attempts." });
};

// --- ROUTE MOUNTING ---
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/budget-trips", budgetTripRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/preferences", preferenceRoutes);
app.use("/api/memories", memoryRoutes);
app.use("/api/itineraries", itineraryRoutes);
app.use("/api/mytrips", myTripRoutes);
app.use("/api/profile", profileRoutes); // ✅ ADDED PROFILE ROUTE

// AI Generation Route
app.post("/api/generate-itinerary", generateItinerary);

// --- ROOT & ERROR HANDLING ---
app.get("/", (req, res) => {
  res.send("🌍 TravelZen API running! Try /api/generate-itinerary or /api/itineraries");
});

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
