const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const brigadeSchema = new Schema({
  name: { type: String, required: true },
  units: [{ type: mongoose.Types.ObjectId, required: true, ref: "Unit" }],
  parentDivision : { type: mongoose.Types.ObjectId, required: true, ref: "Division" }
});

module.exports = mongoose.model("Brigade", brigadeSchema);
