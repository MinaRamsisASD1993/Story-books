const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Load keys
const keys = require("./keys");

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.clientID,
      clientSecret: keys.clientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log(profile);
    }
  )
);
