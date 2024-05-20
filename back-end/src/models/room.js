"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      room.hasMany(models.meeting)
    }
  }
  room.init(
    {
      name: { 
        type: DataTypes.STRING,
        allowNull: false,
      },
      availability: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "room",
    }
  );
  return room;
};
