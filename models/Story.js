const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StorySchema = new Schema({
  title: String,
  details: String,
  status: String,
  allowComments: Boolean,
  userID: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  comments: [
    {
      commentBody: String,
      commentUserID: {
        type: Schema.Types.ObjectId,
        ref: "User"
      },
      commentDate: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model("Story", StorySchema, "stories");
