const express = require("express");
const { check } = require("express-validator");
// get the token as userData
const checkAuth = require("../middlewares/check-auth");

const usersController = require("../middlewares/users-controller");
const validationController = require("../middlewares/validation-controller");

const router = express.Router();

// login

router.post(
  "/login",
  [check("password").not().isEmpty(), check("personalNum").not().isEmpty()],
  usersController.login
);

// register

router.post(
  "/register",
  [
    check("name").not().isEmpty(),
    check("password").not().isEmpty(),
    check("personalNum").isLength({ min: 6 }),
  ],
  usersController.register
);

// only admins & global perms allowed to preform the following tasks
router.use(checkAuth);

// getting all users

router.get(
  "/allUsers",
  validationController.checkGlobalOrManager,
  usersController.getAllUsers
);

//get one user data
// only by admins & globals or by the person it belongs himself

router.get(
  "/:uid",
  validationController.checkGlobalOrManagerOrPersonal,
  usersController.getUser
);

// promote/demote
// will provide token which will validate if promotion/demotion is possible
// if global the user who is taking action has the following rank he can demote/promote to the following perms:
// global - can promote/demote to regular/reviewer/manager
// manager - can promote/demote to regular/reviewer
// reviewer - cannot change perms
// regular - cannot change perms

router.patch(
  "/perms/:uid",
  [check("perms").not().isEmpty()],
  validationController.checkGlobalOrManager,
  usersController.changePerms
);

// delete
// only allowed by global/manager perms users
router.delete(
  "/:uid",
  validationController.checkGlobalOrManager,
  usersController.delete
);

module.exports = router;
