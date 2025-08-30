const router = require("express").Router();
const ctrl = require("../controllers/admin.controller");
const { authenticate, isAdmin } = require("../middleware/auth");

router.use(authenticate, isAdmin);

// categories
router.post("/categories", ctrl.createCategory);
router.get("/categories", ctrl.listCategories);
router.patch("/categories/:id", ctrl.updateCategory);
router.delete("/categories/:id", ctrl.deleteCategory);

// products
router.post("/products", ctrl.createProduct);
router.get("/products", ctrl.listProducts);
router.patch("/products/:id", ctrl.updateProduct);
router.delete("/products/:id", ctrl.deleteProduct);

// Change order status
router.patch("/orders/:id/status", ctrl.updateOrderStatus);

// Get analytics
router.get("/analytics", ctrl.getAnalytics);

module.exports = router;
