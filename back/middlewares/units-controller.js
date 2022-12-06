// library imports

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

// models imports

const HttpError = require("../models/http-error");
const Unit = require("../models/units");

const getAllUnits = async (req, res, next) => {
  let units;
  try {
    units = await Unit.find();
  } catch (err) {
    const error = new HttpError("unknown error occured", 500);
    return next(error);
  }

  res.json(units);
};

exports.getAllUnits = getAllUnits;
