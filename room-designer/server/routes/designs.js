const express = require("express");
const router = express.Router();
const {
  getUserDesigns,
  getDesign,
  createDesign,
  updateDesign,
  deleteDesign,
} = require("../controllers/designController");
const { protect } = require("../middleware/auth");

// Get all designs for a user
router.get("/user/:userId", protect, getUserDesigns);

// Get single design
router.get("/:designId", protect, getDesign);

// Create new design
router.post("/user/:userId", protect, createDesign);

// Update design
router.put("/:designId", protect, updateDesign);

// Delete design
router.delete("/:designId", protect, deleteDesign);

module.exports = router;
