import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./Layout.css";

const Layout = () => {
  const navigate = useNavigate();

  // ✅ Redirect to Landing Page on button click
  const handleEndTrip = () => {
    navigate("/landing");
  };

  return (
    <div className="home-container">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="logo">TravelZen AI</div>
        <ul className="nav-list">
          <li className="nav-item home">
            <Link to="/home">🏠 Home</Link>
          </li>
          <li className="nav-item trips">
            <Link to="/trips">📂 My Trips</Link>
          </li>
          <li className="nav-item memories">
            <Link to="/memories">📸 Memories</Link>
          </li>
          <li className="nav-item journal">
            <Link to="/journal">📘 Journal</Link>
          </li>
          <li className="nav-item budget">
            <Link to="/budget">💰 Budget</Link>
          </li>
          <li className="nav-item preference">
            <Link to="/preferences">⚙ Edit Preferences</Link>
          </li>
          <li className="nav-item profile">
            <Link to="/profile">👤 My Profile</Link>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {/* ✅ Fixed End My Trip Button in Top-Right Corner */}
        <button className="end-trip-btn" onClick={handleEndTrip}>
          End My Trip
        </button>

        {/* Page Content */}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
