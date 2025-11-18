const express = require("express");
const router = express.Router();

const createComplaint = require("../controllers/complaintController").createComplaint;
const getMyComplaints = require("../controllers/complaintController").getMyComplaints;
const getAllComplaints = require("../controllers/complaintController").getAllComplaints;
const updateStatus = require("../controllers/complaintController").updateStatus;

const protect = require("../middleware/authMiddleware"); // default import
const admin = require("../middleware/adminMiddleware");   // default import

// User creates complaint
router.post("/create", protect, createComplaint);

// User gets only their complaints
router.get("/my-complaints", protect, getMyComplaints);

// Admin gets all complaints
router.get("/all", protect, admin, getAllComplaints);

// Admin updates complaint status
router.put("/update/:id", protect, admin, updateStatus);

module.exports = router;
