// library imports

const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt"); //hash a password
const jwt = require("jsonwebtoken"); //generate a token
const mongoose = require("mongoose");

// models imports

const HttpError = require("../models/http-error");
const User = require("../models/users");

// get all users middleware

const getAllUsers = async (req, res, next) => {
  let users = [];
  try {
    users = await User.find({}, "name personalNum _id perms");
  } catch (err) {
    const error = new HttpError("getting users failed, please try again", 500);
    return next(error);
  }

  res.json({
    success: true,
    users: users,
  });
};

const getUser = async (req, res, next) => {
  const UserId = req.params.uid;

  let user;
  try {
    user = await User.findById(UserId, "name personalNum _id perms");
  } catch (err) {
    const error = new HttpError(
      "getting usfdsaers failed, please try again",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("No user was found", 500);
    return next(error);
  }

  res.json({
    success: true,
    user,
  });
};

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

  // comparing the password to the hashed version saved in the DB
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, user.password);
  } catch (err) {
    const error = new HttpError("logging in failed, please try again", 500);
    return next(error);
  }

  // throw an error if the passowrd didnt match the hashed one in db
  if (!isValidPassword) {
    const error = new HttpError("logging in failed, please try again", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        id: user._id,
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
    id: user._id,
    perms: user.perms,
  });
};

const register = async (req, res, next) => {
  // checks if the password,personalNum and name validation was fulfilled(the validation rules were declared in the users router)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, password, personalNum } = req.body;

  // check if a user with the same personal num has already registered
  let user;
  try {
    user = await User.findOne({ personalNum });
  } catch (err) {
    const error = new HttpError("Registering failed, please try again", 500);
    return next(error);
  }

  if (!!user) {
    const error = new HttpError(
      "There is an existing user with the same personal number",
      500
    );
    return next(error);
  }

  // hashing the password to saved a hashed version of the password in the DB
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Registeration failed, please try again later.",
      500
    );
    return next(error);
  }

  // creating a new user object
  const newUser = new User({
    name,
    password: hashedPassword,
    personalNum,
    perms: null,
  });

  //saving user in DB
  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError(
      "Registeration failed, please try again later.",
      500
    );
    return next(error);
  }

  // returning a token to the user(just like in logging in)
  let token;
  try {
    token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.JWT_KEY, //process.env.JWT_KEY is taken from nodemon.json
      { expiresIn: "1w" }
    );
  } catch (err) {
    const error = new HttpError(
      "Registeration failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    success: true,
    token,
    name: newUser.name,
    id: newUser._id,
    perms: newUser.perms,
  });
};

const changePerms = async (req, res, next) => {
  // checks if the password,personalNum and name validation was fulfilled(the validation rules were declared in the users router)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const UserId = req.params.uid;

  const { perms } = req.body;

  if (
    !!perms &&
    perms !== "none" &&
    perms !== "manager" &&
    perms !== "reviewer"
  ) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  if (perms === "manager") {
    const adminId = req.userData.id;
    let adminObj;
    try {
      adminObj = await User.findOne({ _id: adminId });
    } catch (err) {
      const error = new HttpError(
        "Changing perms failed, please try again",
        500
      );
      return next(error);
    }
    if (!adminObj) {
      const error = new HttpError(
        "Changing perms failed, please try again",
        500
      );
      return next(error);
    }
    if (adminObj.perms !== "global") {
      const error = new HttpError(
        "You do not have the permission to do this",
        401
      );
      return next(error);
    }
  }

  // pull the specified user object
  let user;
  try {
    user = await User.findById(UserId);
  } catch (err) {
    const error = new HttpError("Changing perms failed, please try again", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("There is no user with the specified Id", 500);
    return next(error);
  }

  // if the admin tries to change the user's permission to ones he already have
  if (user.perms === perms) {
    const error = new HttpError(
      "The user already had the same perms",
      422,
      true
    );
    return next(error);
  }

  try {
    user.perms = perms === "none" ? null : perms;
    await user.save();
  } catch (err) {
    const error = new HttpError("Changing perms failed, please try again", 500);
    return next(error);
  }

  res.json({
    success: true,
    name: user.name,
    id: user._id,
    perms: user.perms,
  });
};

const deleteUser = async (req, res, next) => {
  const UserId = req.params.uid;

  // pull the specified user object
  try {
    await User.findByIdAndDelete(UserId);
  } catch (err) {
    const error = new HttpError("Changing perms failed, please try again", 500);
    return next(error);
  }

  res.json({
    success: true,
    message: "The user has been deleted successfully",
  });
};

exports.getAllUsers = getAllUsers;
exports.getUser = getUser;
exports.login = login;
exports.register = register;
exports.changePerms = changePerms;
exports.delete = deleteUser;
