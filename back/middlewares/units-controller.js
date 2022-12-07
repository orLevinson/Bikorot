// library imports

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

// models imports

const HttpError = require("../models/http-error");
const Unit = require("../models/units");
const Brigade = require("../models/brigades");
const Division = require("../models/divisions");
const Command = require("../models/commands");

const getAllUnits = async (req, res, next) => {
  let units;
  try {
    units = await Unit.find();
  } catch (err) {
    const error = new HttpError("unknown error occured", 500);
    return next(error);
  }

  res.json(units);
};

const getAverages = async (req, res, next) => {
  const currentYear = new Date().getFullYear();

  // get the regular and managers' averages of all the reviews from the recent year
  // using agreggation
  // ChatGPT aided me with programming this agreggation pipeline
  let managerMadeScores;
  let reviewerMadeScores;
  try {
    managerMadeScores = await Unit.aggregate([
      // for each unit that has multiple reviews, make many versions. Each version will contain one review
      { $unwind: "$reviews" },
      // "populate" this the reviews field(now only 1 review)
      {
        $lookup: {
          from: "reviews",
          localField: "reviews",
          foreignField: "_id",
          as: "reviewData",
        },
      },
      // just double checking (;
      { $unwind: "$reviews" },
      // check if the date the review was created is from the recent year
      {
        $match: {
          "reviewData.dateCreated": {
            $gte: new Date(currentYear, 0, 1),
            $lt: new Date(currentYear, 11, 31),
          },
        },
      },
      // "populate" the author field in the review object
      {
        $lookup: {
          from: "users",
          localField: "reviewData.author",
          foreignField: "_id",
          as: "userData",
        },
      },
      // check if the user made this review is a manager
      {
        $match: {
          "userData.perms": "manager",
        },
      },
      // group all of the winded units objects by their ids and then enter their names, echelons and get their average score
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          command: { $first: "$command" },
          division: { $first: "$division" },
          brigade: { $first: "$brigade" },
          // for some reason the scores were inside an array, like [33], so in order to get them out
          // of the array i used $first that gets the first item from an array
          scoresAvg: { $avg: { $first: "$reviewData.Score" } },
        },
      },
    ]);

    reviewerMadeScores = await Unit.aggregate([
      // for each unit that has multiple reviews, make many versions. Each version will contain one review
      { $unwind: "$reviews" },
      // "populate" this the reviews field(now only 1 review)
      {
        $lookup: {
          from: "reviews",
          localField: "reviews",
          foreignField: "_id",
          as: "reviewData",
        },
      },
      // just double checking (;
      { $unwind: "$reviews" },
      // check if the date the review was created is from the recent year
      {
        $match: {
          "reviewData.dateCreated": {
            $gte: new Date(currentYear, 0, 1),
            $lt: new Date(currentYear, 11, 31),
          },
        },
      },
      // "populate" the author field in the review object
      {
        $lookup: {
          from: "users",
          localField: "reviewData.author",
          foreignField: "_id",
          as: "userData",
        },
      },
      // check if the user made this review is a manager
      {
        $match: {
          "userData.perms": "reviewer",
        },
      },
      // group all of the winded units objects by their ids and then enter their names, echelons and get their average score
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          command: { $first: "$command" },
          division: { $first: "$division" },
          brigade: { $first: "$brigade" },
          // for some reason the scores were inside an array, like [33], so in order to get them out
          // of the array i used $first that gets the first item from an array
          scoresAvg: { $avg: { $first: "$reviewData.Score" } },
        },
      },
    ]);
  } catch (err) {
    const error = new HttpError("unknown error occured", 500);
    return next(error);
  }

  // get all of the units to assemble the units tree

  let allUnits;

  try {
    allUnits = await Unit.find();
  } catch (err) {
    const error = new HttpError("unknown error occured", 500);
    return next(error);
  }

  const unitsLevelWithAveragesObj = {};

  // units level
  for (const unit of allUnits) {
    // finding the averages from the averages agreggation made arrays
    const managerAvg = managerMadeScores.find((i) => unit._id.equals(i._id));
    const reviewerAvg = reviewerMadeScores.find((i) => unit._id.equals(i._id));
    // creating a better object with more data
    const newUnitObj = {
      unitId: unit._id,
      unitName: unit.name,
      commandId: unit.command,
      divisionId: unit.division,
      brigadeId: unit.brigade,
      managerAvg: !!managerAvg ? managerAvg.scoresAvg : 0,
      reviewerAvg: !!reviewerAvg ? reviewerAvg.scoresAvg : 0,
    };
    // pushing the unit's obj to the units level object with
    // the unit's ID as its key
    unitsLevelWithAveragesObj[newUnitObj.unitId] = newUnitObj;
  }

  // brigades level

  // getting all of the brigades from DB
  let allBrigades;

  try {
    allBrigades = await Brigade.find();
  } catch (err) {
    const error = new HttpError("unknown error occured", 500);
    return next(error);
  }

  // creating the brigade level Obj
  const brigadesLevelWithAveragesObj = {};
  // iterate over the brigades
  for (const brigade of allBrigades) {
    // better brigade Obj that includes the average scores
    const newBrigadeObj = {
      brigadeId: brigade._id,
      brigadeName: brigade.name,
      parentDivision: brigade.parentDivision,
      units: [],
      managerAvg: 0,
      reviewerAvg: 0,
    };
    // iterate over the units inside of the brigade(refs from the units field)
    brigade.units.forEach((unit) => {
      // get the unit from the unit level object
      const unitObjWithAverages = unitsLevelWithAveragesObj[unit._id];
      // only do the following commands if the the unit
      // exists in the unit level object
      if (!!unitObjWithAverages) {
        // sum all of the units manager's and reviewer's average
        // scores inside of the new brigade object
        newBrigadeObj.managerAvg += !!unitObjWithAverages.managerAvg
          ? unitObjWithAverages.managerAvg
          : 0;
        newBrigadeObj.reviewerAvg += !!unitObjWithAverages.reviewerAvg
          ? unitObjWithAverages.reviewerAvg
          : 0;
        // add the unit level's unit obj to the new brigade's units array
        newBrigadeObj.units.push(unitObjWithAverages);
      }
    });
    // do an average of the scores of the units with the following
    // formula : sum of the scores of all the units / num of units = avg score
    newBrigadeObj.managerAvg =
      newBrigadeObj.managerAvg / newBrigadeObj.units.length;
    newBrigadeObj.reviewerAvg =
      newBrigadeObj.reviewerAvg / newBrigadeObj.units.length;
    // add the brigade obj to the brigade level obj with the brigade's ID as a key
    brigadesLevelWithAveragesObj[newBrigadeObj.brigadeId] = newBrigadeObj;
  }

  // divisions level

  // getting all of the brigades from DB
  let allDivisions;

  try {
    allDivisions = await Division.find();
  } catch (err) {
    const error = new HttpError("unknown error occured", 500);
    return next(error);
  }

  // creating the division level Obj
  const divisionLevelWithAveragesObj = {};
  // iterate over the divisions
  for (const division of allDivisions) {
    // better division Obj that includes the average scores
    const newDivisionObj = {
      divisionId: division._id,
      divisionName: division.name,
      parentCommand: division.parentCommand,
      brigades: [],
      directUnits: [],
      managerAvg: 0,
      reviewerAvg: 0,
    };
    // iterate over the brigades inside of the division(refs from the units field)
    division.brigades.forEach((brigade) => {
      // get the brigade from the brigade level object
      const brigadeObjWithAverages = brigadesLevelWithAveragesObj[brigade._id];
      // only do the following commands if the the brigade
      // exists in the unit level object
      if (!!brigadeObjWithAverages) {
        // add the brigade level's brigade obj to the new division's brigades array
        newDivisionObj.brigades.push(brigadeObjWithAverages);
      }
    });
    // do the same with the directUnits field
    division.directUnits.forEach((unit) => {
      const unitObjWithAverages = unitsLevelWithAveragesObj[unit._id];
      if (!!unitObjWithAverages) {
        newDivisionObj.directUnits.push(unitObjWithAverages);
      }
    });

    // we cannot use the same formula as the brigades because
    // divisions have units directly under thier command and
    // they also have brigades under their commands that have units
    // under their command. In order to get an equal footing for all of the
    // units we will filter out from the unit level all of the units
    // that belong to the brigade and calculate the average between them

    let unitTotalNumber = 0;
    // iterate over all of the unit level's objects
    for (const [unitKey, unitValue] of Object.entries(
      unitsLevelWithAveragesObj
    )) {
      // if the unit belongs to the division
      if (!!unitValue.divisionId && division._id.equals(unitValue.divisionId)) {
        // sum up all of the units' averages
        newDivisionObj.managerAvg += unitValue.managerAvg;
        newDivisionObj.reviewerAvg += unitValue.reviewerAvg;
        // count the number of units that belong to the division
        unitTotalNumber++;
      }
    }

    // use the formula : division's average = sum of the averages of the units / number of units
    newDivisionObj.managerAvg = newDivisionObj.managerAvg / unitTotalNumber;
    newDivisionObj.reviewerAvg = newDivisionObj.reviewerAvg / unitTotalNumber;

    divisionLevelWithAveragesObj[newDivisionObj.divisionId] = newDivisionObj;
  }

  // commands level

  // getting all of the commands from DB
  let allCommands;

  try {
    allCommands = await Command.find();
  } catch (err) {
    const error = new HttpError("unknown error occured", 500);
    return next(error);
  }

  // creating the command level Obj
  const commandLevelWithAveragesObj = {};
  // iterate over the commands
  for (const command of allCommands) {
    // better command Obj that includes the average scores
    const newCommandObj = {
      commandId: command._id,
      commandName: command.name,
      divisions: [],
      directUnits: [],
      managerAvg: 0,
      reviewerAvg: 0,
    };

    // the same as the divisions way to include the divisions level objects
    // inside the new command object's division array
    command.divisions.forEach((division) => {
      const divisionObjWithAverages =
        divisionLevelWithAveragesObj[division._id];
      if (!!divisionObjWithAverages) {
        newCommandObj.divisions.push(divisionObjWithAverages);
      }
    });

    // do the same with the directUnits field
    command.directUnits.forEach((unit) => {
      const unitObjWithAverages = unitsLevelWithAveragesObj[unit._id];
      if (!!unitObjWithAverages) {
        newCommandObj.directUnits.push(unitObjWithAverages);
      }
    });

    // calculate the score as the division level calculate it
    let unitTotalNumber = 0;
    // iterate over all of the unit level's objects
    for (const [unitKey, unitValue] of Object.entries(
      unitsLevelWithAveragesObj
    )) {
      // if the unit belongs to the command
      if (!!unitValue.commandId && command._id.equals(unitValue.commandId)) {
        // sum up all of the units' averages
        newCommandObj.managerAvg += unitValue.managerAvg;
        newCommandObj.reviewerAvg += unitValue.reviewerAvg;
        // count the number of units that belong to the command
        unitTotalNumber++;
      }
    }

    // use the formula : command's average = sum of the averages of the units / number of units
    newCommandObj.managerAvg = newCommandObj.managerAvg / unitTotalNumber;
    newCommandObj.reviewerAvg = newCommandObj.reviewerAvg / unitTotalNumber;

    // include the command in the command Object
    commandLevelWithAveragesObj[newCommandObj.commandId] = newCommandObj;
  }

  res.json({ success: true, averageTree: commandLevelWithAveragesObj });
};

exports.getAllUnits = getAllUnits;
exports.getAverages = getAverages;
