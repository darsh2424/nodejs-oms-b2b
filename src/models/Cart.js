const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Cart = sequelize.define("Cart", {
  cartId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false } // buyerId
}, {
  tableName: "carts",
  timestamps: true
});

module.exports = Cart;
