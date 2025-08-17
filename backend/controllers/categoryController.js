const { Category } = require("../models");

exports.list = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json({
      success: true,
      message: "Categories fetched",
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, parentId } = req.body;
    if (!name)
      return res
        .status(400)
        .json({ success: false, message: "Name required", data: null });
    const category = new Category({ name, parentId });
    await category.save();
    res
      .status(201)
      .json({ success: true, message: "Category created", data: category });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found", data: null });
    if (req.body.name !== undefined) category.name = req.body.name;
    if (req.body.parentId !== undefined) category.parentId = req.body.parentId;
    await category.save();
    res.json({ success: true, message: "Category updated", data: category });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found", data: null });
    await category.deleteOne();
    res.json({ success: true, message: "Category deleted", data: null });
  } catch (err) {
    next(err);
  }
};
