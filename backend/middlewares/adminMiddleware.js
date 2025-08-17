const { extractTokenFromHeader, isTokenExpired } = require("../utils/jwtUtils");

module.exports = (req, res, next) => {
  try {
    // Check if user exists and is admin
    if (!req.user || !req.user.isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Admin access required", data: null });
    }

    // Check if token is expired
    const token = extractTokenFromHeader(req.headers.authorization);
    if (token && isTokenExpired(token)) {
      return res
        .status(401)
        .json({ success: false, message: "Token expired", data: null });
    }

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Admin middleware error", data: null });
  }
};
