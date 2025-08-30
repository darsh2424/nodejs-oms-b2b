const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const UserProfile = sequelize.define("UserProfile", {
  id:              { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  company_name:    { type: DataTypes.STRING(50) },
  company_city:    { type: DataTypes.STRING(35) },
  company_state:   { type: DataTypes.STRING(40) },
  contactno:       { type: DataTypes.STRING(10) },
  company_gstn:    { type: DataTypes.STRING(15) }
}, {
  tableName: "user_profiles",
  timestamps: true
});

module.exports = UserProfile;
