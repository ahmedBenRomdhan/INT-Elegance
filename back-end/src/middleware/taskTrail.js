const db = require("../models");
const phaseModel = db.phase;
const userModel = db.user;
const trailTaskModel = db.trailTask;

const {
  findRedundantElementsIndexes,
  dbObj,
  removeElementsByIndexes,
  getChangedPairs,
  formatAttributeDate,
} = require("../helpers/util");

const taskTrail = async (req, res, next) => {
  try {
    const attributes = Object.keys(req.body);
    const newValues = Object.values(req.body);
    if (req.method === "PUT") {
      const id = req.params.id;
      const entite = await dbObj("task", id);
      const mappedOldValues = getChangedPairs(attributes, entite[0].dataValues);
      const oldValues = Object.values(mappedOldValues);
      const indexes = findRedundantElementsIndexes(oldValues, newValues);
      removeElementsByIndexes(oldValues, newValues, attributes, indexes);
      const binaryAttributes = Buffer.from(JSON.stringify(attributes)).toString(
        "binary"
      );
      indexOfUser = attributes.indexOf("userId");
      if (indexOfUser !== -1) {
        if (newValues[indexOfUser]) {
          let newUser = await userModel.findOne({
            paranoid: false,
            where: { id: newValues[indexOfUser] },
          });
          newUser = newUser.firstName + " " + newUser.lastName;
          newValues[indexOfUser] = newUser;
        }
        if (oldValues[indexOfUser]) {
          let oldUser = await userModel.findOne({
            where: { id: oldValues[indexOfUser] },
          });
          oldUser = oldUser.firstName + " " + oldUser.lastName;
          oldValues[indexOfUser] = oldUser;
        }
      }

      indexOfPhase = attributes.indexOf("phaseId");
      if (indexOfPhase !== -1) {
        let newPhase = await phaseModel.findOne({
          where: { id: newValues[indexOfPhase] },
        });
        newPhase = newPhase.title;
        newValues[indexOfPhase] = newPhase;

        let oldPhase = await phaseModel.findOne({
          where: { id: oldValues[indexOfPhase] },
        });
        oldPhase = oldPhase.title;
        oldValues[indexOfPhase] = oldPhase;
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
        entityName: id,
        newValues: binaryNewValues,
        oldValues: oldValuesBinary,
      };
      if (attributes.length > 0) {
        await trailTaskModel.create(trail);
      }
      next();
    } else if (req.method === "POST") {
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
        entityId: req.taskId,
        newValues: binaryNewValues,
        entityName: "ticket " + req.entityName,
      };
      await trailTaskModel.create(trail);
    } else if (req.method === "DELETE") {
      const trail = {
        eventType: req.method,
        userId: req.user.id,
        entityId: req.projectId,
        entityName: "ticket " + req.entityName,
      };
      await trailTaskModel.create(trail);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = taskTrail;
