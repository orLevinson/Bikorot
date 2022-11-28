const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const fileSchema = new Schema({
  name: { type: String, required: true },
  path: { type: String }
});

module.exports = mongoose.model("File", fileSchema);
