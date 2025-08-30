const router = require("express").Router();
const ctrl = require("../controllers/otp.controller");

router.post("/generate", ctrl.generateOtp);
router.post("/verify", ctrl.verifyOtp);

module.exports = router;
