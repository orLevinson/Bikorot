const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const Review = require("../models/reviews");
const Unit = require("../models/units");

const addReviewsToUnitsWithOnlyDates = async (req, res, next) => {
    let units = await Unit.find().sort({ _id: -1 }).limit(10);
    for (let i = 0; i < 10; i++) {
      const myDate = new Date();
      const newDate = new Date(
        myDate.getTime() + 60 * 60 * 24 * 7 * 1000 * (i + 10)
      );
      const newReview = new Review({
        dateCreated: newDate,
        unit: units[i]._id,
      });
  
      try {
        const targetUnit = await Unit.findById(units[i]._id);
        targetUnit.reviews.push(newReview._id);
        await newReview.save();
        await targetUnit.save();
      } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
      }
    }
    res.json({ message: "success" });
  };

  exports.addReviewsToUnitsWithOnlyDates = addReviewsToUnitsWithOnlyDates;