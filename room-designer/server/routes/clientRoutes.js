const express = require("express");
const { protect } = require("../middleware/auth");
const {
  getClients,
  createClient,
  getClient,
  updateClient,
  deleteClient,
} = require("../controllers/clientController");

const router = express.Router();

// Protected routes
router.get("/:userId", protect, getClients);
router.post("/:userId", protect, createClient);
router.get("/detail/:clientId", protect, getClient);
router.put("/:clientId", protect, updateClient);
router.delete("/:clientId", protect, deleteClient);

module.exports = router;
