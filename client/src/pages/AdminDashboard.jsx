import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.new.css";

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [activeSection, setActiveSection] = useState("new");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch user to verify admin role
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.user.role === "admin") {
          setUser(data.user);
        } else {
          navigate("/profile");
        }
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    // Fetch all complaints
    const fetchComplaints = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/complaints/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setComplaints(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchComplaints();
  }, [navigate]);

  // Handle status update
  const handleStatusUpdate = async (complaintId, newStatus) => {
    const token = localStorage.getItem("token");
    setUpdating(complaintId);

    try {
      const res = await fetch(`http://localhost:5000/api/complaints/${complaintId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setComplaints((prev) => prev.map((c) => (c._id === complaintId ? updated.complaint : c)));
      } else {
        console.error("Failed to update complaint status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div className="admin-container">Loading...</div>;
  // Partition complaints into sections
  const newComplaints = complaints.filter((c) => c.status === "Pending" && !c.adminId);
  const pendingComplaints = complaints.filter((c) => c.status === "Pending" && c.adminId);
  const ongoingComplaints = complaints.filter((c) => c.status === "In Progress");
  const resolvedComplaints = complaints.filter((c) => c.status === "Resolved");

  const renderComplaintCard = (complaint) => (
    <div key={complaint._id} className="complaint-card">
      {/* Left column: Title, status, and details */}
      <div className="complaint-left">
        <div className="complaint-header">
          <h4>{complaint.title}</h4>
          <span className={`status-badge status-${complaint.status.toLowerCase().replace(/\s+/g, '-')}`}>
            {complaint.status}
          </span>
        </div>

        <div className="complaint-details">
          <p><strong>User:</strong> {complaint.user?.email || "N/A"}</p>
          <p><strong>Description:</strong> {complaint.description}</p>
          <p><strong>Department:</strong> {complaint.department}</p>
          <p><strong>Location:</strong> {complaint.district}, {complaint.state}</p>
          <p><strong>Filed:</strong> {new Date(complaint.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Right column: Image and action buttons */}
      <div className="complaint-right">
        {complaint.imageUrl && (
          <div className="complaint-image-wrapper">
            <img
              src={complaint.imageUrl.startsWith('http') ? complaint.imageUrl : `http://localhost:5000${complaint.imageUrl}`}
              alt="complaint"
            />
          </div>
        )}

        <div className="complaint-actions">
          <button
            className="btn-status pending"
            onClick={() => handleStatusUpdate(complaint._id, "Pending")}
            disabled={updating === complaint._id}
          >
            Pending
          </button>
          <button
            className="btn-status ongoing"
            onClick={() => handleStatusUpdate(complaint._id, "In Progress")}
            disabled={updating === complaint._id}
          >
            Ongoing
          </button>
          <button
            className="btn-status resolved"
            onClick={() => handleStatusUpdate(complaint._id, "Resolved")}
            disabled={updating === complaint._id}
          >
            Resolved
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>
      <p>Welcome, {user?.name}</p>

      {/* Sub-navbar for sections */}
      <nav className="admin-sub-navbar">
        <button
          className={`nav-tab ${activeSection === "new" ? "active" : ""}`}
          onClick={() => setActiveSection("new")}
        >
          New ({newComplaints.length})
        </button>
        <button
          className={`nav-tab ${activeSection === "pending" ? "active" : ""}`}
          onClick={() => setActiveSection("pending")}
        >
          Pending ({pendingComplaints.length})
        </button>
        <button
          className={`nav-tab ${activeSection === "ongoing" ? "active" : ""}`}
          onClick={() => setActiveSection("ongoing")}
        >
          Ongoing ({ongoingComplaints.length})
        </button>
        <button
          className={`nav-tab ${activeSection === "resolved" ? "active" : ""}`}
          onClick={() => setActiveSection("resolved")}
        >
          Resolved ({resolvedComplaints.length})
        </button>
      </nav>

      {/* Section Content */}
      <div className="section-content">
        {activeSection === "new" && (
          <div className="complaints-wrapper">
            {newComplaints.length === 0 ? (
              <p className="no-complaints-msg">No new complaints</p>
            ) : (
              newComplaints.map(renderComplaintCard)
            )}
          </div>
        )}

        {activeSection === "pending" && (
          <div className="complaints-wrapper">
            {pendingComplaints.length === 0 ? (
              <p className="no-complaints-msg">No pending complaints</p>
            ) : (
              pendingComplaints.map(renderComplaintCard)
            )}
          </div>
        )}

        {activeSection === "ongoing" && (
          <div className="complaints-wrapper">
            {ongoingComplaints.length === 0 ? (
              <p className="no-complaints-msg">No ongoing complaints</p>
            ) : (
              ongoingComplaints.map(renderComplaintCard)
            )}
          </div>
        )}

        {activeSection === "resolved" && (
          <div className="complaints-wrapper">
            {resolvedComplaints.length === 0 ? (
              <p className="no-complaints-msg">No resolved complaints</p>
            ) : (
              resolvedComplaints.map(renderComplaintCard)
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
