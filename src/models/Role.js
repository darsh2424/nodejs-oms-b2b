const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Role = sequelize.define("Role", {
  roleId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  role:   { type: DataTypes.STRING(10), allowNull: false }
}, {
  tableName: "roles",
  timestamps: true
});

module.exports = Role;
