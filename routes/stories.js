const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Load 'Story' Model
require("../models/Story");
const Story = mongoose.model("Story");

// Ensure Auth For Restricting Routes
const { isAuth } = require("../helpers/isAuth");

// '/stories' Route .. it's a public Route
router.get("/", (req, res) => {
  Story.find({ status: "public" })
    .sort({ date: "desc" })
    .populate("userID")
    .then(stories => {
      res.render("stories/index", {
        stories
      });
    })
    .catch(err => {
      console.log(err);
    });
});
// '/stories/users/:uderID' Route
router.get("/users/:userID", (req, res) => {
  Story.find({ userID: req.params.userID, status: "public" })
    .sort({ date: "desc" })
    .populate("userID")
    .then(stories => {
      res.render("stories/index", {
        stories
      });
    });
});
// '/stories/my' Route
router.get("/my", isAuth, (req, res) => {
  Story.find({ userID: req.user.id })
    .sort({ date: "desc" })
    .populate("userID")
    .then(stories => {
      res.render("stories/index", {
        stories
      });
    });
});

// '/stories/add' Route
router.get("/add", isAuth, (req, res) => {
  res.render("stories/add");
});

// '/stories/show/:id' Route
router.get("/show/:id", (req, res) => {
  Story.findById(req.params.id)
    .populate("userID")
    .populate("comments.commentUserID")
    .then(story => {
      if (story.status === "private") {
        // If logged in user
        if (req.user) {
          // Check to see if it's his story
          if (req.user.id == story.userID._id) {
            console.log("SAME USER TRYING TO ACCESS his private");
            res.render("stories/show", {
              story
            });
          } else {
            console.log("ANother USER ");
            res.redirect("/dashboard");
          }
        } else {
          res.redirect("/");
        }
      } else {
        res.render("stories/show", {
          story
        });
      }
    });
});

// '/stories/edit' Route
router.get("/edit/:id", isAuth, (req, res) => {
  Story.findById(req.params.id).then(story => {
    if (req.user.id == story.userID) {
      res.render("stories/edit", {
        story
      });
    } else {
      res.redirect("/dashboard");
    }
  });
});

// Handling POST '/stories/add'
router.post("/add", isAuth, (req, res) => {
  let { title, status, allowComments, details } = req.body;
  if (allowComments === "on") {
    allowComments = true;
  } else {
    allowComments = false;
  }
  const newStory = {
    title,
    status,
    allowComments,
    details,
    userID: req.user._id
  };
  const story = new Story(newStory);
  story
    .save()
    .then(story => {
      res.redirect(`/stories/show/${story._id}`);
    })
    .catch(err => {
      console.log(err);
    });
});
// Handling DELETE '/stories/delete/:id'
router.delete("/delete/:id", isAuth, (req, res) => {
  Story.findByIdAndRemove(req.params.id).then(() => {
    res.redirect("/dashboard");
  });
});

// Handling PUT '/stories/edit/:id'
router.put("/edit/:id", isAuth, (req, res) => {
  let { title, status, allowComments, details } = req.body;
  if (allowComments === "on") {
    allowComments = true;
  } else {
    allowComments = false;
  }
  Story.findOneAndUpdate(
    { _id: req.params.id },
    {
      title,
      status,
      allowComments,
      details
    }
  ).then(updStory => {
    res.redirect(`/stories/show/${updStory._id}`);
  });
});

// POST New Comment
router.post("/comments/:id", (req, res) => {
  const newComment = {
    commentBody: req.body.comment,
    commentUserID: req.user.id
  };
  Story.findById(req.params.id).then(story => {
    story.comments = [newComment, ...story.comments];
    story.save().then(() => {
      res.redirect(`/stories/show/${req.params.id}`);
    });
  });
});

module.exports = router;
