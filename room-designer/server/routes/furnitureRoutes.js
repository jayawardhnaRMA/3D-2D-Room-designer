const express = require("express");
const { optionalAuth } = require("../middleware/auth");
const {
  getFurnitureItems,
  createFurnitureItem,
  getFurnitureItem,
  updateFurnitureItem,
} = require("../controllers/furnitureController");

const router = express.Router();

// Public routes (anyone can view)
router.get("/", getFurnitureItems);
router.get("/:itemId", getFurnitureItem);

// Protected routes (only admin)
router.post("/", optionalAuth, createFurnitureItem);
router.put("/:itemId", optionalAuth, updateFurnitureItem);

module.exports = router;
