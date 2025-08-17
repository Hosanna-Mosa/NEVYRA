const jwt = require("jsonwebtoken");

// JWT Configuration
const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this-in-production",
  expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  adminExpiresIn: process.env.JWT_ADMIN_EXPIRES_IN || "7d",
  refreshThreshold: process.env.JWT_REFRESH_THRESHOLD || 60 // minutes
};

/**
 * Generate JWT token for regular users
 * @param {Object} payload - User data to encode in token
 * @param {string} payload.id - User ID
 * @param {string} payload.email - User email
 * @param {boolean} payload.isAdmin - Whether user is admin
 * @returns {string} JWT token
 */
const generateUserToken = (payload) => {
  try {
    if (!payload.id || !payload.email) {
      throw new Error("Missing required payload fields: id and email");
    }

    return jwt.sign(
      {
        id: payload.id,
        email: payload.email,
        isAdmin: payload.isAdmin || false,
        type: 'user'
      },
      JWT_CONFIG.secret,
      { expiresIn: JWT_CONFIG.expiresIn }
    );
  } catch (error) {
    throw new Error(`Failed to generate user token: ${error.message}`);
  }
};

/**
 * Generate JWT token for admin users
 * @param {Object} payload - Admin data to encode in token
 * @param {string} payload.id - Admin ID
 * @param {string} payload.email - Admin email
 * @returns {string} JWT token
 */
const generateAdminToken = (payload) => {
  try {
    if (!payload.id || !payload.email) {
      throw new Error("Missing required payload fields: id and email");
    }

    return jwt.sign(
      {
        id: payload.id,
        email: payload.email,
        isAdmin: true,
        type: 'admin'
      },
      JWT_CONFIG.secret,
      { expiresIn: JWT_CONFIG.adminExpiresIn }
    );
  } catch (error) {
    throw new Error(`Failed to generate admin token: ${error.message}`);
  }
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
const verifyToken = (token) => {
  try {
    if (!token) {
      throw new Error("No token provided");
    }

    const decoded = jwt.verify(token, JWT_CONFIG.secret);
    
    // Additional validation
    if (!decoded.id || !decoded.email) {
      throw new Error("Invalid token payload");
    }

    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error("Token has expired");
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error("Invalid token");
    } else if (error.name === 'NotBeforeError') {
      throw new Error("Token not active yet");
    } else {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }
};

/**
 * Decode JWT token without verification (for client-side use)
 * @param {string} token - JWT token to decode
 * @returns {Object} Decoded token payload
 */
const decodeToken = (token) => {
  try {
    if (!token) {
      throw new Error("No token provided");
    }

    const decoded = jwt.decode(token);
    if (!decoded) {
      throw new Error("Invalid token format");
    }

    return decoded;
  } catch (error) {
    throw new Error(`Token decoding failed: ${error.message}`);
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token to check
 * @returns {boolean} True if token is expired, false otherwise
 */
const isTokenExpired = (token) => {
  try {
    if (!token) return true;
    
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

/**
 * Get token expiration time
 * @param {string} token - JWT token
 * @returns {Date|null} Expiration date or null if invalid
 */
const getTokenExpiration = (token) => {
  try {
    if (!token) return null;
    
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return null;
    
    return new Date(decoded.exp * 1000);
  } catch (error) {
    return null;
  }
};

/**
 * Get time until token expires
 * @param {string} token - JWT token
 * @returns {number|null} Seconds until expiration or null if invalid
 */
const getTimeUntilExpiration = (token) => {
  try {
    if (!token) return null;
    
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return null;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return Math.max(0, decoded.exp - currentTime);
  } catch (error) {
    return null;
  }
};

/**
 * Refresh token if it's close to expiration
 * @param {string} token - Current JWT token
 * @param {number} thresholdMinutes - Minutes before expiration to refresh (default: 60)
 * @returns {string|null} New token if refreshed, null if not needed
 */
const refreshTokenIfNeeded = (token, thresholdMinutes = JWT_CONFIG.refreshThreshold) => {
  try {
    if (!token) return null;
    
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return null;
    
    const currentTime = Math.floor(Date.now() / 1000);
    const thresholdSeconds = thresholdMinutes * 60;
    
    if (decoded.exp - currentTime < thresholdSeconds) {
      // Token expires soon, generate new one
      const { id, email, isAdmin, type } = decoded;
      if (type === 'admin' || isAdmin) {
        return generateAdminToken({ id, email });
      } else {
        return generateUserToken({ id, email, isAdmin });
      }
    }
    
    return null; // Token is still valid
  } catch (error) {
    return null;
  }
};

/**
 * Extract token from authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Token or null if invalid format
 */
const extractTokenFromHeader = (authHeader) => {
  try {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }
    return authHeader.split(" ")[1];
  } catch (error) {
    return null;
  }
};

/**
 * Validate token structure and content
 * @param {string} token - JWT token to validate
 * @returns {Object} Validation result with isValid and errors
 */
const validateToken = (token) => {
  const result = {
    isValid: false,
    errors: [],
    payload: null
  };

  try {
    if (!token) {
      result.errors.push("No token provided");
      return result;
    }

    const decoded = jwt.decode(token);
    if (!decoded) {
      result.errors.push("Invalid token format");
      return result;
    }

    // Check required fields
    if (!decoded.id) result.errors.push("Missing user ID");
    if (!decoded.email) result.errors.push("Missing email");
    if (decoded.isAdmin === undefined) result.errors.push("Missing admin flag");

    // Check expiration
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      result.errors.push("Token expired");
    }

    result.payload = decoded;
    result.isValid = result.errors.length === 0;
    
    return result;
  } catch (error) {
    result.errors.push(`Validation error: ${error.message}`);
    return result;
  }
};

module.exports = {
  JWT_CONFIG,
  generateUserToken,
  generateAdminToken,
  verifyToken,
  decodeToken,
  isTokenExpired,
  getTokenExpiration,
  getTimeUntilExpiration,
  refreshTokenIfNeeded,
  extractTokenFromHeader,
  validateToken
};
