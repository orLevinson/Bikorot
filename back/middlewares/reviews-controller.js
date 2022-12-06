// library imports

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

// models imports

const HttpError = require("../models/http-error");
const Review = require("../models/reviews");
const Unit = require("../models/units");
const User = require("../models/users");
const Info = require("../models/info");

// custom score range finder

const scoreRangeFinder = require("../templates/scoreRangeFinder");

const getReviewsByFilters = async (req, res, next) => {
  const { date, unit } = req.body;
  const dateObj = new Date(date);

  let reviews = [];
  if (!date && !unit) {
    try {
      reviews = await Review.find().sort({ _id: -1 }).limit(10);
    } catch (err) {
      const error = new HttpError("unknown error occured", 500);
      return next(error);
    }

    res.json({ success: true, reviews });
  }

  if (unit) {
    let units;
    try {
      units = await Unit.find({ name: { $regex: unit } }).populate("reviews");
    } catch (err) {
      const error = new HttpError("unknown error occured", 500);
      return next(error);
    }

    units.forEach((i) => {
      const reviewObjects = i.reviews.map((r) => r.toObject({ getters: true }));
      reviews = [...reviews, ...reviewObjects];
    });
  }

  if (date && !unit) {
    try {
      reviews = await Review.aggregate([
        {
          $match: {
            dateCreated: {
              $gte: dateObj,
            },
          },
        },
      ]);
    } catch (err) {
      const error = new HttpError("unknown error occured", 500);
      return next(error);
    }
  }

  if (date && unit) {
    reviews = reviews.filter((i) => {
      const newDate = new Date(i.dateCreated);
      if (newDate.getTime() >= dateObj.getTime()) {
        return true;
      }
      return false;
    });
  }

  res.json({ success: true, reviews });
};

const getReviewsByAuthor = async (req, res, next) => {
  const authorId = req.params.aid;

  if (!authorId || !mongoose.Types.ObjectId.isValid(authorId)) {
    const error = new HttpError("invalid author entered", 500);
    return next(error);
  }

  let reviews = [];
  try {
    reviews = await Review.find({ author: authorId });
  } catch (err) {
    const error = new HttpError("unknown error occured", 500);
    return next(error);
  }

  res.json({ success: true, reviews });
};

// check if user allowed to create a new review
// and if there are any validation errors
const checkUserAuthNew = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const reviewInfo = req.body;
  let user;
  try {
    user = await User.findById(reviewInfo.author);
  } catch (err) {
    const error = new HttpError("unknown error occured", 500);
    return next(error);
  }

  if (!user || !user.perms) {
    const error = new HttpError("You aren't authorized to add a review", 401);
    return next(error);
  }

  next();
};

