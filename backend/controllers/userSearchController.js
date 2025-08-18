const { User, Order } = require("../models");

// Return user's recent searches (most recent first)
exports.getRecentSearches = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("recentSearches");
    if (!user) return res.status(404).json({ success: false, message: "User not found", data: [] });
    const searches = Array.isArray(user.recentSearches) ? user.recentSearches.slice(0, 7) : [];
    res.json({ success: true, message: "Recent searches", data: searches });
  } catch (err) {
    next(err);
  }
};

// Add a search term to user's recent searches
exports.addRecentSearch = async (req, res, next) => {
  try {
    const { term } = req.body;
    const q = (term || "").trim();
    if (!q) return res.status(400).json({ success: false, message: "term is required", data: [] });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found", data: [] });
    user.recentSearches = Array.isArray(user.recentSearches) ? user.recentSearches : [];
    // Remove duplicates, add to front, cap to 20
    user.recentSearches = [q, ...user.recentSearches.filter((s) => s.toLowerCase() !== q.toLowerCase())].slice(0, 7);
    await user.save();
    res.json({ success: true, message: "Saved", data: user.recentSearches.slice(0, 7) });
  } catch (err) {
    next(err);
  }
};

// Simple popular searches: derive from last 200 orders' product titles as a proxy, or fallback to most searched from users
exports.getPopularSearches = async (_req, res, next) => {
  try {
    // Fallback list if nothing can be derived
    const fallback = [
      "laptop",
      "smartphone",
      "shoes",
      "dress",
      "watch",
      "headphones",
      "camera",
      "tablet",
    ];

    // Try to infer from user recentSearches
    const users = await User.find({}).select("recentSearches").limit(200);
    const freq = new Map();
    for (const u of users) {
      for (const s of u.recentSearches || []) {
        const key = String(s).toLowerCase();
        freq.set(key, (freq.get(key) || 0) + 1);
      }
    }
    const list = Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([s]) => s)
      .slice(0, 10);
    const data = list.length ? list : fallback;
    res.json({ success: true, message: "Popular searches", data });
  } catch (err) {
    next(err);
  }
};


