const { Product, Category, Inventory, User } = require("../models");

exports.list = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category, attributes: ["catId","category_name"] }]
    });
    res.json(products);
  } catch (err) { next(err); }
};

// Simple create (supplier adds product + optional initial inventory)
exports.create = async (req, res, next) => {
  try {
    const { name, categoryId, initialQuantity, quantity_type, price_per_unit, sellerId } = req.body;

    const product = await Product.create({ name, categoryId });

    if (sellerId && initialQuantity && quantity_type && price_per_unit) {
      await Inventory.create({
        pid: product.pid,
        uid: sellerId,
        quantity: initialQuantity,
        quantity_type,
        price_per_unit
      });
    }
    res.status(201).json(product);
  } catch (err) { next(err); }
};
