const express = require("express");
const { check } = require("express-validator");
// const checkAuth = require("../middlewares/check-auth");

const unitsController = require("../middlewares/units-controller");

const router = express.Router();

// only a test route for now
// everyone can get this data

router.get("/", unitsController.getAllUnits);

router.get("/averages",unitsController.getAverages);


module.exports = router;
