import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login to view your complaints");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/complaints/my-complaints", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setComplaints(data);
        setError("");
      } else {
        setError(data.message || "Failed to fetch complaints");
      }
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError("An error occurred while fetching complaints");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "status-resolved";
      case "In Progress":
        return "status-progress";
      case "Pending":
        return "status-pending";
      default:
        return "status-pending";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Resolved":
        return "✓";
      case "In Progress":
        return "⏳";
      case "Pending":
        return "⏱";
      default:
        return "•";
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Your Complaints Dashboard</h1>
        <p>Track the status of your filed complaints</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading your complaints...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="no-complaints">
          <h3>No complaints filed yet</h3>
          <p>Your filed complaints will appear here</p>
        </div>
      ) : (
        <div className="complaints-grid">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="complaint-card">
              <div className="card-header">
                <h3>{complaint.title}</h3>
                <span className={`status-badge ${getStatusColor(complaint.status)}`}>
                  {getStatusIcon(complaint.status)} {complaint.status}
                </span>
              </div>

              <div className="card-body">
                <p className="description">{complaint.description}</p>

                <div className="details-grid">
                  <div className="detail-item">
                    <label>State</label>
                    <span>{complaint.state}</span>
                  </div>
                  <div className="detail-item">
                    <label>District</label>
                    <span>{complaint.district}</span>
                  </div>
                  <div className="detail-item">
                    <label>Department</label>
                    <span>{complaint.department}</span>
                  </div>
                  <div className="detail-item">
                    <label>Filed On</label>
                    <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {complaint.imageUrl && (
                  <div className="image-container">
                    <img src={complaint.imageUrl} alt="Complaint" />
                  </div>
                )}

                {complaint.adminUpdate && (
                  <div className="admin-update">
                    <h4>Latest Update from Admin:</h4>
                    <p>{complaint.adminUpdate}</p>
                    <small>Updated on {new Date(complaint.updatedAt).toLocaleDateString()}</small>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
