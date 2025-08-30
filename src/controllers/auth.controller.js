const { User, Role, LoginOtp  } = require("../models");
const { hashPassword, comparePassword } = require("../utils/hash");
const { signToken } = require("../utils/jwt");

exports.register = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ error: "Email, password, and role are required" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: "Email already exists" });

    const roleData = await Role.findOne({ where: { role } });
    if (!roleData) return res.status(400).json({ error: "Invalid role" });

    const passwordHash = await hashPassword(password);
    const user = await User.create({ email, passwordHash, userRole: roleData.roleId });

    res.status(201).json({ message: "User registered", user: { id: user.id, email: user.email, role } });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email & password required" });

    const user = await User.findOne({ where: { email }, include: Role });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const match = await comparePassword(password, user.passwordHash);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    // If role is buyer or supplier → require OTP
    if (["buyer", "supplier"].includes(user.Role.role)) {
      const otp = Math.floor(100000 + Math.random() * 900000);

      await LoginOtp.create({ userId: user.id, otp });

      console.log(`OTP for ${email}: ${otp}`); // simulate send via SMS/email
      return res.json({
        message: "OTP sent. Please verify.",
        requiresOtp: true
      });
    }

    // If admin → login directly
    const token = signToken({ id: user.id, role: user.Role.role });
    return res.json({
      token,
      user: { id: user.id, email: user.email, role: user.Role.role }
    });
  } catch (err) {
    next(err);
  }
};