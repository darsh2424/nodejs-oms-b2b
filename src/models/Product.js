const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Product = sequelize.define("Product", {
  pid:   { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name:  { type: DataTypes.STRING(255), allowNull: false },
  categoryId: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: "products",
  timestamps: true
});

module.exports = Product;
