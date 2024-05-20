const db = require("../models");
const trailPhaseModel = db.trailPhase;
const {
  findRedundantElementsIndex,
  dbObj,
  removeElementsByIndexes,
  getChangedPairs,
  formatAttributeDate,
} = require("../helpers/util");

const phaseTrail = async (req, res, next) => {
  try {
    const attributes = Object.keys(req.body);
    const newValues = Object.values(req.body);

    if (req.method === "PUT") {

      const id = req.params.id;
      const entite = await dbObj("phase", id);
      const mappedOldValues = getChangedPairs(attributes, entite.dataValues);
      const oldValues = Object.values(mappedOldValues);
      const indexes = findRedundantElementsIndex(oldValues, newValues);
  
      removeElementsByIndexes(oldValues, newValues, attributes, indexes);

      const binaryAttributes = Buffer.from(JSON.stringify(attributes)).toString(
        "binary"
      );
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
        entityId:entite.dataValues.projectId,
        entityName:entite.dataValues.title,
        newValues: binaryNewValues,
        oldValues: oldValuesBinary,
      };

      if (attributes.length > 0) {
        await trailPhaseModel.create(trail);
      }
     // next();
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
        entityId:  req.projectId,
        entityName: req.entityName,
        newValues: binaryNewValues,
      };
 
      await trailPhaseModel.create(trail);
    } else if (req.method === "DELETE") {
      const trail = {
        eventType: req.method,
        userId: req.user.id,
        entityId: req.projectId,
        entityName: req.entityName
      };
      await trailPhaseModel.create(trail);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = phaseTrail;
