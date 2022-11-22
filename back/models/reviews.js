const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const unitSchema = new Schema({
  dateCreated: { type: Date, required: true },
  author:{ type: mongoose.Types.ObjectId, required: true, ref: "User" },
  unit: { type: mongoose.Types.ObjectId, required: true, ref: "Unit" },
  command: { type: mongoose.Types.ObjectId, required: true, ref: "Command" },
  division: { type: mongoose.Types.ObjectId, required: true, ref: "Division" },
  brigade: { type: mongoose.Types.ObjectId, required: true, ref: "Brigade" },
});

module.exports = mongoose.model("Unit", unitSchema);
