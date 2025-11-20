import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [updating, setUpdating] = useState(null);
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
        setComplaints(
          complaints.map((c) => (c._id === complaintId ? updated.complaint : c))
        );
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

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>
      <p>Welcome, {user?.name}</p>
      <div className="complaints-section">
        <h3>All Complaints ({complaints.length})</h3>
        {complaints.length === 0 ? (
          <p>No complaints filed yet.</p>
        ) : (
          <div className="complaints-wrapper">
            {complaints.map((complaint) => (
              <div key={complaint._id} className="complaint-card">
                <div className="complaint-header">
                  <h4>{complaint.title}</h4>
                  <span className={`status-badge status-${complaint.status.toLowerCase()}`}>
                    {complaint.status}
                  </span>
                </div>
                <div className="complaint-details">
                  <p><strong>User:</strong> {complaint.user?.email || "N/A"}</p>
                  <p><strong>Description:</strong> {complaint.description}</p>
                  <p><strong>Department:</strong> {complaint.department}</p>
                  <p><strong>Location:</strong> {complaint.district}, {complaint.state}</p>
                  <p><strong>Filed:</strong> {new Date(complaint.createdAt).toLocaleDateString()}</p>
                  {complaint.imageUrl && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <img src={`http://localhost:5000${complaint.imageUrl}`} alt="complaint" style={{ maxWidth: '100%', borderRadius: 6 }} />
                    </div>
                  )}
                </div>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
