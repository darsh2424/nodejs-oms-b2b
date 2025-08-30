const { Inventory, Product, OrderItem, Order, User, Category } = require("../models");
const { convert } = require("../utils/unitConversion");

// Add product to supplier inventory
exports.addInventory = async (req, res, next) => {
  try {
    const supplierId = req.user.id; // logged in supplier
    const { pid, quantity, quantity_type, price_per_unit } = req.body;

    if (!pid || !quantity || !quantity_type || !price_per_unit) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const inv = await Inventory.create({
      pid, uid: supplierId, quantity, quantity_type, price_per_unit
    });

    res.status(201).json(inv);
  } catch (err) { next(err); }
};

// Update stock (with unit conversion)
exports.updateStock = async (req, res, next) => {
  try {
    const supplierId = req.user.id;
    const { id } = req.params; // productId
    const { quantity, quantity_type } = req.body;

    const inv = await Inventory.findOne({ where: { pid: id, uid: supplierId } });
    if (!inv) return res.status(404).json({ error: "Inventory not found" });

    // convert incoming qty to supplier's stored unit
    const newQty = convert(quantity, quantity_type, inv.quantity_type);

    inv.quantity = newQty; 
    await inv.save();

    res.json(inv);
  } catch (err) { next(err); }
};

// View incoming orders (for supplier)
exports.incomingOrders = async (req, res, next) => {
  try {
    const supplierId = req.user.id;

    const items = await OrderItem.findAll({
      where: { userId: supplierId },
      include: [
        { model: Product, include: [Category] },
        { model: Order, include: [User] } 
      ]
    });

    res.json(items);
  } catch (err) { next(err); }
};
