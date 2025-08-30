const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Category = sequelize.define("Category", {
  catId:         { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  category_name: { type: DataTypes.STRING(100), allowNull: false }
}, {
  tableName: "categories",
  timestamps: true
});

module.exports = Category;
