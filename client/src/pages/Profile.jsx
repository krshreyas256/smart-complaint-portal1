import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
        } else {
          // invalid token or error
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) return <div className="profile-container">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>My Profile</h2>
        {user ? (
          <div className="profile-details">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>

            <div style={{ marginTop: '1.25rem' }}>
              {user.role !== 'admin' && (
                <button
                  className="btn-delete"
                  onClick={async () => {
                    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone. You will need to register again to use the site.');
                    if (!confirmed) return;
                    try {
                      const token = localStorage.getItem('token');
                      const res = await fetch('http://localhost:5000/api/auth/me', {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      const data = await res.json();
                      if (res.ok) {
                        // remove token and redirect to register
                        localStorage.removeItem('token');
                        alert(data.message || 'Account deleted');
                        navigate('/register');
                      } else {
                        alert(data.message || 'Failed to delete account');
                      }
                    } catch (err) {
                      console.error('Delete account error:', err);
                      alert('An error occurred while deleting the account');
                    }
                  }}
                >
                  Delete Account
                </button>
              )}
            </div>
          </div>
        ) : (
          <p>User information not available.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
