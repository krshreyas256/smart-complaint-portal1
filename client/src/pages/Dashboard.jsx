import React from "react";

const Dashboard = () => {
  const complaints = [
    { id: 1, title: "Street Light Not Working", status: "Pending" },
    { id: 2, title: "Garbage not collected", status: "Resolved" },
  ];

  return (
    <div>
      <h2>Your Complaints</h2>
      <ul className="list-group mt-3">
        {complaints.map(c => (
          <li key={c.id} className="list-group-item d-flex justify-content-between">
            {c.title}
            <span className={`badge bg-${c.status === "Resolved" ? "success" : "warning"}`}>
              {c.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
