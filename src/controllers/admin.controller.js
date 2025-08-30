const { Category, Product,OrderItem, Inventory, User  } = require("../models");
const { Sequelize } = require("sequelize");

// Categories
exports.createCategory = async (req, res, next) => {
  try {
    const { category_name } = req.body;
    if (!category_name) return res.status(400).json({ error: "Category name required" });

    const category = await Category.create({ category_name });
    res.status(201).json(category);
  } catch (err) { next(err); }
};

exports.listCategories = async (req, res, next) => {
  try {
    const cats = await Category.findAll();
    res.json(cats);
  } catch (err) { next(err); }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category_name } = req.body;
    const cat = await Category.findByPk(id);
    if (!cat) return res.status(404).json({ error: "Not found" });

    cat.category_name = category_name;
    await cat.save();
    res.json(cat);
  } catch (err) { next(err); }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cat = await Category.findByPk(id);
    if (!cat) return res.status(404).json({ error: "Not found" });

    await cat.destroy();
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
};

// Products (admin only — suppliers will have separate APIs later)
exports.createProduct = async (req, res, next) => {
  try {
    const { name, categoryId } = req.body;
    if (!name || !categoryId) return res.status(400).json({ error: "Name & categoryId required" });

    const product = await Product.create({ name, categoryId });
    res.status(201).json(product);
  } catch (err) { next(err); }
};

exports.listProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({ include: { model: Category } });
    res.json(products);
  } catch (err) { next(err); }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, categoryId } = req.body;
    const prod = await Product.findByPk(id);
    if (!prod) return res.status(404).json({ error: "Not found" });

    if (name) prod.name = name;
    if (categoryId) prod.categoryId = categoryId;
    await prod.save();
    res.json(prod);
  } catch (err) { next(err); }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prod = await Product.findByPk(id);
    if (!prod) return res.status(404).json({ error: "Not found" });

    await prod.destroy();
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params; 
    const { status } = req.body;

    if (!["InProcess", "Delivered", "Cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const orderItem = await OrderItem.findByPk(id);
    if (!orderItem) {
      return res.status(404).json({ error: "Order item not found" });
    }

    // If status is "Cancelled", restore stock
    if (status === "Cancelled" && orderItem.orderStatus !== "Cancelled") {
      const inv = await Inventory.findOne({ where: { pid: orderItem.pid, uid: orderItem.userId } });
      if (inv) {
        inv.quantity = inv.quantity + orderItem.quantity; 
        await inv.save();
      }
    }

    orderItem.orderStatus = status;
    await orderItem.save();

    res.json({ message: "Order status updated", orderItem });
  } catch (err) {
    next(err);
  }
};

exports.getAnalytics = async (req, res, next) => {
  try {
    // 1. Order count by status
    const countByStatus = await OrderItem.findAll({
      attributes: ["orderStatus", [Sequelize.fn("COUNT", Sequelize.col("order_status")), "count"]],
      group: ["orderStatus"]
    });

    // 2. Revenue per supplier
    const revenueBySupplier = await OrderItem.findAll({
      attributes: [
        "userId",
        [Sequelize.fn("SUM", Sequelize.literal("quantity * price_per_unit_at_sell")), "revenue"]
      ],
      include: [{ model: User, attributes: ["id", "email"] }],
      group: ["userId", "User.id", "User.email"]
    });

    // 3. Category-wise product count
    const productsByCategory = await Product.findAll({
      attributes: [
        "categoryId",
        [Sequelize.fn("COUNT", Sequelize.col("pid")), "productCount"]
      ],
      include: [{ model: Category, attributes: ["cat_id", "category_name"] }],
      group: ["categoryId", "Category.cat_id", "Category.category_name"]
    });

    // 4. Supplier inventory product count (how many products a supplier has listed)
    const supplierInventoryCount = await Inventory.findAll({
      attributes: [
        "uid",
        [Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("pid"))), "productCount"]
      ],
      include: [{ model: User, attributes: ["id", "email"] }],
      group: ["uid", "User.id", "User.email"]
    });

    // 5. Top products by total inventory quantity (popularity on sell side)
    const topProducts = await Inventory.findAll({
      attributes: [
        "pid",
        [Sequelize.fn("SUM", Sequelize.col("quantity")), "quantity"]
      ],
      include: [{ model: Product, attributes: ["pid", "name"] }],
      group: ["Inventory.pid", "Product.pid", "Product.name"],
      order: [[Sequelize.literal("quantity"), "DESC"]],
      limit: 10
    });

    res.json({
      countByStatus,
      revenueBySupplier,
      productsByCategory,
      supplierInventoryCount,
      topProducts
    });
  } catch (err) {
    next(err);
  }
};