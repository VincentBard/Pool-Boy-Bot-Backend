import User from "../database/userSchema.js";


const ensureUser = async (req, res, next) => {
  try {
    // Machine token (client_credentials grant) has no email
    if (!req.auth.email) {
      // Just attach a "machine identity" instead of a user
      req.user = { isMachine: true, sub: req.auth.sub };
      return next();
    }

    // Human user flow
    let user = await User.findOne({ auth0Id: req.auth.sub });
    if (!user) {
      user = await User.create({
        auth0Id: req.auth.sub,
        email: req.auth.email,
        name: req.auth.name || "New User"
      });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export default ensureUser;