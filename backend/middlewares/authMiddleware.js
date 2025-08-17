const { verifyToken, extractTokenFromHeader } = require("../utils/jwtUtils");

module.exports = (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided", data: null });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: err.message || "Invalid token", data: null });
  }
};
