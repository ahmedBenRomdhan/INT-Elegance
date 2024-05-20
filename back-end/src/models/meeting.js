"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class meeting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      /*    meeting.belongsTo(models.user, {
        foreignKey: "createdBy", as: "createdBy" 
      });
      meeting.belongsToMany(models.user, {
        through: "usermeetings",
        foreignKey: "meetingId",
      });*/
      meeting.belongsToMany(models.user, {
        through: models.usermeeting,
        foreignKey: "meetingId",
        as: "users",
      });
      meeting.hasMany(models.usermeeting, { foreignKey: "meetingId" });
      meeting.belongsTo(models.room, {
        foreignKey: "roomId",
      });
    }
  }
  meeting.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      roomId: {
        type: DataTypes.INTEGER,
        references: {
          model: "rooms",
          key: "id",
        },
        allowNull: false,
      },
      start: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      end: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      createdBy: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "meeting",
    }
  );
  return meeting;
};
