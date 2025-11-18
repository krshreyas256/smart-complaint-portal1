import React, { useState } from "react";
import "../styles/ComplaintForm.css";

function ComplaintForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    state: "",
    district: "",
    department: "",
    image: null,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const departments = [
    "Gram Panchayat",
    "Public Health Department",
    "State Electricity Board",
    "Water Supply Board",
    "Municipal Corporation",
    "Ministry of Education",
  ];

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  const districts = {
    "Andhra Pradesh": ["Visakhapatnam", "Krishna", "Guntur", "Chittoor"],
    Bihar: ["Patna", "East Champaran", "Muzaffarpur", "Darbhanga"],
    Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
    Karnataka: ["Bangalore", "Mysore", "Belgaum", "Mangalore"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur", "Aurangabad"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi"],
    "West Bengal": ["Kolkata", "Asansol", "Siliguri", "Darjeeling"],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData({ ...formData, image: file });
    } else {
      setMessage("Please select a valid image file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.state || !formData.district || !formData.department) {
      setMessage("All fields are required");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Please login first");
      return;
    }

    setLoading(true);

    try {
      const formBody = new FormData();
      formBody.append("title", formData.title);
      formBody.append("description", formData.description);
      formBody.append("state", formData.state);
      formBody.append("district", formData.district);
      formBody.append("department", formData.department);
      if (formData.image) {
        formBody.append("image", formData.image);
      }

      const response = await fetch("http://localhost:5000/api/complaints", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formBody,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Complaint filed successfully!");
        setFormData({
          title: "",
          description: "",
          state: "",
          district: "",
          department: "",
          image: null,
        });
      } else {
        setMessage(data.message || "Error filing complaint");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while filing the complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="complaint-form-container">
      <div className="form-wrapper">
        <h2 className="form-title">File a Complaint</h2>
        {message && <div className={`alert ${message.includes("success") ? "alert-success" : "alert-danger"}`}>{message}</div>}

        <form onSubmit={handleSubmit} className="complaint-form">
          <div className="form-group">
            <label htmlFor="title">Complaint Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              placeholder="Enter complaint title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              placeholder="Describe your complaint in detail"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group form-col-6">
              <label htmlFor="state">State *</label>
              <select
                id="state"
                name="state"
                className="form-control"
                value={formData.state}
                onChange={handleChange}
                required
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group form-col-6">
              <label htmlFor="district">District *</label>
              <select
                id="district"
                name="district"
                className="form-control"
                value={formData.district}
                onChange={handleChange}
                required
                disabled={!formData.state}
              >
                <option value="">Select District</option>
                {formData.state && districts[formData.state] ? (
                  districts[formData.state].map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))
                ) : (
                  <option disabled>Please select a state first</option>
                )}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="department">Department *</label>
            <select
              id="department"
              name="department"
              className="form-control"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="image">Upload Image (Optional)</label>
            <input
              type="file"
              id="image"
              name="image"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
            />
            {formData.image && <small className="text-muted">File selected: {formData.image.name}</small>}
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ComplaintForm;