const addReview = async (req, res, next) => {
  const reviewInfo = req.body;

  // check if the unit and the echelons above are correct
  let unit;
  try {
    unit = await Unit.findOne({
      _id: reviewInfo.unit,
      command: reviewInfo.command,
      division: reviewInfo.division,
      brigade: reviewInfo.brigade,
    });
  } catch (err) {
    const error = new HttpError("unknown error occured", 500);
    return next(error);
  }

  if (!unit) {
    const error = new HttpError("no such unit was found", 500);
    return next(error);
  }

  const dateCreated = new Date();

  // nicer obj to work with
  const scores = reviewInfo.scores;

  const newScoreObj = {};

  const subjectScoreObj = {};

  const cleanedSubjectScoreObj = {};

  let totalScore = 0;

  let categoryObj = {};
  try {
    categoryObj = await Info.findOne();
  } catch (err) {
    const error = new HttpError("unknown error occured", 500);
    return next(error);
  }

  categoryObj = categoryObj.toObject({ getters: true });

  // in case someone gave the api a weird input
  try {
    // making an object of the average scores of each category
    // iterating through the scores keys
    for (const [subjectKey, subjectValue] of Object.entries(
      typeof scores === "object" ? scores : {}
    )) {
      // duplicate the subject key into the new object
      newScoreObj[subjectKey] = {};
      // when a category score equals 0 its precentage shifts
      // to the other precentages and get sliced equally
      const newPercentage = categoryObj[subjectKey];
      // iterate each category key in each subject
      for (const [categoryKey, categoryValue] of Object.entries(
        typeof subjectValue === "object" ? subjectValue : {}
      )) {
        // iterate over each value in scores array of each category
        // and check if the value is valid while making an average
        // of the category score
        let sum = 0;
        let numOfCategories = 0;
        // check if the categories value is an array before iterating it
        if (!Array.isArray(categoryValue)) {
          const error = new HttpError("invalid score entered", 422);
          return next(error);
        }
        categoryValue.forEach((i) => {
          // checking if the value valid
          if (i.score === undefined || i.score > 100 || i.score < 0) {
            const error = new HttpError("invalid score entered", 422);
            return next(error);
          }
          // adding to the total sum
          sum += parseInt(i.score);

          if (i.score > 0) {
            numOfCategories++;
          }
        });

        // dividing the total sum of the category scores by
        // the number of positive integer score values to get the average
        // of the scores that aren't 0(none relevant scores)
        if (numOfCategories !== 0) {
          sum = sum / numOfCategories;
        }

        newScoreObj[subjectKey][categoryKey] = sum;

        // if the sum of the category is 0 then split the score evenly with the other
        // categories in the same subject
        if (sum === 0) {
          // save the percentage of the unrelevant category from the precentages object
          // then delete the unrelevant category from that same obj
          const unrelevantCategoryValue = !!newPercentage[categoryKey]
            ? newPercentage[categoryKey].percentage
            : 0;

          delete categoryObj[subjectKey][categoryKey];

          // if the whole subject is unrelevant - if this is triggered
          // - the last key in the subject that left(all of the rest are not relevant) is also
          // unrelevant - split the score with the rest of the subjects evenly
          // only subject 3 is a special case - it is part of subject 2 and it will split its value evenly with subject 2
          // before it split its value with the rest of the subjects
          if (Object.keys(newPercentage).length === 0) {
            delete categoryObj[subjectKey];
            // if the whole subject 3 is unrelevant and subject 2 is still relevant transfer the precentage of
            // subject 3 to 2
            if (subjectKey === "subject3" && !!categoryObj["subject2"]) {
              // i need to make the same for subject 2 to 3(if 2 is empty)
              // delete subject 3
              delete categoryObj["subject3"];
              // get the score out of the unrelevant category score and divide it by the keys left in subject 2 category list
              const scoreForEachCat =
                unrelevantCategoryValue /
                Object.keys(categoryObj["subject2"]).length;

              // add to the categories of subject 2 the values
              for (const [subject2CatKey, subject2CatValue] of Object.entries(
                categoryObj["subject2"]
              )) {
                subject2CatValue.percentage += scoreForEachCat;
              }
            } else if (subjectKey === "subject2") {
              // delete subject 2
              delete categoryObj["subject2"];
              // get the score out of the unrelevant category score and divide it by the keys left in subject 2 category list
              const scoreForEachCat =
                unrelevantCategoryValue /
                Object.keys(categoryObj["subject3"]).length;

              // add to the categories of subject 2 the values
              for (const [subject3CatKey, subject3CatValue] of Object.entries(
                categoryObj["subject3"]
              )) {
                subject3CatValue.percentage += scoreForEachCat;
              }
            } else {
              //count the existing categories
              let numOfCategories = 0;
              for (const [subjectPerKey, subjectPerValue] of Object.entries(
                categoryObj
              )) {
                // not include keys in the categoryObj such as _id and such
                if (subjectPerKey.includes("subject")) {
                  numOfCategories += Object.keys(subjectPerValue).length;
                }
              }

              // get the splitted value for each category left
              const evenlySplitValue =
                unrelevantCategoryValue / numOfCategories;

              // iterate over each category and add the splitted value to each key
              for (const [subjectPerKey, subjectPerValue] of Object.entries(
                categoryObj
              )) {
                for (const [categoryPerKey, categoryPerValue] of Object.entries(
                  subjectPerValue
                )) {
                  categoryObj[subjectPerKey][categoryPerKey].percentage +=
                    evenlySplitValue;
                }
              }
            }
          }

          // splitting the score between the different categories that left evenly
          for (const [catPerKey, catPerValue] of Object.entries(
            newPercentage
          )) {
            newPercentage[catPerKey].percentage +=
              unrelevantCategoryValue / Object.keys(newPercentage).length;
          }
        }
      }
    }

    for (const [subjectKey, subjectValue] of Object.entries(
      typeof categoryObj === "object" ? categoryObj : {}
    )) {
      if (subjectKey.includes("subject")) {
        subjectScoreObj[subjectKey] = 0;
        let totalSubjectPercentage = 0;
        let totalSubjectScore = 0;
        for (const [categoryKey, categoryValue] of Object.entries(
          typeof subjectValue === "object" ? subjectValue : {}
        )) {
          totalSubjectPercentage += categoryValue.percentage;
          const newVal =
            (categoryValue.percentage *
              // just validate that newScoreObj[subjectKey][categoryKey] exists and if not just substitute with 0
              (!!newScoreObj[subjectKey][categoryKey]
                ? newScoreObj[subjectKey][categoryKey]
                : 0)) /
            100;
          totalScore += newVal;
          totalSubjectScore += newVal;
        }
        subjectScoreObj[subjectKey] = {
          score: (totalSubjectScore / totalSubjectPercentage) * 100,
          percentage: totalSubjectPercentage,
        };
      }
    }

    // in case subject 1 is unrelevant just change its score to 0
    cleanedSubjectScoreObj["subject1"] = !!subjectScoreObj["subject1"]
      ? scoreRangeFinder(subjectScoreObj["subject1"].score)
      : 0;
    // join subject 2 and 3 as well as validate they are relevant
    cleanedSubjectScoreObj["subject2"] =
      // if both of the subjects are relevant
      !!subjectScoreObj["subject2"] && !!subjectScoreObj["subject3"]
        ? // (score1 * per1 / (per1 + per2) + score2 * per2 / (per1 + per2))
          scoreRangeFinder(
            (subjectScoreObj["subject2"].score /
              (subjectScoreObj["subject2"].percentage +
                subjectScoreObj["subject3"].percentage)) *
              subjectScoreObj["subject2"].percentage +
              (subjectScoreObj["subject3"].score /
                (subjectScoreObj["subject2"].percentage +
                  subjectScoreObj["subject3"].percentage)) *
                subjectScoreObj["subject3"].percentage
          )
        : // if only 1 of them is relevant
        !!subjectScoreObj["subject2"] && !!subjectScoreObj["subject3"]
        ? // if subject 2 exists so choose its score as the total subject score and vice versa with 3
          !!subjectScoreObj["subject2"]
          ? scoreRangeFinder(subjectScoreObj["subject2"].score)
          : scoreRangeFinder(subjectScoreObj["subject3"].score)
        : // if none of them are relevant
          0;

    // the same as subject 1 for the rest of the scores
    cleanedSubjectScoreObj["subject3"] = !!subjectScoreObj["subject4"]
      ? scoreRangeFinder(subjectScoreObj["subject4"].score)
      : 0;

    cleanedSubjectScoreObj["subject4"] = !!subjectScoreObj["subject5"]
      ? scoreRangeFinder(subjectScoreObj["subject5"].score)
      : 0;

    cleanedSubjectScoreObj["subject5"] = !!subjectScoreObj["subject6"]
      ? scoreRangeFinder(subjectScoreObj["subject6"].score)
      : 0;
  } catch (err) {
    const error = new HttpError("unknown error occured", 500);
    return next(error);
  }

  // now we have the total score and the scores of each
  // subject calculated, time to make a review Object

  const newReview = new Review({
    dateCreated,
    author: reviewInfo.author,
    unit: unit._id,
    command: unit.command,
    division: unit.division,
    brigade: unit.brigade,
    scores: reviewInfo.scores,
    Summary: {
      subject1: {
        text: !!reviewInfo.Summary
          ? !!reviewInfo.Summary["subject1"]
            ? !!reviewInfo.Summary["subject1"].text
              ? reviewInfo.Summary["subject1"].text
              : "לא צוין"
            : "לא צוין"
          : "לא צוין",
        score: cleanedSubjectScoreObj["subject1"],
      },
      subject2: {
        text: !!reviewInfo.Summary
          ? !!reviewInfo.Summary["subject2"]
            ? !!reviewInfo.Summary["subject2"].text
              ? reviewInfo.Summary["subject2"].text
              : "לא צוין"
            : "לא צוין"
          : "לא צוין",
        score: cleanedSubjectScoreObj["subject2"],
      },
      subject3: {
        text: !!reviewInfo.Summary
          ? !!reviewInfo.Summary["subject3"]
            ? !!reviewInfo.Summary["subject3"].text
              ? reviewInfo.Summary["subject3"].text
              : "לא צוין"
            : "לא צוין"
          : "לא צוין",
        score: cleanedSubjectScoreObj["subject3"],
      },
      subject4: {
        text: !!reviewInfo.Summary
          ? !!reviewInfo.Summary["subject4"]
            ? !!reviewInfo.Summary["subject4"].text
              ? reviewInfo.Summary["subject4"].text
              : "לא צוין"
            : "לא צוין"
          : "לא צוין",
        score: cleanedSubjectScoreObj["subject4"],
      },
      subject5: {
        text: !!reviewInfo.Summary
          ? !!reviewInfo.Summary["subject5"]
            ? !!reviewInfo.Summary["subject5"].text
              ? reviewInfo.Summary["subject5"].text
              : "לא צוין"
            : "לא צוין"
          : "לא צוין",
        score: cleanedSubjectScoreObj["subject5"],
      },
    },
    Score: totalScore,
  });

  try {
    unit.reviews.push(newReview._id);
    const sess = await mongoose.startSession(); // start a session
    sess.startTransaction();
    await Promise.all([
      newReview.save({ session: sess }),
      unit.save({ session: sess }),
    ]);
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  res.json({ success: true, review: newReview });
};

// check if user allowed to delete or edit a review
// and if there are any validation errors
const checkUserAuthEdit = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const reviewId = req.params.rid;

  let review;
  try {
    review = await Review.findById(reviewId);
  } catch (err) {
    const error = new HttpError("unknown error occured", 500);
    return next(error);
  }

  const { user: userId } = req.body;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError("unknown error occured", 500);
    return next(error);
  }

  // if its not the user's review or if the user isn't
  // manager or global manager then trigger a warning
  if (
    !review ||
    !user ||
    (!review.author.equals(user._id) &&
      (user.perms !== "global" || user.perms !== "manager"))
  ) {
    const error = new HttpError(
      "You aren't authorized to make changed to that review",
      401
    );
    return next(error);
  }

  next();
};

const deleteReview = async (req, res, next) => {
  const reviewId = req.params.rid;

  try {
    await Review.findByIdAndDelete(reviewId);
  } catch (err) {
    const error = new HttpError("unknown error occured", 500);
    return next(error);
  }

  res.json({ success: true, message: "the review has been deleted" });
};

exports.getReviewsByFilters = getReviewsByFilters;
exports.getReviewsByAuthor = getReviewsByAuthor;
exports.addReview = addReview;
exports.checkUserAuthNew = checkUserAuthNew;
exports.deleteReview = deleteReview;
exports.checkUserAuthEdit = checkUserAuthEdit;
// exports.getAllPercentages = getAllPercentages;
// exports.changeFile = changeFile;
// exports.changePercentages = changePercentages;
