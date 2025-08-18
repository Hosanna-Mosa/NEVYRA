const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const { generateAdminToken } = require("../utils/jwtUtils");

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    const token = generateAdminToken({
      id: admin._id,
      email: admin.email
    });
    return res.json({
      success: true,
      message: "Login successful",
      data: { token },
    });
  } catch (err) {
    next(err);
  }
};

// Update password endpoint
exports.updatePassword = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Current and new password required" });
    }
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }
    const match = await bcrypt.compare(currentPassword, admin.password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }
    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();
    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
}; 