const fetch = require('node-fetch'); // we’ll use fetch to call API

// Replace these values
const JWT_TOKEN = "<YOUR_JWT_TOKEN>";  // token from login
const DEPARTMENT_ID = "<YOUR_DEPARTMENT_ID>"; // id from /api/departments

const complaintData = {
  departmentId: DEPARTMENT_ID,
  title: "Street light not working",
  description: "The street light near my house is not working for 3 days.",
  location: "MG Road, Bangalore",
  imageUrl: "http://example.com/image.jpg"
};

async function fileComplaint() {
  try {
    const res = await fetch("http://localhost:5000/api/complaints", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JWT_TOKEN}`
      },
      body: JSON.stringify(complaintData)
    });

    const data = await res.json();
    console.log("Response:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}

fileComplaint();
