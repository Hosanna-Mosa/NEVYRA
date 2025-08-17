const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// User routes (require authentication)
router.use(authMiddleware);
router.post("/", orderController.createOrder);
router.get("/", orderController.getUserOrders);
router.get("/:orderId", orderController.getOrderById);
router.get("/number/:orderNumber", orderController.getOrderByNumber);
router.put("/:orderId/cancel", orderController.cancelOrder);

// Admin routes (require admin privileges)
router.get("/admin/all", adminMiddleware, orderController.getAllOrders);
router.put("/admin/:orderId/status", adminMiddleware, orderController.updateOrderStatus);

module.exports = router;
