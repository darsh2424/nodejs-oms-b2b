const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

exports.hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

exports.comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
