import React, { useState } from "react";

const Register = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Registered as ${user.name}`);
  };

  return (
    <div className="col-md-6 mx-auto">
      <h2 className="text-center mb-3">Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" className="form-control mb-3" placeholder="Full Name"
          value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} required />
        <input type="email" className="form-control mb-3" placeholder="Email"
          value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} required />
        <input type="password" className="form-control mb-3" placeholder="Password"
          value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} required />
        <button className="btn btn-success w-100">Register</button>
      </form>
    </div>
  );
};

export default Register;
