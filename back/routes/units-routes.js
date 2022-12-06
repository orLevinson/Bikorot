const express = require("express");
const { check } = require("express-validator");
// const checkAuth = require("../middlewares/check-auth");

const unitsController = require("../middlewares/units-controller");

const router = express.Router();

// only a test route for now

router.get("/", unitsController.getAllUnits);


module.exports = router;
