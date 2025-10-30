import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/LoginPage.jsx";
import RegisterPage from "./components/RegisterPage.jsx";
import LandingPage from "./components/LandingPage.jsx";
import TripDetails from "./components/tripdetails.jsx";
import Preference from "./components/preference.jsx";
import Home from "./components/Home.jsx";
import Layout from "./components/Layout.js";
import Memories from "./components/Memories.jsx";
import Journal from "./components/Journal.jsx";
import Budget from "./components/Budget.jsx";
import Profile from "./components/Profile.jsx";
import EditPreference from "./components/editpreference.jsx";

function App() {
  // Lift trip state here to share between TripDetails and Preference
  const [tripData, setTripData] = useState(null);

  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/landing" element={<LandingPage />} />

        {/* Login Page */}
        <Route path="/" element={<Login />} />

        {/* Register Page */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Trip Planning Pages */}
        <Route path="/tripdetails" element={<TripDetails setTripData={setTripData} />} />
        <Route path="/preference" element={<Preference tripData={tripData} />} />

        {/* Main Layout Pages */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/memories" element={<Memories />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/editpreferences" element={<EditPreference />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
