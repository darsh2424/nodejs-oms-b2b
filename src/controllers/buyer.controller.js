const { Product, Category, Inventory, User, Order, OrderItem, Cart, CartItem } = require("../models");
const { convert } = require("../utils/unitConversion");

exports.listProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category, attributes: ["catId", "category_name"] },
        { 
          model: Inventory,
          include: [{ model: User, attributes: ["id", "email"] }]
        }
      ]
    });

    res.json(products);
  } catch (err) {
    next(err);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const buyerId = req.user.id;
    const { pid, supplierId, quantity, quantity_type } = req.body;

    if (!pid || !supplierId || !quantity || !quantity_type) {
      return res.status(400).json({ error: "All fields required" });
    }

    // Check inventory for this product + supplier
    const inv = await Inventory.findOne({ where: { pid, uid: supplierId } });
    if (!inv) {
      return res.status(404).json({ error: "Inventory not found for this product & supplier" });
    }

    // Convert buyer unit → supplier's inventory unit
    let convertedQty;
    try {
      convertedQty = convert(quantity, quantity_type, inv.quantity_type);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    if (convertedQty > inv.quantity) {
      return res.status(400).json({ error: "Not enough stock available" });
    }

    // Ensure buyer has a cart
    let cart = await Cart.findOne({ where: { userId: buyerId } });
    if (!cart) {
      cart = await Cart.create({ userId: buyerId });
    }

    // Add item to cart
    const cartItem = await CartItem.create({
      cartId: cart.cartId,
      pid,
      userId: supplierId,
      quantity,
      quantity_type
    });

    res.status(201).json({ message: "Added to cart", cartItem });
  } catch (err) {
    next(err);
  }
};


exports.viewCart = async (req, res, next) => {
  try {
    const buyerId = req.user.id;

    const cart = await Cart.findOne({
      where: { userId: buyerId },
      include: [
        {
          model: CartItem,
          include: [
            { model: Product },
            { model: User, attributes: ["id", "email"] } 
          ]
        }
      ]
    });

    if (!cart) return res.json({ items: [] });

    res.json(cart);
  } catch (err) {
    next(err);
  }
};

exports.placeOrder = async (req, res, next) => {
  const buyerId = req.user.id;

  try {
    const cart = await Cart.findOne({
      where: { userId: buyerId },
      include: [CartItem]
    });

    if (!cart || cart.CartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // create order
    const order = await Order.create({ userId: buyerId });
    const orderItems = [];

    for (let item of cart.CartItems) {
      const { pid, userId: supplierId, quantity, quantity_type } = item;

      const inv = await Inventory.findOne({ where: { pid, uid: supplierId } });
      if (!inv) throw new Error(`Inventory not found for product ${pid}, supplier ${supplierId}`);

      // convert buyer unit → supplier unit
      const convertedQty = convert(quantity, quantity_type, inv.quantity_type);

      if (convertedQty > inv.quantity) {
        throw new Error(`Not enough stock for product ${pid}`);
      }

      // deduct stock
      inv.quantity = inv.quantity - convertedQty;
      await inv.save();

      // add order item
      const orderItem = await OrderItem.create({
        orderId: order.orderId,
        pid,
        userId: supplierId,
        quantity,
        quantity_type,
        price_per_unit_at_sell: inv.price_per_unit,
        orderStatus: "InProcess"
      });

      orderItems.push(orderItem);
    }

    // Empty cart
    await CartItem.destroy({ where: { cartId: cart.cartId } });

    res.status(201).json({ message: "Order placed", order, items: orderItems });
  } catch (err) {
    next(err);
  }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const buyerId = req.user.id;
    const { itemId } = req.params;
    const { quantity, quantity_type } = req.body;

    const cartItem = await CartItem.findByPk(itemId);
    if (!cartItem) return res.status(404).json({ error: "Cart item not found" });

    // Ensure the item belongs to the buyer's cart
    if (cartItem.cartId) {
      const cart = await cartItem.getCart();
      if (cart.userId !== buyerId) {
        return res.status(403).json({ error: "Not your cart item" });
      }
    }

    if (quantity) cartItem.quantity = quantity;
    if (quantity_type) cartItem.quantity_type = quantity_type;
    await cartItem.save();

    res.json({ message: "Cart item updated", cartItem });
  } catch (err) {
    next(err);
  }
};


exports.deleteCartItem = async (req, res, next) => {
  try {
    const buyerId = req.user.id;
    const { itemId } = req.params;

    const cartItem = await CartItem.findByPk(itemId);
    if (!cartItem) return res.status(404).json({ error: "Cart item not found" });

    // Ensure item belongs to buyer's cart
    if (cartItem.cartId) {
      const cart = await cartItem.getCart();
      if (cart.userId !== buyerId) {
        return res.status(403).json({ error: "Not your cart item" });
      }
    }

    await cartItem.destroy();
    res.json({ message: "Cart item removed" });
  } catch (err) {
    next(err);
  }
};


exports.myOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: OrderItem,
          include: [
            { model: Product },
            { model: User, attributes: ["id", "email"] } // supplier info
          ]
        }
      ],
      order: [["created_at", "DESC"]]
    });

    res.json(orders);
  } catch (err) {
    next(err);
  }
};