const express = require("express");
const { check } = require("express-validator");
const fileUpload = require("../middlewares/file-upload");
// const checkAuth = require("../middlewares/check-auth");

const reviewsController = require("../middlewares/reviews-controller");
// if there is no info Obj while creating a new review ->
const infoController = require("../middlewares/info-controller");

const router = express.Router();

// get reviews by date and unit (if all fields left empty - show 10 most recent reviews) - check
// get reviews by author - check
// create new review - check
// delete a review - by the author or anyone equal or above manager - check
// edit a review - by the author or anyone equal or above manager - checkS
// get scores - a tree of units with 2 kinds of scores - reviewers' score and managers' score

// getting reviews by filters

router.get("/", reviewsController.getReviewsByFilters);
// input looks like this
// {
//     date : dateObj,
//     unit : String,
// }

router.get("/:aid", reviewsController.getReviewsByAuthor);

// only admins & global perms allowed to preform the following tasks

// add a new review
router.post(
  "/newReview",
  [
    check("author").not().isEmpty(),
    check("unit").not().isEmpty(),
    check("command").not().isEmpty(),
  ],
  reviewsController.checkUserAuthNew,
  // need to be changed to use the token instead of body
  infoController.checkIfInfoExist,
  reviewsController.addReview
);
// input looks like this
// {
// author : id,
// unit : id,
// command : id,
// division : id/null,
// bridage : id/null,
// scores : obj
// Summary : as shown in the example
// }

// edit a review
// can only be preformed by a manager/global or
// the author of the review.
// the input is identical to the input of the
// new review except you can not change the

router.patch(
  "/:rid",
  [
    check("user").not().isEmpty(),
    check("unit").not().isEmpty(),
    check("command").not().isEmpty(),
  ],
  reviewsController.checkUserAuthEdit,
  reviewsController.editReview
);

// input looks like this
// {
// user : id,
// unit : id,
// command : id,
// division : id/null,
// bridage : id/null,
// scores : obj
// Summary : as shown in the example
// }

// delete a review
// can be preformed only by a manager/global or the
// author of the review

router.delete(
  "/:rid",
  [check("user").not().isEmpty()],
  reviewsController.checkUserAuthEdit,
  reviewsController.deleteReview
);

module.exports = router;
