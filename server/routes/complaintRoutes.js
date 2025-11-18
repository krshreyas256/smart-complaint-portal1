const express = require("express");
const router = express.Router();

const {
  createComplaint,
  getMyComplaints,
  getDepartmentComplaints,
  updateComplaint,
  getAllComplaints,
} = require("../controllers/complaintController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// User creates complaint
router.post("/", protect, createComplaint);

// User gets only their complaints
router.get("/my-complaints", protect, getMyComplaints);

// Admin gets complaints for their department
router.get("/admin", protect, admin, getDepartmentComplaints);

// Admin gets all complaints
router.get("/all", protect, admin, getAllComplaints);

// Admin updates complaint status and adds update
router.put("/:id", protect, admin, updateComplaint);

module.exports = router;
