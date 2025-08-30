const { verifyToken } = require("../utils/jwt");
const { User, Role, UserProfile  } = require("../models");

exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing token" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Invalid token format" });

    const decoded = verifyToken(token);

    // attach user info to request
    const user = await User.findByPk(decoded.id, { include: Role });
    if (!user) return res.status(401).json({ error: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized", message: err.message });
  }
};

exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.Role.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admin only" });
  }
  next();
};

exports.isSupplier = (req, res, next) => {
  if (!req.user || req.user.Role.role !== "supplier") {
    return res.status(403).json({ error: "Forbidden: Supplier only" });
  }
  next();
};

exports.isBuyer = (req, res, next) => {
  if (!req.user || req.user.Role.role !== "buyer") {
    return res.status(403).json({ error: "Forbidden: Buyer only" });
  }
  next();
};

exports.hasProfile = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const profile = await UserProfile.findByPk(req.user.profileId);
    if (!profile || !profile.company_gstn) {
      return res.status(403).json({ 
        error: "Business profile incomplete. GST number required to trade." 
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({ error: "Profile check failed", message: err.message });
  }
};