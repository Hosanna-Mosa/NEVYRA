const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);
router.post("/", orderController.create);
router.get("/", orderController.list);
router.get("/:id", orderController.details);

module.exports = router;
