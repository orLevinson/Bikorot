const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  personalNum: { type: String, required: true },
  perms: { type: String }, // can be only global,manager,reviewer
});

module.exports = mongoose.model("User", userSchema);
