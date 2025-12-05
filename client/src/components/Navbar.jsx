import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    // Fetch user role if logged in
    if (token) {
      const fetchUserRole = async () => {
        try {
          const res = await fetch("http://localhost:5000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (res.ok) {
            setUserRole(data.user.role);
          }
        } catch (err) {
          console.error("Error fetching user role:", err);
        }
      };
      fetchUserRole();
    }
  }, [location]);

  useEffect(() => {
    const isDark = theme === "dark";
    document.documentElement.classList.toggle("dark-theme", isDark);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  // Hide the navbar entirely on the entry page (root path)
  const hidePaths = ["/", "/login", "/register"];
  if (location && hidePaths.includes(location.pathname)) {
    return null;
  }

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" to="/profile">
          Smart Complaint Portal
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isLoggedIn && userRole === "admin" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    My Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin-dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn-logout" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link theme-toggle"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                  >
                    {theme === "light" ? "🌙" : "☀️"}
                  </button>
                </li>
              </>
            )}

            {isLoggedIn && userRole === "user" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    My Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/complaint">
                    File Complaint
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn-logout" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link theme-toggle"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                  >
                    {theme === "light" ? "🌙" : "☀️"}
                  </button>
                </li>
              </>
            )}

            {!isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
