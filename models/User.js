const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  googleID: String,
  firstName: String,
  lastName: String,
  email: String,
  photo: String
});

mongoose.model("User", UserSchema, "users");
