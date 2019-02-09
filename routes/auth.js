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
// '/auth/logout' Route
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/verify", (req, res) => {
  if (req.user) {
    console.log(req.user);
  } else {
    console.log("NOT AUTH");
  }
});

module.exports = router;
