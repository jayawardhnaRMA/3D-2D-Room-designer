const jwt = require("jsonwebtoken");

// Protect routes - requires authentication
exports.protect = async (req, res, next) => {
  try {
    // Check for token in cookies (HTTP-only cookie)
    let token = req.cookies.token;

    // Fallback to header for backward compatibility
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      console.log("No token found - rejecting request");
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      console.log("Token verification failed:", error.message);
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Optional auth - doesn't require authentication, but extracts user if available
exports.optionalAuth = async (req, res, next) => {
  try {
    // Check for token in cookies
    let token = req.cookies.token;

    // Fallback to header
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
      } catch (error) {
        // Token is invalid, continue without user
        req.user = null;
      }
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Authorize by role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};
