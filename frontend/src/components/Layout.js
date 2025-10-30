import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./Layout.css"; // optional styling

const Layout = () => {
  return (
    <div className="home-container">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="logo">TravelZen AI</div>
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/home">🏠 Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/trips">📁 My Trips</Link>
          </li>
          <li className="nav-item">
            <Link to="/memories">📸 Memories</Link>
          </li>
          <li className="nav-item">
            <Link to="/journal">📓 Journal</Link>
          </li>
          <li className="nav-item">
            <Link to="/budget">💰 Budget</Link>
          </li>
          <li className="nav-item">
            <Link to="/editpreferences">⚙️ Edit Preferences</Link>
          </li>
          <li className="nav-item">
            <Link to="/profile">👤 My Profile</Link>
          </li>
        </ul>
      </nav>

      {/* Main content for each page */}
      <main className="main-content">
        <Outlet /> {/* This is where nested pages render */}
      </main>
    </div>
  );
};

export default Layout;
