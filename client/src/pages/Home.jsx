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
    </div>
  );
};

export default Home;
