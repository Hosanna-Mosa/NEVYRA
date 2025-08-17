const { Order, OrderItem, CartItem, Product, User } = require("../models");

// Function to generate unique order number
const generateOrderNumber = async () => {
  try {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Get count of orders for today
    const todayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    
    const orderCount = await Order.countDocuments({
      createdAt: { $gte: todayStart, $lt: todayEnd }
    });
    
    const sequence = (orderCount + 1).toString().padStart(4, '0');
    return `NEV${year}${month}${day}${sequence}`;
  } catch (error) {
    // Fallback order number if counting fails
    const timestamp = Date.now().toString().slice(-8);
    return `NEV${timestamp}`;
  }
};

// Create new order from cart
exports.createOrder = async (req, res, next) => {
  try {
    const {
      paymentMethod,
      shippingAddress,
      billingAddress,
      notes
    } = req.body;
  
    // Validate required fields
    if (!paymentMethod || !shippingAddress || !billingAddress) {
      return res.status(400).json({
        success: false,
        message: "Payment method, shipping address, and billing address are required",
        data: null,
      });
    }

    // Validate address fields
    const requiredAddressFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'zipCode', 'state'];
    for (const field of requiredAddressFields) {
      if (!shippingAddress[field] || !billingAddress[field]) {
        return res.status(400).json({
          success: false,
          message: `Missing required field in address: ${field}`,
          data: null,
        });
      }
    }

    // Ensure addresses have country field
    if (!shippingAddress.country) shippingAddress.country = "India";
    if (!billingAddress.country) billingAddress.country = "India";

    // Get user's cart items
    const cartItems = await CartItem.find({ userId: req.user.id })
      .populate("productId", "title images price attributes stockQuantity");

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty. Cannot create order.",
        data: null,
      });
    }

    // Validate stock availability
    for (const cartItem of cartItems) {
      if (cartItem.quantity > cartItem.productId.stockQuantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${cartItem.productId.title}. Available: ${cartItem.productId.stockQuantity}`,
          data: null,
        });
      }
    }

    // Calculate totals
    let subtotal = 0;
    let totalTax = 0;
    let totalDiscount = 0;
    const taxRate = 0.18; // 18% GST

    cartItems.forEach(item => {
      const itemSubtotal = item.price * item.quantity;
      subtotal += itemSubtotal;
      
      // Calculate tax for each item
      const itemTax = itemSubtotal * taxRate;
      totalTax += itemTax;
      
      // Calculate discount if there's original price
      if (item.originalPrice) {
        const itemDiscount = (item.originalPrice - item.price) * item.quantity;
        totalDiscount += itemDiscount;
      }
    });

    // Calculate shipping fee after subtotal is known
    const shippingFee = subtotal > 499 ? 0 : 99; // Free shipping above ₹499
    const totalAmount = subtotal + totalTax + shippingFee - totalDiscount;

    // Generate order number before creating order
    const orderNumber = await generateOrderNumber();

    // Create order with all fields including items array and orderNumber
    const order = new Order({
      userId: req.user.id,
      orderNumber, // Include the generated order number
      paymentMethod: paymentMethod.toUpperCase(),
      shippingAddress,
      billingAddress,
      subtotal,
      taxAmount: totalTax,
      discountAmount: totalDiscount,
      shippingFee,
      totalAmount,
      notes,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      items: [], // Initialize empty items array
    });

    // Validate that orderNumber is set
    if (!order.orderNumber) {
      throw new Error('Order number was not generated properly');
    }

    // Save order with the generated orderNumber
    await order.save();

    // Create order items and update product stock
    const orderItems = [];
    for (const cartItem of cartItems) {
      const orderItemData = {
        orderId: order._id,
        productId: cartItem.productId._id,
        quantity: cartItem.quantity,
        price: cartItem.price,
        originalPrice: cartItem.originalPrice,
        size: cartItem.size,
        color: cartItem.color,
        selectedAttributes: cartItem.selectedAttributes,
        subtotal: cartItem.price * cartItem.quantity, // Add missing subtotal field
        taxAmount: (cartItem.price * cartItem.quantity) * taxRate,
        discountAmount: cartItem.originalPrice ? (cartItem.originalPrice - cartItem.price) * cartItem.quantity : 0,
        totalAmount: (cartItem.price * cartItem.quantity) + ((cartItem.price * cartItem.quantity) * taxRate) - (cartItem.originalPrice ? (cartItem.originalPrice - cartItem.price) * cartItem.quantity : 0), // Add missing totalAmount field
      };

      const orderItem = new OrderItem(orderItemData);
      await orderItem.save();
      orderItems.push(orderItem._id);

      // Update product stock
      await Product.findByIdAndUpdate(cartItem.productId._id, {
        $inc: { stockQuantity: -cartItem.quantity, soldCount: cartItem.quantity }
      });
    }

    // Update order with order items (no need to save again)
    order.items = orderItems;

    // Clear user's cart
    await CartItem.deleteMany({ userId: req.user.id });

    // Save the order again to update the items array
    await order.save();

    // Populate order details for response
    await order.populate([
      {
        path: 'items',
        populate: {
          path: 'productId',
          select: 'title images price attributes'
        }
      }
    ]);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

// Get user's orders
exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate([
        {
          path: 'items',
          populate: {
            path: 'productId',
            select: 'title images price attributes'
          }
        }
      ])
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

// Get specific order by ID
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      userId: req.user.id,
    }).populate([
      {
        path: 'items',
        populate: {
          path: 'productId',
          select: 'title images price attributes'
        }
      }
    ]);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
      });
    }

    res.json({
      success: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

// Cancel order
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      userId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
      });
    }

    // Check if order can be cancelled
    if (!["Pending", "Confirmed"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
        data: null,
      });
    }

    // Update order status
    order.status = "Cancelled";
    await order.save();

    // Restore product stock
    const orderItems = await OrderItem.find({ orderId: order._id });
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stockQuantity: item.quantity, soldCount: -item.quantity }
      });
    }

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

// Get order by order number
exports.getOrderByNumber = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      orderNumber: req.params.orderNumber,
      userId: req.user.id,
    }).populate([
      {
        path: 'items',
        populate: {
          path: 'productId',
          select: 'title images price attributes'
        }
      }
    ]);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
      });
    }

    res.json({
      success: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Get all orders
exports.getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, paymentStatus } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const orders = await Order.find(filter)
      .populate([
        {
          path: 'items',
          populate: {
            path: 'productId',
            select: 'title images price attributes'
          }
        },
        {
          path: 'userId',
          select: 'firstName lastName email'
        }
      ])
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Update order status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber, notes } = req.body;
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
      });
    }

    // Update fields
    if (status) order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (notes) order.notes = notes;

    // Set actual delivery date if status is "Delivered"
    if (status === "Delivered") {
      order.actualDelivery = new Date();
    }

    await order.save();

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (err) {
    next(err);
  }
};
