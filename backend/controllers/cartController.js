const { CartItem, Product } = require("../models");

exports.list = async (req, res, next) => {
  try {
    const items = await CartItem.find({ userId: req.user.id })
      .populate("productId", "title images price attributes")
      .sort({ createdAt: -1 });
    
    res.json({ success: true, message: "Cart items fetched", data: items });
  } catch (err) {
    next(err);
  }
};

exports.add = async (req, res, next) => {
  try {
    const { productId, quantity, size, color, selectedAttributes } = req.body;
    
    // Validation
    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Product ID and quantity are required",
        data: null,
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
        data: null,
      });
    }

    // Check if product exists and get its current price
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        data: null,
      });
    }

    if (!product.inStock) {
      return res.status(400).json({
        success: false,
        message: "Product is out of stock",
        data: null,
      });
    }

    // Check stock availability
    if (product.stockQuantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stockQuantity} items available in stock`,
        data: null,
      });
    }

    // Check if item already exists in cart
    let existingItem = await CartItem.findOne({ 
      userId: req.user.id, 
      productId,
      size: size || null,
      color: color || null
    });

    if (existingItem) {
      // Update quantity if item exists
      const newQuantity = existingItem.quantity + quantity;
      
      // Check if new quantity exceeds stock
      if (newQuantity > product.stockQuantity) {
        return res.status(400).json({
          success: false,
          message: `Cannot add ${quantity} more items. Only ${product.stockQuantity - existingItem.quantity} additional items available.`,
          data: null,
        });
      }

      existingItem.quantity = newQuantity;
      await existingItem.save();
      
      res.json({ 
        success: true, 
        message: "Cart item quantity updated", 
        data: existingItem 
      });
    } else {
      // Create new cart item
      const cartItem = new CartItem({
        userId: req.user.id,
        productId,
        quantity,
        size: size || null,
        color: color || null,
        price: product.attributes?.salePrice || product.price,
        originalPrice: product.attributes?.salePrice ? product.price : null,
        selectedAttributes: selectedAttributes || {},
      });

      await cartItem.save();
      
      // Populate product details for response
      await cartItem.populate("productId", "title images price attributes");
      
      res.status(201).json({ 
        success: true, 
        message: "Item added to cart", 
        data: cartItem 
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { quantity, size, color, selectedAttributes } = req.body;
    const { itemId } = req.params;

    if (quantity !== undefined && quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
        data: null,
      });
    }

    const item = await CartItem.findOne({
      _id: itemId,
      userId: req.user.id,
    });

    if (!item) {
      return res.status(404).json({ 
        success: false, 
        message: "Cart item not found", 
        data: null 
      });
    }

    // Check stock availability if updating quantity
    if (quantity !== undefined) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
          data: null,
        });
      }

      if (quantity > product.stockQuantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stockQuantity} items available in stock`,
          data: null,
        });
      }
    }

    // Update fields
    if (quantity !== undefined) item.quantity = quantity;
    if (size !== undefined) item.size = size;
    if (color !== undefined) item.color = color;
    if (selectedAttributes !== undefined) item.selectedAttributes = selectedAttributes;

    await item.save();
    
    // Populate product details for response
    await item.populate("productId", "title images price attributes");
    
    res.json({ 
      success: true, 
      message: "Cart item updated", 
      data: item 
    });
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

    if (!item) {
      return res.status(404).json({ 
        success: false, 
        message: "Cart item not found", 
        data: null 
      });
    }

    await item.deleteOne();
    res.json({ 
      success: true, 
      message: "Cart item removed", 
      data: null 
    });
  } catch (err) {
    next(err);
  }
};

exports.clear = async (req, res, next) => {
  try {
    await CartItem.deleteMany({ userId: req.user.id });
    res.json({ 
      success: true, 
      message: "Cart cleared", 
      data: null 
    });
  } catch (err) {
    next(err);
  }
};

exports.getCartSummary = async (req, res, next) => {
  try {
    const items = await CartItem.find({ userId: req.user.id })
      .populate("productId", "title images price attributes stockQuantity");

    let subtotal = 0;
    let totalItems = 0;
    let totalSavings = 0;

    items.forEach(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      totalItems += item.quantity;
      
      if (item.originalPrice) {
        totalSavings += (item.originalPrice - item.price) * item.quantity;
      }
    });

    const shippingFee = subtotal > 499 ? 0 : 99;
    const finalTotal = subtotal + shippingFee;

    res.json({
      success: true,
      message: "Cart summary fetched",
      data: {
        items,
        summary: {
          subtotal,
          totalItems,
          totalSavings,
          shippingFee,
          finalTotal
        }
      }
    });
  } catch (err) {
    next(err);
  }
};
