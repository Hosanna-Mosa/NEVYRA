// backend/utils/validateAttributes.js
const { categorySchemas } = require("../categorySchemas");

function validateAttributes(category, attributes) {
  const validFields = categorySchemas[category];
  if (!validFields) return false;
  return Object.keys(attributes).every((key) => validFields.includes(key));
}

module.exports = { validateAttributes };
