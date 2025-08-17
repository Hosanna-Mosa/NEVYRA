const bcrypt = require("bcrypt");
const { generateUserToken } = require("../utils/jwtUtils");
const { User } = require("../models");
const { isEmail, isStrongPassword, isValidPhone, isValidName } = require("../utils/validators");
const { sendOTPEmail } = require("../utils/emailService");

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, address } = req.body;
    
    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All required fields must be provided", data: null });
    }
    
    if (!isValidName(firstName)) {
      return res
        .status(400)
        .json({ success: false, message: "First name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes", data: null });
    }
    
    if (!isValidName(lastName)) {
      return res
        .status(400)
        .json({ success: false, message: "Last name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes", data: null });
    }
    
    if (!isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide a valid email address", data: null });
    }
    
    if (!isStrongPassword(password)) {
      return res
        .status(400)
        .json({ success: false, message: "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character", data: null });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({
          success: false,
          message: "An account with this email already exists",
          data: null,
        });
    }

    // Check phone uniqueness if provided
    if (phone) {
      if (!isValidPhone(phone)) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Please provide a valid phone number",
            data: null,
          });
      }
      
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) {
        return res
          .status(409)
          .json({
            success: false,
            message: "This phone number is already registered",
            data: null,
          });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = new User({
      firstName,
      lastName,
      phone,
      email,
      password: hashedPassword,
      address,
    });
    
    await user.save();

    // Don't generate JWT token - user needs to login separately
    return res.status(201).json({
      success: true,
      message: "Account created successfully! Please login with your new account.",
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Email and password are required",
          data: null,
        });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password", data: null });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password", data: null });
    }

    // Generate JWT token
    const token = generateUserToken({
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin
    });

    return res.json({
      success: true,
      message: "Login successful! Welcome back.",
      data: { 
        token,
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    next(err);
  }
};

exports.profile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found", data: null });
    }
    return res.json({ success: true, message: "Profile retrieved successfully", data: user });
  } catch (err) {
    console.error("Profile fetch error:", err);
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, phone, email } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found", data: null });
    }

    // Update fields if provided
    if (firstName !== undefined) {
      if (!isValidName(firstName)) {
        return res
          .status(400)
          .json({
            success: false,
            message: "First name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes",
            data: null,
          });
      }
      user.firstName = firstName;
    }
    
    if (lastName !== undefined) {
      if (!isValidName(lastName)) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Last name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes",
            data: null,
          });
      }
      user.lastName = lastName;
    }
    
    // Handle phone update with duplicate check
    if (phone !== undefined && phone !== user.phone) {
      if (!isValidPhone(phone)) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Please provide a valid phone number",
            data: null,
          });
      }
      
      const existingPhone = await User.findOne({ phone });
      if (existingPhone && existingPhone._id.toString() !== user._id.toString()) {
        return res
          .status(409)
          .json({
            success: false,
            message: "This phone number is already registered",
            data: null,
          });
      }
      user.phone = phone;
    }

    // Handle email update with validation and duplicate check
    if (email !== undefined && email !== user.email) {
      if (!isEmail(email)) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Please provide a valid email address",
            data: null,
          });
      }
      
      const existingEmail = await User.findOne({ email });
      if (existingEmail && existingEmail._id.toString() !== user._id.toString()) {
        return res
          .status(409)
          .json({
            success: false,
            message: "This email is already registered",
            data: null,
          });
      }
      user.email = email;
    }

    await user.save();
    
    const userData = user.toObject();
    delete userData.password;
    
    return res.json({
      success: true,
      message: "Profile updated successfully",
      data: userData,
    });
  } catch (err) {
    console.error("Profile update error:", err);
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "Email address is required" 
      });
    }

    // Validate email format
    if (!isEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide a valid email address" 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({ 
        success: true, 
        message: "If an account with this email exists, a password reset link has been sent" 
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.save();

    try {
      await sendOTPEmail(email, otp);
      return res.json({ 
        success: true, 
        message: "Password reset OTP has been sent to your email" 
      });
    } catch (emailError) {
      // Reset OTP if email fails
      user.resetPasswordOTP = undefined;
      user.resetPasswordOTPExpires = undefined;
      await user.save();
      
      console.error("Email sending failed:", emailError);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to send reset email. Please try again later." 
      });
    }
  } catch (err) {
    console.error("Forgot password error:", err);
    next(err);
  }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and OTP are required" 
      });
    }

    const user = await User.findOne({ email });
    if (!user || !user.resetPasswordOTP || !user.resetPasswordOTPExpires) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid reset request or OTP expired" 
      });
    }

    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid OTP code" 
      });
    }

    if (user.resetPasswordOTPExpires < new Date()) {
      // Clear expired OTP
      user.resetPasswordOTP = undefined;
      user.resetPasswordOTPExpires = undefined;
      await user.save();
      
      return res.status(400).json({ 
        success: false, 
        message: "OTP has expired. Please request a new one." 
      });
    }

    return res.json({ 
      success: true, 
      message: "OTP verified successfully. You can now reset your password." 
    });
  } catch (err) {
    console.error("OTP verification error:", err);
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "Email, OTP, and new password are required" 
      });
    }

    const user = await User.findOne({ email });
    if (!user || !user.resetPasswordOTP || !user.resetPasswordOTPExpires) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid reset request or OTP expired" 
      });
    }

    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid OTP code" 
      });
    }

    if (user.resetPasswordOTPExpires < new Date()) {
      // Clear expired OTP
      user.resetPasswordOTP = undefined;
      user.resetPasswordOTPExpires = undefined;
      await user.save();
      
      return res.status(400).json({ 
        success: false, 
        message: "OTP has expired. Please request a new one." 
      });
    }

    // Validate new password strength
    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character" 
      });
    }

    // Hash new password and clear OTP
    user.password = await bcrypt.hash(newPassword, 12);
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;
    
    await user.save();

    return res.json({ 
      success: true, 
      message: "Password has been reset successfully. You can now login with your new password." 
    });
  } catch (err) {
    console.error("Password reset error:", err);
    next(err);
  }
};

