const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);
router.get("/", cartController.list);
router.get("/summary", cartController.getCartSummary);
router.post("/", cartController.add);
router.put("/:itemId", cartController.update);
router.delete("/:itemId", cartController.remove);
router.delete("/", cartController.clear);

module.exports = router;
