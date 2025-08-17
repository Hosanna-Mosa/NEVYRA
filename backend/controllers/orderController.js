const { Order, OrderItem, CartItem, Product } = require("../models");

exports.create = async (req, res, next) => {
  try {
    const cartItems = await CartItem.find({ userId: req.user.id }).populate(
      "productId"
    );
    if (!cartItems.length)
      return res
        .status(400)
        .json({ success: false, message: "Cart is empty", data: null });
    let totalAmount = 0;
    cartItems.forEach((item) => {
      totalAmount += item.quantity * (item.productId.price || 0);
    });
    const order = new Order({
      userId: req.user.id,
      totalAmount,
      status: "Pending",
    });
    await order.save();
    const orderItems = await Promise.all(
      cartItems.map((item) => {
        const orderItem = new OrderItem({
          orderId: order._id,
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.price,
        });
        return orderItem.save();
      })
    );
    await CartItem.deleteMany({ userId: req.user.id });
    res.status(201).json({
      success: true,
      message: "Order created",
      data: { order, orderItems },
    });
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).lean();
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItem.find({ orderId: order._id });
        return { ...order, items };
      })
    );
    res.json({
      success: true,
      message: "Orders fetched",
      data: ordersWithItems,
    });
  } catch (err) {
    next(err);
  }
};

exports.details = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found", data: null });
    const items = await OrderItem.find({ orderId: order._id });
    res.json({
      success: true,
      message: "Order details",
      data: { ...order.toObject(), items },
    });
  } catch (err) {
    next(err);
  }
};
