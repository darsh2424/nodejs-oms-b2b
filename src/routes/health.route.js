const router = require("express").Router();

router.get("/", (_req, res) => {
  res.json({ ok: true, status: "healthy" });
});

module.exports = router;
