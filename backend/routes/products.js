
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

router.get("/", productController.list);
router.get("/all", productController.getAll);
router.get("/sections", productController.sections);
router.get("/top-picks", productController.topPicks);
router.get("/suggest", productController.suggest);
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
=======
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

router.get("/", productController.list);
router.get("/all", productController.getAll);
router.get("/top", productController.topByCategory);
router.get("/:id", productController.details);
router.get("/:id/reviews", productController.getReviews);

router.post("/", authMiddleware, adminMiddleware, productController.create);
router.put("/:id", authMiddleware, adminMiddleware, productController.update);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  productController.remove
);

// Authenticated users can add or update reviews
router.post(
  "/:id/reviews",
  authMiddleware,
  productController.addOrUpdateReview
);

router.delete(
  "/:id/reviews",
  authMiddleware,
  productController.deleteMyReview
);

// Admin or owner review operations by review id
router.put(
  "/:id/reviews/:reviewId",
  authMiddleware,
  productController.updateReview
);

router.delete(
  "/:id/reviews/:reviewId",
  authMiddleware,
  productController.deleteReview
);

module.exports = router;

