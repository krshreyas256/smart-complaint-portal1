import React, { useState, useEffect } from "react";
import "../styles/AdminPanel.css";

const AdminPanel = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ status: "", adminUpdate: "" });

  useEffect(() => {
    fetchDepartmentComplaints();
  }, []);

  const fetchDepartmentComplaints = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login as admin to view this page");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/complaints/admin", {
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

  const handleEditStart = (complaint) => {
    setEditingId(complaint._id);
    setEditData({ status: complaint.status, adminUpdate: complaint.adminUpdate || "" });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditData({ status: "", adminUpdate: "" });
  };

  const handleUpdateComplaint = async (complaintId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login first");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/complaints/${complaintId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: editData.status,
          adminUpdate: editData.adminUpdate,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update the complaint in state
        setComplaints(
          complaints.map((c) =>
            c._id === complaintId
              ? { ...c, status: editData.status, adminUpdate: editData.adminUpdate }
              : c
          )
        );
        setEditingId(null);
        setError("");
      } else {
        setError(data.message || "Failed to update complaint");
      }
    } catch (err) {
      console.error("Error updating complaint:", err);
      setError("An error occurred while updating the complaint");
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

  return (
    <div className="admin-panel-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage complaints under your department</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading complaints...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="no-complaints">
          <h3>No complaints to review</h3>
          <p>Complaints under your department will appear here</p>
        </div>
      ) : (
        <div className="complaints-table-wrapper">
          <table className="complaints-table">
            <thead>
              <tr>
                <th>Complaint Title</th>
                <th>User</th>
                <th>State / District</th>
                <th>Status</th>
                <th>Filed On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <React.Fragment key={complaint._id}>
                  <tr className="complaint-row">
                    <td>
                      <strong>{complaint.title}</strong>
                    </td>
                    <td>{complaint.user?.name || "User"}</td>
                    <td>
                      {complaint.state} / {complaint.district}
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn-action btn-edit"
                        onClick={() => handleEditStart(complaint)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>

                  {editingId === complaint._id && (
                    <tr className="edit-row">
                      <td colSpan="6">
                        <div className="edit-form">
                          <div className="edit-section">
                            <h4>Complaint Details</h4>
                            <p className="complaint-description">{complaint.description}</p>
                            {complaint.imageUrl && (
                              <img src={complaint.imageUrl} alt="Complaint" className="complaint-thumbnail" />
                            )}
                          </div>

                          <div className="edit-section">
                            <label>Update Status</label>
                            <select
                              value={editData.status}
                              onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                              className="form-control"
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Resolved">Resolved</option>
                            </select>
                          </div>

                          <div className="edit-section">
                            <label>Add Progress Update</label>
                            <textarea
                              value={editData.adminUpdate}
                              onChange={(e) =>
                                setEditData({ ...editData, adminUpdate: e.target.value })
                              }
                              placeholder="Describe the progress or resolution..."
                              className="form-control"
                              rows="4"
                            />
                          </div>

                          <div className="edit-actions">
                            <button
                              className="btn-save"
                              onClick={() => handleUpdateComplaint(complaint._id)}
                            >
                              Save Changes
                            </button>
                            <button className="btn-cancel" onClick={handleEditCancel}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
