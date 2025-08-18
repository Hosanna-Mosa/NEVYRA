const { Product, User } = require("../models");
const { validateAttributes } = require("../utils/validateAttributes");
const { categorySchemas } = require("../categorySchemas");

function mapProductId(product) {
  if (!product) return product;
  const obj = product.toObject ? product.toObject() : { ...product };
  obj.id = obj._id;
  delete obj._id;
  // Ensure attributes is a plain object
  if (obj.attributes && typeof obj.attributes === "object") {
    if (obj.attributes instanceof Map) {
      obj.attributes = Object.fromEntries(obj.attributes);
    } else if (obj.attributes.toObject) {
      obj.attributes = obj.attributes.toObject();
    }
  }
  return obj;
}

exports.list = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) {
      const escaped = String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");
      filter.$or = [
        { title: { $regex: regex } },
        { category: { $regex: regex } },
        { subCategory: { $regex: regex } },
      ];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [products, count] = await Promise.all([
      Product.find(filter)
        .skip(skip)
        .limit(parseInt(limit))
        .select(
          "title price category subCategory images inStock rating reviews stockQuantity soldCount attributes"
        ),
      Product.countDocuments(filter),
    ]);
    const mappedProducts = products.map(mapProductId);
    res.json({
      success: true,
      message: "Products fetched",
      data: mappedProducts,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.details = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
   
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found", data: null });
    
    const sendData = mapProductId(product);
    
    res.json({
      success: true,
      message: "Product details",
      data: sendData,
    });
  } catch (err) {
    next(err);
  }
};

// Get top products in a category by sold count
exports.topByCategory = async (req, res, next) => {
  try {
    const { category, limit = 6, excludeId } = req.query;
    if (!category) {
      return res.status(400).json({ success: false, message: "category is required", data: null });
    }
    const filter = { category };
    if (excludeId) {
      filter._id = { $ne: excludeId };
    }
    const topProducts = await Product.find(filter)
      .sort({ soldCount: -1 })
      .limit(parseInt(limit))
      .select(
        "title price category subCategory images inStock rating reviews stockQuantity soldCount attributes createdAt updatedAt"
      );
    const mapped = topProducts.map(mapProductId);
    return res.json({ success: true, message: "Top products by category", data: mapped });
  } catch (err) {
    next(err);
  }
};

// Get all reviews for a product
exports.getReviews = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).select("reviewsList");
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found", data: null });

    return res.json({
      success: true,
      message: "Product reviews",
      data: product.reviewsList || [],
    });
  } catch (err) {
    next(err);
  }
};

// Add or update a review for the current user
exports.addOrUpdateReview = async (req, res, next) => {
  try {
    const { rating, title, comment } = req.body || {};
    if (!rating || Number.isNaN(Number(rating)) || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a number between 1 and 5",
        data: null,
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found", data: null });

    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized", data: null });
    }

    // Try to enrich user name for convenience
    let userName;
    try {
      const user = await User.findById(userId).select("firstName lastName email");
      if (user) {
        userName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;
      }
    } catch (_) {
      // ignore enrichment failures
    }

    const idx = (product.reviewsList || []).findIndex(r => String(r.userId) === String(userId));
    if (idx >= 0) {
      // Update existing review
      product.reviewsList[idx].rating = rating;
      if (title !== undefined) product.reviewsList[idx].title = title;
      if (comment !== undefined) product.reviewsList[idx].comment = comment;
      if (userName) product.reviewsList[idx].userName = userName;
    } else {
      // Add new review
      product.reviewsList.push({
        userId,
        userName,
        rating,
        title,
        comment,
      });
    }

    // Recalculate aggregates
    const total = product.reviewsList.reduce((sum, r) => sum + (r.rating || 0), 0);
    const count = product.reviewsList.length;
    product.reviews = count; // keep numeric reviews count
    product.rating = count ? Number((total / count).toFixed(2)) : 0;

    await product.save();

    return res.json({
      success: true,
      message: "Review saved",
      data: mapProductId(product),
    });
  } catch (err) {
    next(err);
  }
};

