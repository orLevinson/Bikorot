// library imports

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

// models imports

const HttpError = require("../models/http-error");
const Info = require("../models/info");
const File = require("../models/file");

// object template import

const infoTemplate = require("../templates/blank-info");

// get all files middleware

const checkIfInfoExist = async (req, res, next) => {
  let info;
  try {
    info = await Info.findOne();
  } catch (err) {
    const error = new HttpError("unknown error occured", 500);
    return next(error);
  }

  if (!info) {
    const demoFile = new File({
      name: "demo",
      path: null,
    });
    const demoInfo = infoTemplate(demoFile._id);
    const newInfo = new Info({ ...demoInfo });
    try {
      const sess = await mongoose.startSession(); // start a session
      sess.startTransaction();
      await Promise.all([
        demoFile.save({ session: sess }),
        newInfo.save({ session: sess }),
      ]);
      await sess.commitTransaction(); //only now the changes will apply in the database

      await sess.endSession();
    } catch (err) {
      const error = new HttpError("unknown error occured", 500);
      return next(error);
    }
  }

  next();
};

const getAllFiles = async (req, res, next) => {
  let info;
  try {
    // turn the mongoDB object into a regular JS object
    info = await Info.findOne();
    info = info.toObject({ getters: true });
  } catch (err) {
    const error = new HttpError("unknown error occured", 500);
    return next(error);
  }

  // to get a nice looking object in the front end of all the files
  // I did the following rearrangement of the data to match the following pattern:
  // subject keys which holds category keys that each one of them holds the array of files
  // first declaring a variable
  let fileObj = {};
  // iterating through the info keys
  for (const [key1, value1] of Object.entries(info)) {
    //  only iterate subject keys
    if (key1 !== "_id" || key1 !== "__v") {
      // duplicate the subject key into the new object
      fileObj[key1] = {};
      // iterate each category key in each subject
      for (const [key, value] of Object.entries(value1)) {
        // to each category key in the new object insert
        // the files array of the category from the info Object
        fileObj[key1][key] = value.files;
      }
    }
  }

  res.json({ success: true, files: fileObj });
};

const getAllPercentages = async (req, res, next) => {
  let info;
  try {
    // turn the mongoDB object into a regular JS object
    info = await Info.findOne().lean();
  } catch (err) {
    const error = new HttpError("could not fetch percentages", 500);
    return next(error);
  }

  let percentagesObj = {};
  // iterating through the info keys
  for (const [key1, value1] of Object.entries(info)) {
    //  only iterate subject keys
    if (key1 !== "_id" || key1 !== "__v") {
      // duplicate the subject key into the new object
      percentagesObj[key1] = {};
      // iterate each category key in each subject
      for (const [key, value] of Object.entries(value1)) {
        // to each category key in the new object insert
        // the precent integer of the category from the info Object
        percentagesObj[key1][key] = value.percentage;
      }
    }
  }

  res.json({ success: true, percentages: percentagesObj });
};

const changeFile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { subject, category, question } = req.body;
  const file = req.file;

  let info;
  try {
    info = await Info.findOne();
  } catch (err) {
    const error = new HttpError("could not fetch files", 500);
    return next(error);
  }

  if (
    !info["subject" + subject] ||
    !info["subject" + subject]["category" + category]
  ) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  if (
    info["subject" + subject]["category" + category].files.length <=
      Math.round(parseInt(question)) ||
    parseInt(question) < 0
  ) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  try {
    const sess = await mongoose.startSession(); // start a session
    sess.startTransaction();
    const fileObj = new File({
      name: file.originalname,
      path: file.path,
    });
    info["subject" + subject]["category" + category].files[
      Math.round(parseInt(question))
    ] = fileObj._id;
    await info.save({ session: sess });
    await fileObj.save({ session: sess });
    await sess.commitTransaction(); //only now the changes will apply in the database

    await sess.endSession();
  } catch (err) {
    return next(
      new HttpError(err, 500)
    );
  }

  res.json({ success: true, message: "file has been changed" });
};

const changePercentages = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { values } = req.body;

  let info;
  try {
    info = await Info.findOne();
  } catch (err) {
    const error = new HttpError("could not fetch files", 500);
    return next(error);
  }

  let count = 0;
  for (const [key1, value1] of Object.entries(info.toObject())) {
    //  only iterate subject keys
    if (key1 !== "_id" || key1 !== "__v") {
      // iterate each category key in each subject
      for (const [key, value] of Object.entries(value1)) {
        info[key1][key].percentage = values[count];
        count++;
      }
    }
  }

  try {
    await info.save();
  } catch (err) {
    const error = new HttpError("unknown error occured", 500);
    return next(error);
  }

  res.json({ success: true, message: "precentages have been changed" });
};

exports.checkIfInfoExist = checkIfInfoExist;
exports.getAllFiles = getAllFiles;
exports.getAllPercentages = getAllPercentages;
exports.changeFile = changeFile;
exports.changePercentages = changePercentages;
