const mongoose = require("mongoose");
const arrayValidator = require("mongoose-array-validator");
const autoPopulate = require("mongoose-autopopulate");

const Schema = mongoose.Schema;

const infoSchema = new Schema({
  subject1: {
    category1: {
      files: {
        type: [
          { type: mongoose.Types.ObjectId, ref: "File", autopopulate: true },
        ],
        minItems: 4,
        maxItems: 4,
      },
      percentage: { type: Number },
    },
    category2: {
      files: {
        type: [
          { type: mongoose.Types.ObjectId, ref: "File", autopopulate: true },
        ],
        minItems: 14,
        maxItems: 14,
      },
      percentage: { type: Number },
    },
    category3: {
      files: {
        type: [
          { type: mongoose.Types.ObjectId, ref: "File", autopopulate: true },
        ],
        minItems: 6,
        maxItems: 6,
      },
      percentage: { type: Number },
    },
    category4: {
      files: {
        type: [
          { type: mongoose.Types.ObjectId, ref: "File", autopopulate: true },
        ],
        minItems: 15,
        maxItems: 15,
      },
      percentage: { type: Number },
    },
    category5: {
      files: {
        type: [
          { type: mongoose.Types.ObjectId, ref: "File", autopopulate: true },
        ],
        minItems: 8,
        maxItems: 8,
      },
      percentage: { type: Number },
    },
    category6: {
      files: {
        type: [
          { type: mongoose.Types.ObjectId, ref: "File", autopopulate: true },
        ],
        minItems: 3,
        maxItems: 3,
      },
      percentage: { type: Number },
    },
    category7: {
      files: {
        type: [
          { type: mongoose.Types.ObjectId, ref: "File", autopopulate: true },
        ],
        minItems: 1,
        maxItems: 1,
      },
      percentage: { type: Number },
    },
    category8: {
      files: {
        type: [
          { type: mongoose.Types.ObjectId, ref: "File", autopopulate: true },
        ],
        minItems: 7,
        maxItems: 7,
      },
      percentage: { type: Number },
    },
    category9: {
      files: {
        type: [
          { type: mongoose.Types.ObjectId, ref: "File", autopopulate: true },
        ],
        minItems: 4,
        maxItems: 4,
      },
      percentage: { type: Number },
    },
    category10: {
      files: {
        type: [
          { type: mongoose.Types.ObjectId, ref: "File", autopopulate: true },
        ],
        minItems: 6,
        maxItems: 6,
      },
      percentage: { type: Number },
    },
  },
  subject2: {
    category1: {
      files: {
        type: [
          { type: mongoose.Types.ObjectId, ref: "File", autopopulate: true },
        ],
        minItems: 5,
        maxItems: 5,
      },
      percentage: { type: Number },
    },
    category2: {
      files: {
        type: [
          { type: mongoose.Types.ObjectId, ref: "File", autopopulate: true },
        ],
        minItems: 4,
        maxItems: 4,
      },
      percentage: { type: Number },
    },
  },
  subject3: {
    category1: {
      files: {
        type: [
          { type: mongoose.Types.ObjectId, ref: "File", autopopulate: true },
        ],
        minItems: 1,
        maxItems: 1,
      },
      percentage: { type: Number },
    },
    category2: {
      files: {
        type: [
          { type: mongoose.Types.ObjectId, ref: "File", autopopulate: true },
        ],
        minItems: 1,
        maxItems: 1,
      },
      percentage: { type: Number },
    },
    category3: {
      files: {
        type: [
          { type: mongoose.Types.ObjectId, ref: "File", autopopulate: true },
        ],
        minItems: 1,
        maxItems: 1,
      },
      percentage: { type: Number },
    },
    category4: {
      files: {
        type: [
          { type: mongoose.Types.ObjectId, ref: "File", autopopulate: true },
        ],
        minItems: 1,
        maxItems: 1,
      },
      percentage: { type: Number },
    },
    category5: {
      files: {
        type: [
          { type: mongoose.Types.ObjectId, ref: "File", autopopulate: true },
        ],
        minItems: 1,
        maxItems: 1,
      },
      percentage: { type: Number },
    },
    category6: {
      files: {
        type: [
          { type: mongoose.Types.ObjectId, ref: "File", autopopulate: true },
        ],
        minItems: 1,
        maxItems: 1,
      },
      percentage: { type: Number },
    },
  },
  subject4: {
    category1: {
      files: {
        type: [
          { type: mongoose.Types.ObjectId, ref: "File", autopopulate: true },
        ],
        minItems: 1,
        maxItems: 1,
      },
      percentage: { type: Number },
    },
    category2: {
      files: {
        type: [
          { type: mongoose.Types.ObjectId, ref: "File", autopopulate: true },
        ],
        minItems: 1,
        maxItems: 1,
      },
      percentage: { type: Number },
    },
    category3: {
      files: {
        type: [
          { type: mongoose.Types.ObjectId, ref: "File", autopopulate: true },
        ],
        minItems: 1,
        maxItems: 1,
      },
      percentage: { type: Number },
    },
    category4: {
      files: {
        type: [
          { type: mongoose.Types.ObjectId, ref: "File", autopopulate: true },
        ],
        minItems: 1,
        maxItems: 1,
      },
      percentage: { type: Number },
    },
    category5: {
      files: {
        type: [
          { type: mongoose.Types.ObjectId, ref: "File", autopopulate: true },
        ],
        minItems: 1,
        maxItems: 1,
      },
      percentage: { type: Number },
    },
    category6: {
      files: {
        type: [
          { type: mongoose.Types.ObjectId, ref: "File", autopopulate: true },
        ],
        minItems: 1,
        maxItems: 1,
      },
      percentage: { type: Number },
    },
    category7: {
      files: {
        type: [
          { type: mongoose.Types.ObjectId, ref: "File", autopopulate: true },
        ],
        minItems: 1,
        maxItems: 1,
      },
      percentage: { type: Number },
    },
  },
  subject5: {
    category1: {
      files: {
        type: [
          { type: mongoose.Types.ObjectId, ref: "File", autopopulate: true },
        ],
        minItems: 8,
        maxItems: 8,
      },
      percentage: { type: Number },
    },
    category2: {
      files: {
        type: [
          { type: mongoose.Types.ObjectId, ref: "File", autopopulate: true },
        ],
        minItems: 5,
        maxItems: 5,
      },
      percentage: { type: Number },
    },
    category3: {
      files: {
        type: [
          { type: mongoose.Types.ObjectId, ref: "File", autopopulate: true },
        ],
        minItems: 3,
        maxItems: 3,
      },
      percentage: { type: Number },
    },
  },
  subject6: {
    category1: {
      files: {
        type: [
          { type: mongoose.Types.ObjectId, ref: "File", autopopulate: true },
        ],
        minItems: 11,
        maxItems: 11,
      },
      percentage: { type: Number },
    },
  },
});

infoSchema.plugin(arrayValidator);
infoSchema.plugin(autoPopulate);

module.exports = mongoose.model("Info", infoSchema);
