const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const OrderItem = sequelize.define("OrderItem", {
  itemId:                { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  orderId:               { type: DataTypes.INTEGER, allowNull: false },
  pid:                   { type: DataTypes.INTEGER, allowNull: false },
  userId:                { type: DataTypes.INTEGER, allowNull: false }, // sellerId
  quantity:              { type: DataTypes.DECIMAL(10,2), allowNull: false },
  quantity_type:         { type: DataTypes.ENUM("kg","liter","unit"), allowNull: false },
  price_per_unit_at_sell:{ type: DataTypes.DECIMAL(10,2), allowNull: false },
  orderStatus:           { type: DataTypes.ENUM("InProcess","Delivered","Cancelled"), allowNull: false, defaultValue: "InProcess" }
}, {
  tableName: "order_items",
  timestamps: true
});

module.exports = OrderItem;
