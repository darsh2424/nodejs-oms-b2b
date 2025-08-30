const router = require("express").Router();
const ctrl = require("../controllers/supplier.controller");
const { authenticate, isSupplier, hasProfile } = require("../middleware/auth");

router.use(authenticate, isSupplier, hasProfile);

// add product to inventory
router.post("/inventory", ctrl.addInventory);

// update stock
router.patch("/products/:id/stock", ctrl.updateStock);

// view incoming orders
router.get("/orders", ctrl.incomingOrders);

module.exports = router;
