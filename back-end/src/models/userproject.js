'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userproject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      userproject.belongsTo(models.user, {
        foreignKey: 'userId'
      });
      userproject.belongsTo(models.project, {
        foreignKey: 'projectId'
      });
      userproject.belongsToMany(models.task, {
        through: 'usertask'
      })
    }
  }
  userproject.init({
    userId: { 
      type: DataTypes.INTEGER,
      references: {
        model: 'user',  
        key: 'id'
    }},
    projectId: {
      type: DataTypes.INTEGER,
      references: {
        model:'project',  
        key: 'id'
    }}
  }, {
    sequelize,
    modelName: 'userproject',
  });
  return userproject;
};