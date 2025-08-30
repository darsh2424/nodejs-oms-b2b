const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const CartItem = sequelize.define("CartItem", {
  itemId:        { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  cartId:        { type: DataTypes.INTEGER, allowNull: false },
  pid:           { type: DataTypes.INTEGER, allowNull: false },
  userId:        { type: DataTypes.INTEGER, allowNull: false }, // sellerId
  quantity:      { type: DataTypes.DECIMAL(10,2), allowNull: false },
  quantity_type: { type: DataTypes.ENUM("kg","liter","unit"), allowNull: false }
}, {
  tableName: "cart_items",
  timestamps: true
});

module.exports = CartItem;
