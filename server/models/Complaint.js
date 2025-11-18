const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  department: { type: String, required: true }, // department name
  imageUrl: { type: String },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved"],
    default: "Pending"
  },
  adminUpdate: { type: String, default: "" }, // admin's progress update
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // admin who updated
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Complaint", complaintSchema);
