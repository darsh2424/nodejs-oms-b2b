const express = require("express");
const cors = require("cors");

const healthRoute = require("./routes/health.route");
const authRoute = require("./routes/auth.route");
const adminRoute = require("./routes/admin.route");
const otpRoute = require("./routes/otp.route");
const supplierRoute = require("./routes/supplier.route");
const profileRoute = require("./routes/profile.route");
const buyerRoute = require("./routes/buyer.route");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/health", healthRoute);
app.use("/v1/auth", authRoute);
app.use("/v1/admin", adminRoute);
app.use("/v1/otp", otpRoute);
app.use("/v1/supplier", supplierRoute);
app.use("/v1/profile", profileRoute);
app.use("/v1/buyer", buyerRoute);

// central error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

module.exports = app;
