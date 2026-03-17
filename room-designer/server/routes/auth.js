const express = require("express");
const router = express.Router();
const { register, login, getMe, updateProfile, logout } = require("../controllers/authController");
const { protect, optionalAuth } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", optionalAuth, getMe);
router.put("/profile", protect, updateProfile);

module.exports = router;
