const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

router.get("/", productController.list);
router.get("/all", productController.getAll);
router.get("/:id", productController.details);

router.post("/", authMiddleware, adminMiddleware, productController.create);
router.put("/:id", authMiddleware, adminMiddleware, productController.update);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  productController.remove
);

module.exports = router;
