const sequelize   = require("../config/db");

const Role        = require("./Role");
const UserProfile = require("./UserProfile");
const User        = require("./User");
const LoginOtp    = require("./LoginOtp");
const Category    = require("./Category");
const Product     = require("./Product");
const Inventory   = require("./Inventory");
const Cart        = require("./Cart");
const CartItem    = require("./CartItem");
const Order       = require("./Order");
const OrderItem   = require("./OrderItem");

// Users ↔ Roles & Profiles
User.belongsTo(Role,        { foreignKey: "userRole" });
Role.hasMany(User,          { foreignKey: "userRole" });

User.belongsTo(UserProfile, { foreignKey: "profileId" });
UserProfile.hasOne(User,    { foreignKey: "profileId" });

// OTP
LoginOtp.belongsTo(User,    { foreignKey: "userId" });
User.hasMany(LoginOtp,      { foreignKey: "userId" });

// Products ↔ Categories
Product.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasMany(Product,   { foreignKey: "categoryId" });

// Inventory (per seller per product)
Inventory.belongsTo(Product,{ foreignKey: "pid" });
Product.hasMany(Inventory,  { foreignKey: "pid" });

Inventory.belongsTo(User,   { foreignKey: "uid" });
User.hasMany(Inventory,     { foreignKey: "uid" });

// Cart & CartItems
Cart.belongsTo(User,        { foreignKey: "userId" });
User.hasMany(Cart,          { foreignKey: "userId" });

CartItem.belongsTo(Cart,    { foreignKey: "cartId" });
Cart.hasMany(CartItem,      { foreignKey: "cartId" });

CartItem.belongsTo(Product, { foreignKey: "pid" });
Product.hasMany(CartItem,   { foreignKey: "pid" });

CartItem.belongsTo(User,    { foreignKey: "userId" }); // sellerId
User.hasMany(CartItem,      { foreignKey: "userId" });

// Orders & OrderItems
Order.belongsTo(User,       { foreignKey: "userId" });
User.hasMany(Order,         { foreignKey: "userId" });

OrderItem.belongsTo(Order,  { foreignKey: "orderId" });
Order.hasMany(OrderItem,    { foreignKey: "orderId" });

OrderItem.belongsTo(Product,{ foreignKey: "pid" });
Product.hasMany(OrderItem,  { foreignKey: "pid" });

OrderItem.belongsTo(User,   { foreignKey: "userId" }); // sellerId
User.hasMany(OrderItem,     { foreignKey: "userId" });

module.exports = {
  sequelize,
  Role, UserProfile, User, LoginOtp,
  Category, Product,
  Inventory, Cart, CartItem,
  Order, OrderItem
};
