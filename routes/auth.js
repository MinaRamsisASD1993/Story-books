const express = require("express");
const passport = require("passport");
const router = express.Router();

// Load Google Strategy
require("../config/passport");

// '/auth/google' Route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// '/auth/google/callback' Route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/users/login" }),
  (req, res) => {
    // Successful authentication, redirect dashboard.
    res.redirect("/dashboard");
  }
);

module.exports = router;
