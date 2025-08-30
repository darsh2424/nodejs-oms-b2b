const { UserProfile, User } = require("../models");

exports.upsertProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { company_name, company_city, company_state, contactno, company_gstn } = req.body;

    if (!company_name || !company_city || !company_state || !contactno || !company_gstn) {
      return res.status(400).json({ error: "All profile fields are required" });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    let profile;

    if (user.profileId) {
      // Update existing profile
      profile = await UserProfile.findByPk(user.profileId);
      if (!profile) return res.status(404).json({ error: "Profile not found" });

      await profile.update({ company_name, company_city, company_state, contactno, company_gstn });
    } else {
      // Create new profile
      profile = await UserProfile.create({ company_name, company_city, company_state, contactno, company_gstn });

      // Link via association helper
      await user.setUserProfile(profile);
    }

    res.json({ message: "Profile saved successfully", profile });
  } catch (err) {
    next(err);
  }
};
