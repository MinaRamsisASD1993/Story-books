const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");

// Load User Model
require("../models/User");
const User = mongoose.model("User");

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
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleID: profile.id }).then(user => {
        if (user) {
          console.log("There is a user");
          return done(null, user);
        } else {
          console.log("There is NOT ");
          const googleID = profile.id;
          const firstName = profile.name.givenName;
          const lastName = profile.name.familyName;
          const email = profile.emails[0].value;
          const photo = String(profile.photos[0].value);
          const photoResized = photo.substring(0, photo.indexOf("?sz=50"));

          const newUser = {
            googleID,
            firstName,
            lastName,
            email,
            photo: photoResized
          };
          const user = new User(newUser);
          user
            .save()
            .then(() => {
              return done(null, user);
            })
            .catch(err => console.log(err));
        }
      });
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
