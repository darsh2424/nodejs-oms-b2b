const router = require("express").Router();
const ctrl = require("../controllers/buyer.controller");
const { authenticate, isBuyer, hasProfile } = require("../middleware/auth");

router.use(authenticate, isBuyer, hasProfile);

router.get("/products", ctrl.listProducts);

// cart
router.post("/cart", ctrl.addToCart);
router.get("/cart", ctrl.viewCart);
router.patch("/cart/:itemId", ctrl.updateCartItem);
router.delete("/cart/:itemId", ctrl.deleteCartItem);

// orders
router.post("/orders", ctrl.placeOrder);
router.get("/orders", ctrl.myOrders);

module.exports = router;
