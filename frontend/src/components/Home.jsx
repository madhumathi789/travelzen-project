import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const location = useLocation();
  const { tripDetails, preferences } = location.state || {}; 
  // Passed from TripDetails → Preference → Home

  const [trip, setTrip] = useState(null);
  const [activeDay, setActiveDay] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await fetch("/api/generate-itinerary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            destinations: tripDetails?.destinations,
            startDate: tripDetails?.startDate,
            endDate: tripDetails?.endDate,
            budget: tripDetails?.budget,
            preferences: preferences
          })
        });

        const data = await response.json();
        setTrip(data);
      } catch (error) {
        console.error("Error fetching itinerary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [tripDetails, preferences]);

  if (loading) {
    return <div className="loading">✨ Generating your AI itinerary...</div>;
  }

  if (!trip) {
    return <div className="error">❌ Failed to generate itinerary.</div>;
  }

  return (
    <div className="home-container">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="logo">TravelZen AI</div>
        <ul className="nav-list">
          <li className="nav-item home">
            <NavLink to="/home" className={({ isActive }) => isActive ? "active-home" : ""}>
              🏠 Home
            </NavLink>
          </li>
          <li className="nav-item trips">
            <NavLink to="/trips" className={({ isActive }) => isActive ? "active-trips" : ""}>
              📁 My Trips
            </NavLink>
          </li>
          <li className="nav-item memories">
            <NavLink to="/memories" className={({ isActive }) => isActive ? "active-memories" : ""}>
              📸 Memories
            </NavLink>
          </li>
          <li className="nav-item journal">
            <NavLink to="/journal" className={({ isActive }) => isActive ? "active-journal" : ""}>
              📓 Journal
            </NavLink>
          </li>
          <li className="nav-item budget">
            <NavLink to="/budget" className={({ isActive }) => isActive ? "active-budget" : ""}>
              💰 Budget
            </NavLink>
          </li>
          <li className="nav-item preference">
            <NavLink to="/preference" className={({ isActive }) => isActive ? "active-preference" : ""}>
              ⚙️ Edit Preferences
            </NavLink>
          </li>
          <li className="nav-item profile">
            <NavLink to="/profile" className={({ isActive }) => isActive ? "active-profile" : ""}>
              👤 My Profile
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="trip-header">
          <h1>{trip.title}</h1>
          <div className="trip-meta">
            <span>{trip.startDate} to {trip.endDate}</span>
            <span className="budget">Total Budget {trip.budget}</span>
          </div>
        </div>

        {/* Days */}
        <div className="days-section">
          <div className="days-header">
            {trip.days.map((dayItem, index) => (
              <div
                key={index}
                className={`day ${index === activeDay ? "active" : ""}`}
                onClick={() => setActiveDay(index)}
              >
                <span className="day-label">{dayItem.day}</span>
                <span className="day-date">{dayItem.date}</span>
                {dayItem.title && <span className="day-title">{dayItem.title}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Itinerary Sections */}
        <div className="itinerary-sections">
          {/* Flights */}
          <section className="itinerary-section">
            <h2>✈️ Flights</h2>
            <ul className="list">
              {trip.flights.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Packing List */}
          <section className="itinerary-section">
            <h2>📦 Packing List</h2>
            <ol className="list">
              {trip.packingList.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
          </section>

          {/* Stays */}
          <section className="itinerary-section">
            <h2>🏨 Stays</h2>
            <ol className="list">
              {trip.stays.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
          </section>

          {/* Apps */}
          <section className="itinerary-section">
            <h2>📱 Apps</h2>
            <ul className="list">
              {trip.apps.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Home;
