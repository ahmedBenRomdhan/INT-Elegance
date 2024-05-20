const db = require("../models");
const userModel = db.user;
const trailModel = db.trailUser;
const roleModel = db.role;

const {
  findRedundantElementsIndexes,
  dbObj,
  removeElementsByIndexes,
  getChangedPairs,
} = require("../helpers/util");

const userTrail = async (req, res, next) => {
  try {
    const attributes = Object.keys(req.body);
    const newValues = Object.values(req.body);
    if (req.method === "PUT") {
      const id = req.params.id;
      const entite = await dbObj("user", id);
      const mappedOldValues = getChangedPairs(attributes, entite[0].dataValues);
      const oldValues = Object.values(mappedOldValues);
      const indexes = findRedundantElementsIndexes(oldValues, newValues);
      removeElementsByIndexes(oldValues, newValues, attributes, indexes);
      const binaryAttributes = Buffer.from(JSON.stringify(attributes)).toString(
        "binary"
      );
      indexOfRole = attributes.indexOf("roleId");
      if (indexOfRole !== -1) {
        if (newValues[indexOfRole]) {
          let newRole = await roleModel.findOne({
            where: { id: newValues[indexOfRole] },
          });
          newRole = newRole.name;
          newValues[indexOfRole] = newRole;
        }
        if (oldValues[indexOfRole]) {
          let oldRole = await roleModel.findOne({
            where: { id: oldValues[indexOfRole] },
          });
          oldRole = oldRole.name;
          oldValues[indexOfRole] = oldRole;
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
        entityName:entite[1],
        newValues: binaryNewValues,
        oldValues: oldValuesBinary,
      };

      if (oldValues.length > 0) {
        await trailModel.create(trail);
      }
      next();
    } else if (req.method === "POST") {
      let indexOfUniqueValue = -1;

      if (attributes.includes("email"))
        indexOfUniqueValue = attributes.indexOf("email");

      const user = await userModel.findOne({
        where: { email: newValues[indexOfUniqueValue] },
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
        entityId: user.id,
        entityName: user.firstName + " " + user.lastName,
        newValues: binaryNewValues,
      };
      await trailModel.create(trail);
    } else if (req.method === "DELETE") {
      const id = req.params.id;
      const user = await userModel.findByPk(id,{
        paranoid:false
      });
      const trail = {
        eventType: req.method,
        userId: req.user.id,
        entityId: id,
        entityName: user.firstName + " " + user.lastName,
      };
      await trailModel.create(trail);
    }
    else if (req.method === "GET") {
      const id = req.params.id;
      const user = await userModel.findByPk(id);
      const trail = {
        eventType: req.method,
        userId: req.user.id,
        entityId: id,
        entityName: user.firstName + " " + user.lastName,
      };
      await trailModel.create(trail);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = userTrail;
