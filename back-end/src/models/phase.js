"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class phase extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      phase.belongsTo(models.project, {
        foreignKey: "projectId",
      });
      phase.hasMany(models.task, { onDelete: "cascade" });
    }
  }
  phase.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      startDate: {
        type: DataTypes.DATEONLY,
      },
      endDate: {
        type: DataTypes.DATEONLY,
      },
      status: {
        type: DataTypes.STRING,
      },
      projectId: {
        type: DataTypes.INTEGER,
        references: {
          model: "project",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "phase",
    }
  );
  return phase;
};
