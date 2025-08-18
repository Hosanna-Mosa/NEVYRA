const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

router.post("/login", adminController.login);
router.put("/password", authMiddleware, adminMiddleware, adminController.updatePassword);
// Admin password reset flow
router.post("/forgot-password", adminController.forgotPassword);
router.post("/verify-otp", adminController.verifyOTP);
router.post("/reset-password", adminController.resetPassword);

module.exports = router; 