// Delete the current user's review
exports.deleteMyReview = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found", data: null });

    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized", data: null });
    }

    const beforeCount = (product.reviewsList || []).length;
    product.reviewsList = (product.reviewsList || []).filter(r => String(r.userId) !== String(userId));

    // If nothing changed
    if (product.reviewsList.length === beforeCount) {
      return res.status(404).json({ success: false, message: "Review not found", data: null });
    }

    // Recalculate aggregates
    const total = product.reviewsList.reduce((sum, r) => sum + (r.rating || 0), 0);
    const count = product.reviewsList.length;
    product.reviews = count;
    product.rating = count ? Number((total / count).toFixed(2)) : 0;

    await product.save();

    return res.json({
      success: true,
      message: "Review deleted",
      data: mapProductId(product),
    });
  } catch (err) {
    next(err);
  }
};

// Update a specific review by id (admin or review owner)
exports.updateReview = async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;
    const { rating, title, comment } = req.body || {};

    const product = await Product.findById(id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found", data: null });

    const review = (product.reviewsList || []).id(reviewId);
    if (!review)
      return res
        .status(404)
        .json({ success: false, message: "Review not found", data: null });

    const userId = req.user && req.user.id;
    const isAdmin = !!(req.user && req.user.isAdmin);
    if (!isAdmin && String(review.userId) !== String(userId)) {
      return res
        .status(403)
        .json({ success: false, message: "Not allowed to update this review", data: null });
    }

    if (rating !== undefined) {
      if (Number.isNaN(Number(rating)) || rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, message: "Rating must be 1-5", data: null });
      }
      review.rating = rating;
    }
    if (title !== undefined) review.title = title;
    if (comment !== undefined) review.comment = comment;

    // Recalculate aggregates
    const total = product.reviewsList.reduce((sum, r) => sum + (r.rating || 0), 0);
    const count = product.reviewsList.length;
    product.reviews = count;
    product.rating = count ? Number((total / count).toFixed(2)) : 0;

    await product.save();

    return res.json({ success: true, message: "Review updated", data: mapProductId(product) });
  } catch (err) {
    next(err);
  }
};

// Delete a specific review by id (admin or review owner)
exports.deleteReview = async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;
    const product = await Product.findById(id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found", data: null });

    const review = (product.reviewsList || []).id(reviewId);
    if (!review)
      return res
        .status(404)
        .json({ success: false, message: "Review not found", data: null });

    const userId = req.user && req.user.id;
    const isAdmin = !!(req.user && req.user.isAdmin);
    if (!isAdmin && String(review.userId) !== String(userId)) {
      return res
        .status(403)
        .json({ success: false, message: "Not allowed to delete this review", data: null });
    }

    review.deleteOne();

    // Recalculate aggregates
    const total = product.reviewsList.reduce((sum, r) => sum + (r.rating || 0), 0);
    const count = product.reviewsList.length;
    product.reviews = count;
    product.rating = count ? Number((total / count).toFixed(2)) : 0;

    await product.save();

    return res.json({ success: true, message: "Review deleted", data: mapProductId(product) });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const {
      title,
      price,
      category,
      subCategory,
      images,
      inStock,
      rating,
      reviews,
      stockQuantity,
      soldCount,
      attributes,
    } = req.body;
    if (!title || !price || !category || !attributes || !images || !subCategory)
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        data: null,
      });
    if (!validateAttributes(category, attributes)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attributes for category",
        data: null,
      });
    }
    const product = new Product({
      title,
      price,
      category,
      subCategory,
      images,
      inStock,
      rating,
      reviews,
      stockQuantity,
      soldCount,
      attributes,
    });
    await product.save();
    res.status(201).json({
      success: true,
      message: "Product created",
      data: mapProductId(product),
    });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found", data: null });
    const {
      title,
      price,
      category,
      subCategory,
      images,
      inStock,
      rating,
      reviews,
      stockQuantity,
      soldCount,
      attributes,
    } = req.body;
    if (category && attributes && !validateAttributes(category, attributes)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attributes for category",
        data: null,
      });
    }
    if (title !== undefined) product.title = title;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (subCategory !== undefined) product.subCategory = subCategory;
    if (images !== undefined) product.images = images;
    if (inStock !== undefined) product.inStock = inStock;
    if (rating !== undefined) product.rating = rating;
    if (reviews !== undefined) product.reviews = reviews;
    if (stockQuantity !== undefined) product.stockQuantity = stockQuantity;
    if (soldCount !== undefined) product.soldCount = soldCount;
    if (attributes !== undefined) product.attributes = attributes;
    await product.save();
    res.json({
      success: true,
      message: "Product updated",
      data: mapProductId(product),
    });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found", data: null });
    await product.deleteOne();
    res.json({ success: true, message: "Product deleted", data: null });
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const products = await Product.find();
    const mappedProducts = products.map(mapProductId);
    res.json({
      success: true,
      message: "All products fetched",
      data: mappedProducts,
    });
  } catch (err) {
    next(err);
  }
};

