const admin = (req, res, next) => {
  // Check if user has admin role from JWT payload
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access required" });
  }
};

module.exports = admin; // default export, no curly braces
