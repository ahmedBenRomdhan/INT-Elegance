const db = require("../models");

const dbObj = async (entity, id) => {
  if (entity == "project") {
    try {
      const project = await db.project.findOne({
        where: { id: id },
        include: [
          {
            model: db.user,
            as: "users",
            attributes: [
              "id",
              "firstName",
              "lastName",
              "email",
              "department",
              "position",
              "image",
            ],
            through: {
              attributes: [],
            },
          },
        ],
      });
      const objName = project.name;
      const ids = project.dataValues.users.map((p) => p.id);
      project.dataValues.users = ids;
      return [project, objName];
    } catch (error) {
      throw error;
    }
  }

  if (entity == "task") {
    const task = await db.task.findOne({ where: { id: id } });
    const objName = task.name;
    return [task, objName];
  }
  if (entity == "phase") {
    const phase = await db.phase.findOne({ where: { id: id } });
    const projectId = phase.projectId;
    return phase;
  }
  if (entity == "user") {
    const user = await db.user.findOne({ where: { id: id }, attributes: [
      "id",
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "department",
      "position",
      "image",
      "roleId"
    ], });
    const objName = user.firstName+' '+user.lastName;
    return [user, objName];
  }
};

function getChangedPairs(attributes, dataValues) {
  const result = {};
  attributes.forEach((attr) => {
    result[attr] = dataValues[attr];
  });
  return result;
}

function removeElementsByIndexes(arr1, arr2, arr3, indexes) {
  indexes.sort((a, b) => b - a); // Sort the indexes in descending order

  indexes.forEach((index) => {
    arr1.splice(index, 1);
    arr2.splice(index, 1);
    arr3.splice(index, 1);
  });
}

function findRedundantElementsIndex(oldValues, newValues) {
  const indexes = [];
  const valIndexes = [];

  oldValues.forEach((el, index) => {
    if (Array.isArray(el)) {
      if (el.length === newValues[index].length) {
        el.forEach((e, secondIndex) => {
          newValues[index].forEach((n, thirdIndex) => {
            if (e === n) {
              valIndexes.push(secondIndex);
            }
          });
        });
        if (valIndexes.length === el.length) {
          indexes.push(index);
        }
      }
    }
    if (String(el) === String(newValues[index])) {indexes.push(index);}
  });
  return indexes;
}

function findRedundantElementsIndexes(oldValues, newValues) {
  const indexes = [];
  oldValues.forEach((el, index) => {
    if (String(el) === String(newValues[index])) {
      indexes.push(index);
    }
  });
  return indexes;
}

function formatAttributeDate(dateValue) {
  const date = new Date(dateValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

module.exports = {
  dbObj,
  getChangedPairs,
  removeElementsByIndexes,
  findRedundantElementsIndex,
  findRedundantElementsIndexes,
  formatAttributeDate,
};
