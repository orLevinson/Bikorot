const Command = require("../models/commands");
const Division = require("../models/divisions");
const Brigade = require("../models/brigades");
const Unit = require("../models/units");

const mongoose = require("mongoose");

const HttpError = require("../models/http-error");

const addUnits = async (req, res, next) => {
  for (let i = 0; i < 3; i++) {
    const newPikud = new Command({
      name: "Command " + i,
      divisions: [],
      directUnits: [],
    });

    if (i === 0) {
      const newUnit = new Unit({
        name: "Command " + i + " Unit " + 0,
        reviews: [],
        command: newPikud._id,
      });

      newPikud.directUnits.push(newUnit._id);

      try {
        await newUnit.save();
      } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
      }
    }

    try {
      await newPikud.save();
    } catch (err) {
      const error = new HttpError(err, 500);
      return next(error);
    }

    for (let j = 0; j < 3; j++) {
      const newOgda = new Division({
        name: "Command " + i + " Division " + j,
        brigades: [],
        parentCommand: newPikud._id,
        directUnits: [],
      });

      if (j === 0) {
        const newUnit = new Unit({
          name: "Command " + i + " Division " + j + " Unit " + 0,
          reviews: [],
          command: newPikud._id,
          division: newOgda._id,
        });

        newOgda.directUnits.push(newUnit._id);

        try {
          await newUnit.save();
        } catch (err) {
          const error = new HttpError(err, 500);
          return next(error);
        }
      }

      newPikud.divisions.push(newOgda._id);

      try {
        await newOgda.save();
        await newPikud.save();
      } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
      }

      for (let k = 0; k < 3; k++) {
        const newHativa = new Brigade({
          name: "Command " + i + " Division " + j + " Brigade " + k,
          units: [],
          parentDivision: newOgda._id,
        });

        newOgda.brigades.push(newHativa._id);

        try {
          await newOgda.save();
          await newHativa.save();
        } catch (err) {
          const error = new HttpError(err, 500);
          return next(error);
        }
        for (let n = 0; n < 3; n++) {
          const newUnit = new Unit({
            name:
              "Command " +
              i +
              " Division " +
              j +
              " Brigade " +
              k +
              " Unit " +
              n,
            reviews: [],
            command: newPikud._id,
            division: newOgda._id,
            brigade: newHativa._id,
          });

          newHativa.units.push(newUnit._id);

          try {
            await newUnit.save();
            await newHativa.save();
          } catch (err) {
            const error = new HttpError(err, 500);
            return next(error);
          }
        }
      }
    }
  }

  res.json({ message: "success!" });
};

exports.addUnits = addUnits;