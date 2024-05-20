'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usermeeting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    
    static associate(models) {
      // define association here
      usermeeting.belongsTo(models.user, {
        foreignKey: 'userId'
      });
      usermeeting.belongsTo(models.meeting, {
        foreignKey: 'meetingId'
      });
    }
  }
  usermeeting.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',  
        key: 'id'
    },
  },
    meetingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model:'meetings',  
        key: 'id'
    },
  },
  }, {
    sequelize,
    modelName: 'usermeeting',
  });
  return usermeeting;
};