const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commandSchema = new Schema({
  name: { type: String, required: true },
  divisions: [{ type: mongoose.Types.ObjectId, ref: "Division" }],
  directUnits:[{ type: mongoose.Types.ObjectId, ref: "Unit" }]
});

module.exports = mongoose.model("Command", commandSchema);
