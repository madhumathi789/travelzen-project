import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./editpreference.css";

const EditPreference = () => {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    startDate: "",
    endDate: "",
    budget: "",
    whoGoing: "",
    tripType: "",
    transportation: "",
    accommodation: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Save changes logic here
    console.log("Preferences saved:", formData);
  };

  return (
    <div className="edit-preference-container">
      <aside className="sidebar">
        <div className="logo">TravelZen AI</div>
        <nav>
          <ul className="nav-list">
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/trips">My Trips</Link></li>
            <li><Link to="/memories">Memories</Link></li>
            <li><Link to="/journal">Journal</Link></li>
            <li><Link to="/budget">Budget</Link></li>
            <li className="active"><Link to="/editpreference">Edit Preferences</Link></li>
            <li><Link to="/profile">My Profile</Link></li>
          </ul>
        </nav>
        <div className="logout">
          <button>Logout</button>
        </div>
      </aside>

      <main className="main-content">
        <h2>Edit Preferences</h2>

        <div className="form-group destination">
          <label>Destination</label>
          <div className="destination-inputs">
            <input
              type="text"
              name="from"
              placeholder="From"
              value={formData.from}
              onChange={handleChange}
            />
            <input
              type="text"
              name="to"
              placeholder="To"
              value={formData.to}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Budget</label>
            <input
              type="number"
              name="budget"
              placeholder="₹"
              value={formData.budget}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Who are Going</label>
            <select
              name="whoGoing"
              value={formData.whoGoing}
              onChange={handleChange}
            >
              <option value="">Select Preference</option>
              <option value="family">Family</option>
              <option value="friends">Friends</option>
              <option value="solo">Solo</option>
              <option value="couple">Couple</option>
            </select>
          </div>
          <div className="form-group">
            <label>Trip Type/Purpose</label>
            <select
              name="tripType"
              value={formData.tripType}
              onChange={handleChange}
            >
              <option value="">Select Preference</option>
              <option value="leisure">Leisure</option>
              <option value="business">Business</option>
              <option value="adventure">Adventure</option>
              <option value="cultural">Cultural</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Transportation</label>
            <select
              name="transportation"
              value={formData.transportation}
              onChange={handleChange}
            >
              <option value="">Select Preference</option>
              <option value="car">Car</option>
              <option value="plane">Plane</option>
              <option value="train">Train</option>
              <option value="bus">Bus</option>
            </select>
          </div>
          <div className="form-group">
            <label>Accommodation</label>
            <select
              name="accommodation"
              value={formData.accommodation}
              onChange={handleChange}
            >
              <option value="">Select Preference</option>
              <option value="hotel">Hotel</option>
              <option value="hostel">Hostel</option>
              <option value="apartment">Apartment</option>
              <option value="camping">Camping</option>
            </select>
          </div>
        </div>

        <button className="save-btn" onClick={handleSave}>Save Changes</button>
      </main>
    </div>
  );
};

export default EditPreference;
