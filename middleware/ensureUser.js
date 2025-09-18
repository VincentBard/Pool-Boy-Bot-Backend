import User from "../database/userSchema.js";

const ensureUser = async (req, res, next) => {
  try {
    let user = await User.findOne({ auth0Id: req.auth.sub });

    if (!user) {
      if (!req.auth.email) {
        return res.status(400).json({ message: "Email missing in JWT" });
      }

      user = await User.create({
        auth0Id: req.auth.sub,
        email: req.auth.email,  // ✅ use real email
        name: req.auth.name || "New User"
      });
    }

    req.user = user;
    next();
  } catch (err) {
    // if duplicate key error happens, just fetch the existing user
    if (err.code === 11000) {
      req.user = await User.findOne({ auth0Id: req.auth.sub });
      return next();
    }
    next(err);
  }
};

export default ensureUser;