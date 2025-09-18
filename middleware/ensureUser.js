import User from "../database/userSchema.js";

const ensureUser = async (req, res, next) => {
  try {
    // Look for user by Auth0 sub
    let user = await User.findOne({ auth0Id: req.auth.sub });

    // If user does not exist, create one
    if (!user) {
      user = await User.create({
        auth0Id: req.auth.sub,
        email: req.auth.email || "unknown@example.com",
        name: req.auth.name || "New User"
      });
    }

    req.user = user; // attach user to request
    next();
  } catch (err) {
    next(err);
  }
};

export default ensureUser;
