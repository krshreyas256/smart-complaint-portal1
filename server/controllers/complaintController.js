const Complaint = require("../models/Complaint");

// Create complaint (User)
exports.createComplaint = async (req, res) => {
  try {
    const { category, description, location } = req.body;

    const complaint = new Complaint({
      user: req.user.id,
      category,
      description,
      location
    });

    await complaint.save();

    res.json({ message: "Complaint submitted successfully", complaint });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get logged-in user's complaints
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Admin: get all complaints
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate("user", "name email");
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Admin: update complaint status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    complaint.status = status;
    await complaint.save();

    res.json({ message: "Status updated", complaint });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
