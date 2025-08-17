const express = require('express');
const router = express.Router();
const { testRazorpayConnection, createOrder, createMockOrder, verifyPayment, verifyMockPayment, getPaymentDetails, refundPayment } = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/authMiddleware');

// Test Razorpay connection (no auth required for testing)
router.get('/test', testRazorpayConnection);

// Create payment order
router.post('/create-order', authMiddleware, createOrder);

// Create mock payment order (for testing when Razorpay is not working)
router.post('/create-mock-order', authMiddleware, createMockOrder);

// Verify payment signature
router.post('/verify', authMiddleware, verifyPayment);

// Verify mock payment (for testing)
router.post('/verify-mock', authMiddleware, verifyMockPayment);

// Get payment details
router.get('/:paymentId', authMiddleware, getPaymentDetails);

// Refund payment
router.post('/:paymentId/refund', authMiddleware, refundPayment);

module.exports = router; 