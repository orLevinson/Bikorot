const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const unitSchema = new Schema({
  name: { type: String, required: true },
  reviews: [{ type: mongoose.Types.ObjectId, required: true, ref: "Review" }],
  command : { type: mongoose.Types.ObjectId, required: true, ref: "Command" },
  division : { type: mongoose.Types.ObjectId, required: true, ref: "Division" },
  brigade : { type: mongoose.Types.ObjectId, required: true, ref: "Brigade" }
});

module.exports = mongoose.model("Unit", unitSchema);
