const router = require("express").Router();
const ctrl = require("../controllers/profile.controller");
const { authenticate } = require("../middleware/auth");

router.post("/", authenticate, ctrl.upsertProfile);

module.exports = router;
