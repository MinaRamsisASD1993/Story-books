const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Load Keys for mongoose
const keys = require("./config/keys");
// Load Routes
const authRoutes = require("./routes/auth");

mongoose
  .connect(keys.mongoURI, { useNewUrlParser: true })
  .then(() => console.log("MongoDB is now connected..."))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("OK");
});

// auth Route
app.use("/auth", authRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App is now listening to port ${port}`);
});
