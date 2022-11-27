// library imports

const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs"); //hash a password
const jwt = require("jsonwebtoken"); //generate a token
const mongoose = require("mongoose");

// models imports

const HttpError = require("../models/http-error");
const User = require("../models/users");

// login middleware

const login = async (req, res, next) => {
  // checks if the password and username validation was fulfilled(the validation rules were declared in the users router)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { password, personalNum } = req.body;

  let user;

  try {
    user = await User.findOne({ personalNum });
  } catch (err) {
    const error = new HttpError("logging in failed, please try again", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("logging in failed, please try again", 500);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, user.password);
  } catch (err) {
    const error = new HttpError("logging in failed, please try again", 500);
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("logging in failed, please try again", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        personalNum,
      },
      process.env.JWT_KEY, //process.env.JWT_KEY is taken from nodemon.json
      { expiresIn: "1w" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    success: true,
    token,
    name: user.name,
  });
};

exports.login = login;
exports.register = login;
exports.changePerms = login;
exports.delete = login;
