const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Inventory = sequelize.define("Inventory", {
  invId:          { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  pid:            { type: DataTypes.INTEGER, allowNull: false },
  uid:            { type: DataTypes.INTEGER, allowNull: false }, // sellerId
  quantity:       { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0 },
  quantity_type:  { type: DataTypes.ENUM("kg","liter","unit","g"), allowNull: false },
  price_per_unit: { type: DataTypes.DECIMAL(10,2), allowNull: false }
}, {
  tableName: "inventories",
  timestamps: true,
  indexes: [{ unique: true, fields: ["pid","uid"] }]
});

module.exports = Inventory;
