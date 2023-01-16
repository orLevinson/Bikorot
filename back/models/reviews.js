const mongoose = require("mongoose");
var arrayValidator = require("mongoose-array-validator");
const autoPopulate = require("mongoose-autopopulate");

const Schema = mongoose.Schema;

const unitSchema = new Schema({
  dateCreated: { type: Date, required: true },
  author: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  unit: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Unit",
    autopopulate: true,
  },
  command: { type: mongoose.Types.ObjectId, required: true, ref: "Command" },
  division: { type: mongoose.Types.ObjectId, ref: "Division" },
  brigade: { type: mongoose.Types.ObjectId, ref: "Brigade" },
  scores: {
    subject1: {
      category1: {
        type: [
          { score: { type: Number, required: true }, text: { type: String } },
        ],
        minItems: 4,
        maxItems: 4,
      },
      category2: {
        type: [
          { score: { type: Number, required: true }, text: { type: String } },
        ],
        minItems: 14,
        maxItems: 14,
      },
      category3: {
        type: [
          { score: { type: Number, required: true }, text: { type: String } },
        ],
        minItems: 6,
        maxItems: 6,
      },
      category4: {
        type: [
          { score: { type: Number, required: true }, text: { type: String } },
        ],
        minItems: 15,
        maxItems: 15,
      },
      category5: {
        type: [
          { score: { type: Number, required: true }, text: { type: String } },
        ],
        minItems: 8,
        maxItems: 8,
      },
      category6: {
        type: [
          { score: { type: Number, required: true }, text: { type: String } },
        ],
        minItems: 3,
        maxItems: 3,
      },
      category7: {
        type: [
          { score: { type: Number, required: true }, text: { type: String } },
        ],
        minItems: 1,
        maxItems: 1,
      },
      category8: {
        type: [
          { score: { type: Number, required: true }, text: { type: String } },
        ],
        minItems: 7,
        maxItems: 7,
      },
      category9: {
        type: [
          { score: { type: Number, required: true }, text: { type: String } },
        ],
        minItems: 4,
        maxItems: 4,
      },
      category10: {
        type: [
          { score: { type: Number, required: true }, text: { type: String } },
        ],
        minItems: 6,
        maxItems: 6,
      },
    },
    subject2: {
      category1: {
        type: [
          { score: { type: Number, required: true }, text: { type: String } },
        ],
        minItems: 5,
        maxItems: 5,
      },
      category2: {
        type: [
          { score: { type: Number, required: true }, text: { type: String } },
        ],
        minItems: 4,
        maxItems: 4,
      },
    },
    subject3: {
      category1: {
        type: [
          { score: { type: Number, required: true }, text: { type: String } },
        ],
        minItems: 1,
        maxItems: 1,
      },
      category2: {
        type: [
          { score: { type: Number, required: true }, text: { type: String } },
        ],
        minItems: 1,
        maxItems: 1,
      },
      category3: {
        type: [
          { score: { type: Number, required: true }, text: { type: String } },
        ],
        minItems: 1,
        maxItems: 1,
      },
      category4: {
        type: [
          { score: { type: Number, required: true }, text: { type: String } },
        ],
        minItems: 1,
        maxItems: 1,
      },
      category5: {
        type: [
          { score: { type: Number, required: true }, text: { type: String } },
        ],
        minItems: 1,
        maxItems: 1,
      },
      category6: {
        type: [
          { score: { type: Number, required: true }, text: { type: String } },
        ],
        minItems: 1,
        maxItems: 1,
      },
    },
    subject4: {
      category1: {
        type: [
          { score: { type: Number, required: true }, text: { type: String } },
        ],
        minItems: 1,
        maxItems: 1,
      },
      category2: {
        type: [
          { score: { type: Number, required: true }, text: { type: String } },
        ],
        minItems: 1,
        maxItems: 1,
      },
      category3: {
        type: [
          { score: { type: Number, required: true }, text: { type: String } },
        ],
        minItems: 1,
        maxItems: 1,
      },
      category4: {
        type: [
          { score: { type: Number, required: true }, text: { type: String } },
        ],
        minItems: 1,
        maxItems: 1,
      },
      category5: {
        type: [
          { score: { type: Number, required: true }, text: { type: String } },
        ],
        minItems: 1,
        maxItems: 1,
      },
      category6: {
        type: [
          { score: { type: Number, required: true }, text: { type: String } },
        ],
        minItems: 1,
        maxItems: 1,
      },
      category7: {
        type: [
          { score: { type: Number, required: true }, text: { type: String } },
        ],
        minItems: 1,
        maxItems: 1,
      },
    },
    subject5: {
      category1: {
        type: [
          { score: { type: Number, required: true }, text: { type: String } },
        ],
        minItems: 8,
        maxItems: 8,
      },
      category2: {
        type: [
          { score: { type: Number, required: true }, text: { type: String } },
        ],
        minItems: 5,
        maxItems: 5,
      },
      category3: {
        type: [
          { score: { type: Number, required: true }, text: { type: String } },
        ],
        minItems: 3,
        maxItems: 3,
      },
    },
    subject6: {
      category1: {
        type: [
          { score: { type: Number, required: true }, text: { type: String } },
        ],
        minItems: 11,
        maxItems: 11,
      },
    },
  },
  Summary: {
    subject1: {
      text: { type: String },
      score: { type: Number, required: true },
    },
    subject2: {
      text: { type: String },
      score: { type: Number, required: true },
    },
    subject3: {
      text: { type: String },
      score: { type: Number, required: true },
    },
    subject4: {
      text: { type: String },
      score: { type: Number, required: true },
    },
    subject5: {
      text: { type: String },
      score: { type: Number, required: true },
    },
  },
  // 2 dimensional array of strings for the table with max items of 5
  table: [
    {
      type: [{ type: String }],
      minItems: 5,
      maxItems: 5,
    },
  ],
  // the people being reviewed
  reviewed: [
    { name: { type: String }, rank: { type: String }, job: { type: String } },
  ],
  // tagged along the way
  tagAlong: [
    { name: { type: String }, rank: { type: String }, job: { type: String } },
  ],
  // sum up paragraph
  sumUp: { type: String },
  // what to preserve
  preserve: [{ type: String }],
  // what to change
  change: [{ type: String }],
  Score: { type: Number, required: true },
});

unitSchema.plugin(arrayValidator);
unitSchema.plugin(autoPopulate);

module.exports = mongoose.model("Review", unitSchema);
