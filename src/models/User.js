const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  id:           { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  profileId:    { type: DataTypes.INTEGER, allowNull: true },
  email:        { type: DataTypes.STRING(255), unique: true, allowNull: false },
  passwordHash: { type: DataTypes.STRING(100), allowNull: false },
  userRole:     { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: "users",
  timestamps: true
});

module.exports = User;
