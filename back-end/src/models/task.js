"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      task.belongsTo(models.phase, {
        foreignKey: "phaseId",
      });
      task.hasMany(task, { as: "children", foreignKey: "parentId" });
      task.belongsTo(task, { as: "parent", foreignKey: "parentId" });

      task.belongsTo(models.user, {
        foreignKey: "userId",
      });
    }
  }
  task.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "New",
      },
      priority: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATEONLY,
      },
      endDate: {
        type: DataTypes.DATEONLY,
      },
      estimatedTime: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      realisation: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      passedTime: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      url: {
        type: DataTypes.STRING,
      },
      comment: {
        type: DataTypes.TEXT,
      },
      phaseId: {
        type: DataTypes.INTEGER,
        references: {
          model: "phase",
          key: "id",
        },
        allowNull: false,
      },
      parentId: {
        type: DataTypes.INTEGER,
        references: {
          model: "task",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
      }
    },
    {
      sequelize,
      modelName: "task",
    }
  );
  return task;
};
