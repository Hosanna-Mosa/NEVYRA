const { CartItem, Product } = require("../models");

exports.list = async (req, res, next) => {
  try {
    const items = await CartItem.find({ userId: req.user.id }).populate(
      "productId"
    );
    res.json({ success: true, message: "Cart items fetched", data: items });
  } catch (err) {
    next(err);
  }
};

exports.add = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity)
      return res
        .status(400)
        .json({
          success: false,
          message: "Product and quantity required",
          data: null,
        });
    let item = await CartItem.findOne({ userId: req.user.id, productId });
    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      item = new CartItem({ userId: req.user.id, productId, quantity });
      await item.save();
    }
    res
      .status(201)
      .json({ success: true, message: "Item added to cart", data: item });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const item = await CartItem.findOne({
      _id: req.params.itemId,
      userId: req.user.id,
    });
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Cart item not found", data: null });
    item.quantity = quantity;
    await item.save();
    res.json({ success: true, message: "Cart item updated", data: item });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await CartItem.findOne({
      _id: req.params.itemId,
      userId: req.user.id,
    });
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Cart item not found", data: null });
    await item.deleteOne();
    res.json({ success: true, message: "Cart item removed", data: null });
  } catch (err) {
    next(err);
  }
};
