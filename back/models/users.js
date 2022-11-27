const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  personalNum: { type: String, required: true },
  perms: { type: String, required: true }, // can be only global,manager,reviewer
});

module.exports = mongoose.model("User", userSchema);
