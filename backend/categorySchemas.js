// backend/categorySchemas.js
module.exports.categorySchemas = {
  Medical: ["brand", "expiryDate", "drugName", "dosage", "packSize"],
  Groceries: ["brand", "weight", "type", "expiryDate"],
  FashionBeauty: ["size", "color", "material", "brand", "gender", "occasion"],
  Devices: ["brand", "model", "warranty", "batteryLife", "storage"],
  Electrical: ["voltage", "wattage", "brand", "type", "useCase"],
  Automotive: ["brand", "compatibleWith", "material", "warranty", "type"],
  Sports: ["sport", "material", "brand", "size"],
  HomeInterior: ["material", "dimensions", "color", "style", "brand"]
  // Add more as needed
};
