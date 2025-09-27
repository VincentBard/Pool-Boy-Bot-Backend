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
    let user = await User.findOneAndUpdate(
      { email: req.auth.email },   // use email as stable identifier
      {
        $setOnInsert: {
          auth0Id: req.auth.sub,
          name: req.auth.name || "New User",
          firstName: req.auth.given_name || "Unknown",
          lastName: req.auth.family_name || "Unknown",
          phone: "N/A",
        },
      },
      { new: true, upsert: true }
    );

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export default ensureUser;