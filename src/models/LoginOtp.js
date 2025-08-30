const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const LoginOtp = sequelize.define("LoginOtp", {
  otpId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId:{ type: DataTypes.INTEGER, allowNull: false },
  otp:   { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: "login_otps",
  timestamps: true
});

module.exports = LoginOtp;
