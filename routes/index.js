const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Load 'Story' Model
require("../models/Story");
const Story = mongoose.model("Story");

// Ensure Auth For Restricting Routes
const { isAuth } = require("../helpers/isAuth");

router.get("/", (req, res) => {
  res.render("index/welcome");
});

router.get("/about", (req, res) => {
  res.render("index/about");
});

router.get("/dashboard", isAuth, (req, res) => {
  Story.find({ userID: req.user._id }).then(stories => {
    res.render("index/dashboard", {
      stories
    });
  });
});

module.exports = router;
