const express = require("express");
const { check } = require("express-validator");
const fileUpload = require("../middlewares/file-upload");
const multer = require("multer");
const checkAuth = require("../middlewares/check-auth");

const infoController = require("../middlewares/info-controller");
const validationController = require("../middlewares/validation-controller");

const router = express.Router();

// getting all files

router.get(
  "/allFiles",
  infoController.checkIfInfoExist,
  infoController.getAllFiles
);

// getting all Pecentages

router.get(
  "/allPercentages",
  infoController.checkIfInfoExist,
  infoController.getAllPercentages
);

// only admins & global perms allowed to preform the following tasks
router.use(checkAuth);

//change one file

router.patch(
  "/changeFile",
  validationController.checkGlobalOrManager,
  infoController.checkIfInfoExist,
  fileUpload.single("file"),
  [
    check("subject").not().isEmpty(),
    check("category").not().isEmpty(),
    check("question").not().isEmpty(),
  ],
  infoController.changeFile
);

// change values
// get an 29 items array which their total value equals 100%
router.patch(
  "/changePercentages",
  validationController.checkGlobalOrManager,
  [
    check("values")
      .isArray()
      .custom((value) => {
        if (value.length !== 29) {
          throw new Error("there arent 29 fields");
        }
        if (value.reduce((a, b) => a + b, 0) !== 100) {
          throw new Error("the total sum isnt 100%");
        }
        if (value.some((i) => i < 0) || value.some((i) => i > 100)) {
          throw new Error("some of the fields represent an invalid value");
        }
        return true;
      }),
  ],
  infoController.checkIfInfoExist,
  infoController.changePercentages
);

module.exports = router;
