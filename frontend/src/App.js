import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import MyTrips from "./components/MyTrips.jsx"; // ✅ Added MyTrips import

function App() {
  return (
    <Router>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Landing page */}
        <Route path="/landing" element={<LandingPage />} />

        {/* Other features */}
        <Route path="/tripdetails" element={<TripDetails />} />
        <Route path="/preference" element={<Preference />} />

        {/* Layout pages */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/memories" element={<Memories />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/editpreferences" element={<EditPreference />} />
          <Route path="/mytrips" element={<MyTrips />} /> {/* ✅ Added MyTrips route */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