// Fetch multiple category sections at once plus top picks
exports.sections = async (req, res, next) => {
  try {
    const { categories, limit = 10, topLimit = 12 } = req.query;

    const defaultCategories = Object.keys(categorySchemas);
    const categoryList = categories
      ? categories.split(",").filter((c) => !!c)
      : defaultCategories;

    const limitNum = parseInt(limit);
    const topLimitNum = parseInt(topLimit);

    const categoryQueries = categoryList.map((cat) =>
      Product.find({ category: cat })
        .limit(limitNum)
        .select(
          "title price category subCategory images inStock rating reviews stockQuantity soldCount attributes"
        )
    );

    const topPicksQuery = topLimitNum > 0
      ? Product.find({})
          .sort({ rating: -1, soldCount: -1 })
          .limit(topLimitNum)
          .select(
            "title price category subCategory images inStock rating reviews stockQuantity soldCount attributes"
          )
      : Promise.resolve([]);

    const [categoryResults, topPicksRaw] = await Promise.all([
      Promise.all(categoryQueries),
      topPicksQuery,
    ]);

    const byCategory = {};
    categoryList.forEach((cat, idx) => {
      byCategory[cat] = categoryResults[idx].map(mapProductId);
    });

    const topPicks = topPicksRaw.map(mapProductId);

    res.json({
      success: true,
      message: "Sections fetched",
      data: { byCategory, topPicks },
    });
  } catch (err) {
    next(err);
  }
};

// Fetch only top picks
exports.topPicks = async (req, res, next) => {
  try {
    const { limit = 12 } = req.query;
    const topLimitNum = parseInt(limit);
    const items = await Product.find({})
      .sort({ rating: -1, soldCount: -1 })
      .limit(topLimitNum)
      .select(
        "title price category subCategory images inStock rating reviews stockQuantity soldCount attributes"
      );
    const data = items.map(mapProductId);
    res.json({ success: true, message: "Top picks fetched", data });
  } catch (err) {
    next(err);
  }
};

// Lightweight suggestions for autocomplete
exports.suggest = async (req, res, next) => {
  try {
    const { q = "", limit = 8 } = req.query;
    const query = String(q).trim();
    if (!query) {
      return res.json({ success: true, message: "No query provided", data: { suggestions: [], products: [] } });
    }
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");
    const products = await Product.find({
      $or: [
        { title: { $regex: regex } },
        { category: { $regex: regex } },
        { subCategory: { $regex: regex } },
      ],
    })
      .limit(parseInt(limit))
      .select("title price category subCategory images rating reviews");

    const uniqueTitles = Array.from(new Set(products.map((p) => p.title)));
    const suggestions = uniqueTitles.slice(0, parseInt(limit));

    const mapped = products.map(mapProductId);
    res.json({
      success: true,
      message: "Suggestions fetched",
      data: { suggestions, products: mapped },
    });
  } catch (err) {
    next(err);
  }
};