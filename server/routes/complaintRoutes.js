const express = require("express");
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// ensure uploads folder exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  }
});

const upload = multer({ storage });

const {
  createComplaint,
  getMyComplaints,
  getDepartmentComplaints,
  updateComplaint,
  getAllComplaints,
} = require("../controllers/complaintController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// User creates complaint (supports optional image upload)
router.post("/", protect, upload.single('image'), createComplaint);

// User gets only their complaints
router.get("/my-complaints", protect, getMyComplaints);

// Admin gets complaints for their department
router.get("/admin", protect, admin, getDepartmentComplaints);

// Admin gets all complaints
router.get("/all", protect, admin, getAllComplaints);

// Admin updates complaint status and adds update
router.put("/:id", protect, admin, updateComplaint);

module.exports = router;
