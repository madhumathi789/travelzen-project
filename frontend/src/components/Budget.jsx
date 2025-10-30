import React, { useEffect, useState } from "react";
import "./Budget.css";

const Budget = () => {
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/trips/budget", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setTrip(data);
      } catch (error) {
        console.error("Error fetching trip budget:", error);
      }
    };

    fetchBudget();
  }, []);

  if (!trip) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="budget-container">
      <h2>Budget</h2>
      <p>Your budget details will appear here.</p>

      <div className="budget-page">
        {/* Header Section */}
        <div className="budget-header">
          <div className="trip-info">
            <h2>{trip.title}</h2>
            <p>
              {trip.days} Days • {trip.location} • {trip.dateRange}
            </p>
          </div>
          <div className="total-budget">
            <p>Total Budget</p>
            <h3>₹ {trip.totalBudget?.toLocaleString()}</h3>
          </div>
        </div>

        {/* Day Tabs */}
        <div className="day-tabs">
          {trip.daysList?.map((day, index) => (
            <div
              key={index}
              className={`day-tab ${index === 0 ? "active" : ""}`}
            >
              <h4>{day.title}</h4>
              <p>{day.date}</p>
            </div>
          ))}
        </div>

        {/* Daily Plan */}
        <div className="day-content">
          <h3>{trip.currentDay?.title}</h3>

          {/* Section: Flight */}
          <div className="section">
            <h4>✈️ Flight Booking:</h4>
            <p className="price">{trip.currentDay?.flight?.price}</p>
            <ul>
              {trip.currentDay?.flight?.details?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Section: Packing */}
          <div className="section">
            <h4>🎒 Packing:</h4>
            <ul>
              {trip.currentDay?.packing?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Section: Stay */}
          <div className="section">
            <h4>🏨 Stay:</h4>
            <ul>
              {trip.currentDay?.stay?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Section: Apps */}
          <div className="apps">
            <span>📱 Apps:</span>{" "}
            <p>{trip.currentDay?.apps?.join(", ")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budget;
