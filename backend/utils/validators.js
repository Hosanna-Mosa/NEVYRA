// Email validation - more comprehensive
exports.isEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length > 5 && email.length < 255;
};

// Strong password validation - at least 8 characters with complexity requirements
exports.isStrongPassword = (password) => {
  if (password.length < 8) return false;
  
  // Must contain at least one uppercase letter
  if (!/[A-Z]/.test(password)) return false;
  
  // Must contain at least one lowercase letter
  if (!/[a-z]/.test(password)) return false;
  
  // Must contain at least one number
  if (!/\d/.test(password)) return false;
  
  // Must contain at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;
  
  return true;
};

// Phone number validation
exports.isValidPhone = (phone) => {
  if (!phone) return true; // Optional field
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Name validation
exports.isValidName = (name) => {
  if (!name || name.trim().length < 2) return false;
  if (name.length > 50) return false;
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  return nameRegex.test(name.trim());
};
