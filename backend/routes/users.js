const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const userSearchController = require("../controllers/userSearchController");

router.get("/profile", authMiddleware, authController.profile);

// Recent searches endpoints
router.get("/recent-searches", authMiddleware, userSearchController.getRecentSearches);
router.post("/recent-searches", authMiddleware, userSearchController.addRecentSearch);

// Popular searches endpoint (no auth required)
router.get("/popular-searches", userSearchController.getPopularSearches);

module.exports = router;
