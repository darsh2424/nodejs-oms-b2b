const { LoginOtp, User, Role } = require("../models");
const { signToken } = require("../utils/jwt");

// Step 1: Generate OTP
exports.generateOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000); 

    await LoginOtp.create({
      userId: user.id,
      otp
    });

    // For real-world → send via email/SMS
    console.log(`OTP for ${email}: ${otp}`);

    res.json({ message: "OTP generated. (Check console for demo)" });
  } catch (err) {
    next(err);
  }
};

// Step 2: Verify OTP
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: "Email & OTP required" });

    const user = await User.findOne({ where: { email }, include: Role });
    if (!user) return res.status(404).json({ error: "User not found" });

    const otpRecord = await LoginOtp.findOne({
      where: { userId: user.id, otp },
      order: [["created_at", "DESC"]] 
    });

    if (!otpRecord) return res.status(400).json({ error: "Invalid OTP" });

    // Check expiry (5 min)
    const otpAge = (Date.now() - otpRecord.createdAt.getTime()) / 1000;
    if (otpAge > 300) return res.status(400).json({ error: "OTP expired" });

    // Success → issue JWT
    const token = signToken({ id: user.id, role: user.Role.role });

    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.Role.role }
    });
  } catch (err) {
    next(err);
  }
};
