const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const { generateAdminToken } = require("../utils/jwtUtils");
const { isEmail, isStrongPassword } = require("../utils/validators");
const { sendOTPEmail } = require("../utils/emailService");

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

// Admin forgot password - send OTP
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email address is required" });
    }
    if (!isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please provide a valid email address" });
    }

    const admin = await Admin.findOne({ email });
    // Always respond success to avoid email enumeration
    if (!admin) {
      return res.json({ success: true, message: "If an account with this email exists, an OTP has been sent" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.resetPasswordOTP = otp;
    admin.resetPasswordOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
    await admin.save();

    try {
      await sendOTPEmail(email, otp);
      return res.json({ success: true, message: "Password reset OTP has been sent to your email" });
    } catch (emailError) {
      admin.resetPasswordOTP = undefined;
      admin.resetPasswordOTPExpires = undefined;
      await admin.save();
      console.error("Admin reset email sending failed:", emailError);
      return res.status(500).json({ success: false, message: "Failed to send reset email. Please try again later." });
    }
  } catch (err) {
    console.error("Admin forgot password error:", err);
    next(err);
  }
};

// Admin verify OTP
exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }
    const admin = await Admin.findOne({ email });
    if (!admin || !admin.resetPasswordOTP || !admin.resetPasswordOTPExpires) {
      return res.status(400).json({ success: false, message: "Invalid reset request or OTP expired" });
    }
    if (admin.resetPasswordOTP !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP code" });
    }
    if (admin.resetPasswordOTPExpires < new Date()) {
      admin.resetPasswordOTP = undefined;
      admin.resetPasswordOTPExpires = undefined;
      await admin.save();
      return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
    }
    return res.json({ success: true, message: "OTP verified successfully. You can now reset your password." });
  } catch (err) {
    console.error("Admin OTP verification error:", err);
    next(err);
  }
};

// Admin reset password
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: "Email, OTP, and new password are required" });
    }
    const admin = await Admin.findOne({ email });
    if (!admin || !admin.resetPasswordOTP || !admin.resetPasswordOTPExpires) {
      return res.status(400).json({ success: false, message: "Invalid reset request or OTP expired" });
    }
    if (admin.resetPasswordOTP !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP code" });
    }
    if (admin.resetPasswordOTPExpires < new Date()) {
      admin.resetPasswordOTP = undefined;
      admin.resetPasswordOTPExpires = undefined;
      await admin.save();
      return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
    }
    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character" });
    }
    admin.password = await bcrypt.hash(newPassword, 12);
    admin.resetPasswordOTP = undefined;
    admin.resetPasswordOTPExpires = undefined;
    await admin.save();
    return res.json({ success: true, message: "Password has been reset successfully. You can now login with your new password." });
  } catch (err) {
    console.error("Admin password reset error:", err);
    next(err);
  }
};