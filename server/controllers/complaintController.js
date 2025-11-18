const Complaint = require("../models/Complaint");

// Create complaint (User)
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, state, district, department } = req.body;

    if (!title || !description || !state || !district || !department) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const complaint = new Complaint({
      user: req.user.id,
      title,
      description,
      state,
      district,
      department,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await complaint.save();
    await complaint.populate("user", "name email");

    res.json({ message: "Complaint submitted successfully", complaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error submitting complaint" });
  }
};

// Get logged-in user's complaints
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching complaints" });
  }
};

// Admin: get complaints for their department
exports.getDepartmentComplaints = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can access this" });
    }

    // For now, get all complaints (in production, map admin to department)
    const complaints = await Complaint.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    
    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching complaints" });
  }
};

// Admin: update complaint status and add admin update
exports.updateComplaint = async (req, res) => {
  try {
    const { status, adminUpdate } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can update complaints" });
    }

    complaint.status = status || complaint.status;
    complaint.adminUpdate = adminUpdate || complaint.adminUpdate;
    complaint.adminId = req.user.id;
    complaint.updatedAt = Date.now();

    await complaint.save();
    await complaint.populate("user", "name email");

    res.json({ message: "Complaint updated successfully", complaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating complaint" });
  }
};

// Get all complaints (admin only)
exports.getAllComplaints = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can access this" });
    }

    const complaints = await Complaint.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching complaints" });
  }
};
