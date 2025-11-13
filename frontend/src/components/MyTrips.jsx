import React, { useEffect, useState } from "react";
import API from "../api";
import "./MyTrips.css";

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [form, setForm] = useState({
    title: "",
    location: "",
    duration: "",
    startDate: "",
    endDate: "",
    budget: "",
  });

  // Fetch trips from backend
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await API.get("/api/mytrips");
        setTrips(res.data);
      } catch (err) {
        console.error("❌ Error fetching trips:", err);
      }
    };
    fetchTrips();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await API.post("/api/mytrips", form);
      setTrips([...trips, res.data]);
      setForm({
        title: "",
        location: "",
        duration: "",
        startDate: "",
        endDate: "",
        budget: "",
      });
    } catch (err) {
      console.error("❌ Error adding trip:", err);
    }
  };

  return (
    <div className="my-trips-container">
      <h2>My Trips</h2>

      <div className="trip-form">
        <input name="title" placeholder="Trip Title" value={form.title} onChange={handleChange} />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
        <input name="duration" placeholder="Duration (days)" value={form.duration} onChange={handleChange} />
        <input name="startDate" placeholder="Start Date" value={form.startDate} onChange={handleChange} />
        <input name="endDate" placeholder="End Date" value={form.endDate} onChange={handleChange} />
        <input name="budget" placeholder="Budget" value={form.budget} onChange={handleChange} />
        <button onClick={handleSubmit}>Add Trip</button>
      </div>

      <div className="trips-grid">
        {trips.length === 0 ? (
          <p>No trips added yet.</p>
        ) : (
          trips.map((trip) => (
            <div key={trip._id} className="trip-card">
              <h3>{trip.title}</h3>
              <p>📍 {trip.location}</p>
              <p>🗓 {trip.duration} Days</p>
              <p>⏰ {trip.startDate} - {trip.endDate}</p>
              <p>💰 {trip.budget}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyTrips;
