const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Order = sequelize.define("Order", {
  orderId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId:  { type: DataTypes.INTEGER, allowNull: false } // buyerId
}, {
  tableName: "orders",
  timestamps: true
});

module.exports = Order;
