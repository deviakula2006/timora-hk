const mongoose = require("mongoose");

const Users = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: false
  },

  name: {
    type: String
  },

  authType: {
    type: String,
    enum: ["local", "google"],
    default: "local"
  }
});

module.exports = mongoose.model("users", Users);
