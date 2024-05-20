const db = require("../models");
const userModel = db.user;
const trailModel = db.trailProject;
const projectModel = db.project;
const {
  findRedundantElementsIndex,
  dbObj,
  removeElementsByIndexes,
  getChangedPairs,
  formatAttributeDate,
} = require("../helpers/util");

const projectTrail = async (req, res, next) => {
  try {
    const attributes = Object.keys(req.body);
    const newValues = Object.values(req.body);

    if (req.method === "PUT") {
      const id = req.params.id;
      const entite = await dbObj("project", id);

      const mappedOldValues = getChangedPairs(attributes, entite[0].dataValues);
      const oldValues = Object.values(mappedOldValues);
      const indexes = findRedundantElementsIndex(oldValues, newValues);
      removeElementsByIndexes(oldValues, newValues, attributes, indexes);
      const binaryAttributes = Buffer.from(JSON.stringify(attributes)).toString(
        "binary"
      );

      indexOfUsers = attributes.indexOf("users");
      if (indexOfUsers !== -1) {
        newValues[indexOfUsers] = await Promise.all(
          newValues[indexOfUsers].map(async (el) => {
            let user = await userModel.findOne({
              where: { id: el },
              paranoid: false,
            });
            user = user.firstName + " " + user.lastName;
            return user;
          })
        );

        oldValues[indexOfUsers] = await Promise.all(
          oldValues[indexOfUsers].map(async (el) => {
            let user = await userModel.findOne({
              where: { id: el },
            });
            user = user.firstName + " " + user.lastName;
            return user;
          })
        );
      }

      indexOfStartDate = attributes.indexOf("startDate");
      if (indexOfStartDate !== -1) {
        if (newValues[indexOfStartDate]) {
          newValues[indexOfStartDate] = formatAttributeDate(
            newValues[indexOfStartDate]
          );
        }
      }

      indexOfEndDate = attributes.indexOf("endDate");
      if (indexOfEndDate !== -1) {
        if (newValues[indexOfEndDate]) {
          newValues[indexOfEndDate] = formatAttributeDate(
            newValues[indexOfEndDate]
          );
        }
      }

      const binaryNewValues = Buffer.from(JSON.stringify(newValues)).toString(
        "binary"
      );
      const oldValuesBinary = Buffer.from(JSON.stringify(oldValues)).toString(
        "binary"
      );
      const trail = {
        eventType: req.method,
        userId: req.user.id,
        attributes: binaryAttributes,
        entityId: id,
        newValues: binaryNewValues,
        oldValues: oldValuesBinary,
      };

      if (attributes.length > 0) {
        await trailModel.create(trail);
      }
      next();
    } else if (req.method === "POST") {
      let indexOfUniqueValue = -1;

      if (attributes.includes("name"))
        indexOfUniqueValue = attributes.indexOf("name");

      const project = await projectModel.findOne({
        where: { name: newValues[indexOfUniqueValue] },
      });

      const binaryAttributes = Buffer.from(JSON.stringify(attributes)).toString(
        "binary"
      );
      const binaryNewValues = Buffer.from(JSON.stringify(newValues)).toString(
        "binary"
      );
      const trail = {
        eventType: req.method,
        userId: req.user.id,
        attributes: binaryAttributes,
        entityId: project.id,
        newValues: binaryNewValues,
      };
      await trailModel.create(trail);
    } else if (req.method === "DELETE") {
      const id = req.params.id;
      const trail = {
        eventType: req.method,
        userId: req.user.id,
        entityId: id,
      };
      await trailModel.create(trail);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = projectTrail;