exports.getAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found", data: null });
    }
    return res.json({ success: true, message: "Addresses fetched", data: user.addresses || [] });
  } catch (err) {
    next(err);
  }
};

exports.addAddress = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, address, city, zipCode, state } = req.body;
    if (!firstName || !lastName || !email || !phone || !address || !city || !zipCode || !state) {
      return res.status(400).json({ success: false, message: "All address fields required including state", data: null });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found", data: null });
    }
    user.addresses = user.addresses || [];
    
    // Ensure all existing addresses have at least an empty state field
    user.addresses.forEach(addr => {
      if (!addr.state) {
        addr.state = ""; // Provide default empty state for existing addresses
      }
    });
    
    user.addresses.push({ firstName, lastName, email, phone, address, city, zipCode, state });
    await user.save();
    return res.status(201).json({ success: true, message: "Address added", data: user.addresses });
  } catch (err) {
    console.error("addAddress error:", err);
    next(err);
  }
};

// Add single address update by index
exports.updateAddressByIndex = async (req, res, next) => {
  try {
    const idx = parseInt(req.params.index, 10);
    const { firstName, lastName, email, phone, address, city, zipCode, state } = req.body;
    
    if ([firstName, lastName, email, phone, address, city, zipCode, state].some(f => !f)) {
      return res.status(400).json({ success: false, message: "All address fields required including state", data: null });
    }
    const user = await User.findById(req.user.id);
    if (!user || !user.addresses || idx < 0 || idx >= user.addresses.length) {
      return res.status(404).json({ success: false, message: "Address not found", data: null });
    }
    
    // Update the specific address with all fields including state
    user.addresses[idx] = { firstName, lastName, email, phone, address, city, zipCode, state };
    
    // Also ensure all other addresses have at least an empty state field to avoid validation errors
    user.addresses.forEach((addr, index) => {
      if (index !== idx && !addr.state) {
        addr.state = ""; // Provide default empty state for existing addresses
      }
    });
    
    await user.save();
    return res.json({ success: true, message: "Address updated", data: user.addresses });
  } catch (err) {
    console.error("updateAddressByIndex error:", err);
    next(err);
  }
};

// Add single address delete by index
exports.deleteAddressByIndex = async (req, res, next) => {
  try {
    const idx = parseInt(req.params.index, 10);
    const user = await User.findById(req.user.id);
    if (!user || !user.addresses || idx < 0 || idx >= user.addresses.length) {
      return res.status(404).json({ success: false, message: "Address not found", data: null });
    }
    user.addresses.splice(idx, 1);
    await user.save();
    return res.json({ success: true, message: "Address deleted", data: user.addresses });
  } catch (err) {
    next(err);
  }
};
