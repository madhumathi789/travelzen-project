import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const location = useLocation();
  const { tripDetails, preferences } = location.state || {};

  const [trip, setTrip] = useState(null);
  const [activeDay, setActiveDay] = useState(-1); // Start at -1 for Pre-Trip
  const [loading, setLoading] = useState(true);
  const [spentItems, setSpentItems] = useState({});

  // --- Utility Functions ---
  const getTransportIcon = (type) => {
    switch (type) {
      case "Train":
        return "🚂 Train";
      case "Bus":
        return "🚌 Bus";
      case "Flight":
        return "✈ Flights";
      default:
        return "🚗 Transport";
    }
  };

  const handleItemToggle = (itemId, price) => {
    setSpentItems((prev) => {
      const newItems = { ...prev };
      const numericPrice = parseFloat(String(price).replace(/[^0-9.]/g, "")) || 0;
      if (newItems[itemId]) {
        delete newItems[itemId]; // Uncheck
      } else {
        newItems[itemId] = numericPrice; // Check
      }
      return newItems;
    });
  };

  const calculateTotalSpent = () =>
    Object.values(spentItems).reduce((sum, price) => sum + price, 0);

  // ✅ Checklist item component
  const ChecklistItem = ({ id, text, price }) => {
    const isChecked = !!spentItems[id];
    const numericPrice = parseFloat(String(price).replace(/[^0-9.]/g, "")) || 0;
    const displayPrice = String(price).includes("k")
      ? price
      : `₹${numericPrice.toLocaleString()}`;

    return (
      <li className={isChecked ? "checked" : ""}>
        <label>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => handleItemToggle(id, price)}
          />
          <span className="item-text">{text}</span>
          <span className="item-price">{displayPrice}</span>
        </label>
      </li>
    );
  };

  // --- Fetch Itinerary (live API) ---
  useEffect(() => {
    const fetchItinerary = async () => {
      if (!tripDetails || !preferences) {
        setLoading(false);
        console.error("Missing trip details or preferences.");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/generate-itinerary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            destinations: tripDetails.destinations,
            startDate: tripDetails.startDate,
            endDate: tripDetails.endDate,
            budget: tripDetails.budget,
            preferences: preferences,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`HTTP error! status: ${response.status}`, errorText);
          throw new Error(`Failed to generate itinerary. Status: ${response.status}`);
        }

        const data = await response.json();
        setTrip(data);
      } catch (error) {
        console.error("Error fetching itinerary:", error);
        setTrip(null);
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
    return (
      <div className="error">
        ❌ Failed to generate itinerary. Please ensure your backend server is running and try refreshing.
      </div>
    );
  }

  // Add Pre-Trip overview
  const itineraryDays = [
    { day: "Pre-Trip", date: trip.startDate, title: "Setup & Essential Booking" },
    ...(trip.days || []),
  ];

  const renderItineraryContent = () => {
    const totalSpent = calculateTotalSpent();
    const formattedTotalSpent = totalSpent.toLocaleString();

    // --- Case 1: Pre-Trip/Overview ---
    if (activeDay === -1) {
      const transportType = trip.transport?.type || "Transport";
      const transportDetails = trip.transport?.detail || "No travel details found.";
      const transportPrice = trip.transport?.price || "0";

      return (
        <div className="itinerary-sections">
          <div className="budget-summary-floating">
            Current Spent: 💰 ₹{formattedTotalSpent}
          </div>

          {/* Transport */}
          <section className="itinerary-section">
            <h2>{getTransportIcon(transportType)}</h2>
            <ul className="list checklist-list">
              <ChecklistItem
                key="transport-booking"
                id="transport-booking"
                text={transportDetails}
                price={transportPrice}
              />
            </ul>
          </section>

          {/* Stays */}
          <section className="itinerary-section">
            <h2>🏨 Stays</h2>
            <ul className="list checklist-list">
              {trip.stays &&
                trip.stays.map((item, index) => (
                  <ChecklistItem
                    key={`stay-${index}`}
                    id={`stay-${index}`}
                    text={item.detail}
                    price={item.price}
                  />
                ))}
            </ul>
          </section>

          {/* Packing List */}
          <section className="itinerary-section">
            <h2>📦 Packing List</h2>
            <ol className="list">
              {trip.packingList &&
                trip.packingList.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
            </ol>
          </section>

          {/* Apps */}
          <section className="itinerary-section highlight">
            <h2>📱 Essential Apps</h2>
            <ul className="list">
              {trip.apps &&
                trip.apps.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </section>
        </div>
      );
    }

    // --- Case 2: Actual Daily Plan ---
    const currentDay = trip.days[activeDay];
    if (currentDay) {
      return (
        <div className="daily-itinerary-detail">
          <div className="budget-summary-floating">
            Current Spent: 💰 ₹{formattedTotalSpent}
          </div>

          <h2>
            📅 {currentDay.day} - {currentDay.title}
          </h2>
          <ul className="list activities-list checklist-list">
            {currentDay.activities &&
              currentDay.activities.map((activity, index) => (
                <ChecklistItem
                  key={`${currentDay.day}-activity-${index}`}
                  id={`${currentDay.day}-activity-${index}`}
                  text={activity.name}
                  price={activity.price}
                />
              ))}
          </ul>
        </div>
      );
    }

    return <div className="info">Select a day to view its itinerary.</div>;
  };

  return (
    <div className="home-container">
      <main className="main-content">
        <div className="trip-header">
          <h1>{trip.title}</h1>
          <div className="trip-meta">
            <span>
              {trip.startDate} to {trip.endDate}
            </span>
            <span className="budget">Total Budget {trip.budget}</span>
          </div>
        </div>

        {/* Days Section */}
        <div className="days-section">
          <div className="days-header">
            {itineraryDays.map((dayItem, index) => (
              <div
                key={index}
                className={`day ${index - 1 === activeDay ? "active" : ""}`}
                onClick={() => setActiveDay(index - 1)}
              >
                <span className="day-label">{dayItem.day}</span>
                <span className="day-date">{dayItem.date}</span>
                {dayItem.title && (
                  <span className="day-title">{dayItem.title}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Itinerary Content */}
        {renderItineraryContent()}
      </main>
    </div>
  );
};

export default Home;
