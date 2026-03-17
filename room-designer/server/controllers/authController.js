const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// Register (Customer Only)
exports.register = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    // Create user (Always as customer)
    user = await User.create({
      name,
      email,
      password,
      avatar: avatar || "https://i.pravatar.cc/68?img=1",
      role: "customer",
    });

    // Create token
    const token = generateToken(user._id, user.role);

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email and password",
      });
    }

    // Check for user - wrapped in try-catch for database errors
    let user;
    try {
      user = await User.findOne({ email }).select("+password");
    } catch (dbErr) {
      console.error("Database error during user lookup:", dbErr.message);
      return res.status(503).json({
        success: false,
        message: "Database service unavailable. Please try again later.",
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if password matches
    let isMatch = false;
    try {
      isMatch = await user.matchPassword(password);
    } catch (passwordErr) {
      console.error("Password match error:", passwordErr);
      return res.status(500).json({
        success: false,
        message: "Authentication error",
      });
    }
    
    if (!isMatch) {
      console.log(`Login failed for ${email} - password mismatch`);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Prevent admin from logging in as customer
    if (user.role === "designer" && email === "admin@roomio.com") {
      // Admin can only log in as designer, not customer
      // This is an admin user, allow designer login only
    } else if (user.role === "designer") {
      // Non-admin designer users cannot log in
      return res.status(403).json({
        success: false,
        message: "Designer access is restricted to administrators only",
      });
    }

    // Create token
    const token = generateToken(user._id, user.role);

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log(`Login successful for user: ${email}`);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred during login",
    });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    // If no user in request, return not authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
        user: null,
      });
    }

    // Fetch user from database
    let user;
    try {
      user = await User.findById(req.user.id);
    } catch (dbErr) {
      console.error("Database error fetching user:", dbErr.message);
      return res.status(503).json({
        success: false,
        message: "Database service unavailable",
        user: null,
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
        user: null,
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("GetMe error:", error.message);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
      user: null,
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, avatar, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update name if provided
    if (name) {
      user.name = name;
    }

    // Update avatar if provided
    if (avatar) {
      user.avatar = avatar;
    }

    // Update password if provided
    if (newPassword) {
      // Verify current password
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password is required to change password",
        });
      }

      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      user.password = newPassword;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    // Clear the HTTP-only cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
