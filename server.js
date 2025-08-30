require("dotenv").config();
const app = require("./src/app");
const { sequelize } = require("./src/models");

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected");

    // Creates/updates tables to match models (good for dev)
    await sequelize.sync({ alter: true });
    console.log("✅ Sequelize synced");

    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ Startup error:", err);
    process.exit(1);
  }
})();
