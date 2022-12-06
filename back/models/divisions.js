const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const divisionSchema = new Schema({
  name: { type: String, required: true },
  brigades: [{ type: mongoose.Types.ObjectId, ref: "Brigade" }],
  parentCommand: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Command",
  },
  directUnits: [{ type: mongoose.Types.ObjectId, ref: "Unit" }],
});

module.exports = mongoose.model("Division", divisionSchema);
