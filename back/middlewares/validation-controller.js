// library imports

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

// models imports

const HttpError = require("../models/http-error");
const User = require("../models/users");

// check if the user that commiting the procedure is a manager or gloabl
const checkGlobalOrManager = async (req, res, next) => {
  let adminId = !!req.userData ? req.userData.id : null;

  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    const error = new HttpError("Authorization failed", 403);
    return next(error);
  }

  let user;
  try {
    user = await User.findOne({ _id: adminId });
  } catch (err) {
    const error = new HttpError("Authorization failed", 403);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Authorization failed", 403);
    return next(error);
  }

  if (user.perms !== "global" && user.perms !== "manager") {
    const error = new HttpError("You lack the necessary permissions", 401);
    return next(error);
  }

  next();
};

// check if the user that commiting the procedure is a manager or gloabl or it is his own data
const checkGlobalOrManagerOrPersonal = async (req, res, next) => {
  let adminId = !!req.userData ? req.userData.id : null;
  let userId = req.params.uid;

  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    const error = new HttpError("Authorization failed", 403);
    return next(error);
  }

  let user;
  try {
    user = await User.findOne({ _id: adminId });
  } catch (err) {
    const error = new HttpError("Authorization failed", 403);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Authorization failed", 403);
    return next(error);
  }

  if (
    user.perms === "global" ||
    user.perms === "manager" ||
    user._id.equals(userId)
  ) {
    next();
  } else {
    const error = new HttpError("You lack the necessary permissions", 401);
    return next(error);
  }
};

// check if the user that commiting the procedure is a manager or gloabl
const checkGlobalOrManagerOrReviewer = async (req, res, next) => {
  let adminId = !!req.userData ? req.userData.id : null;

  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    const error = new HttpError("Authorization failed", 403);
    return next(error);
  }

  let user;
  try {
    user = await User.findOne({ _id: adminId });
  } catch (err) {
    const error = new HttpError("Authorization failed", 403);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Authorization failed", 403);
    return next(error);
  }

  if (!user.perms) {
    const error = new HttpError("You lack the necessary permissions", 401);
    return next(error);
  } else {
    next();
  }
};

exports.checkGlobalOrManager = checkGlobalOrManager;
exports.checkGlobalOrManagerOrPersonal = checkGlobalOrManagerOrPersonal;
exports.checkGlobalOrManagerOrReviewer = checkGlobalOrManagerOrReviewer;
