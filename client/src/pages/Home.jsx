import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">Smart Complaint Portal</h1>
        <p className="hero-subtitle">
          Register your complaints quickly and track their status easily.
        </p>
      </div>

      <div className="cta-section">
        <Link to="/login" className="btn-primary">
          Login
        </Link>
        <Link to="/register" className="btn-secondary">
          Register
        </Link>
      </div>

      <div className="features-section">
        <h2>Why Use Smart Complaint Portal?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Easy Filing</h3>
            <p>File complaints with just a few clicks.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Real-time Tracking</h3>
            <p>Track your complaint status in real-time.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast Resolution</h3>
            <p>Get quick and effective resolutions from officials.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Secure & Private</h3>
            <p>Your data is safe and secure with us.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
