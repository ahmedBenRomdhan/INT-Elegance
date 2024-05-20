'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      project.belongsToMany(models.user,{
        through:'userproject'
      })

      project.hasMany(models.phase, {onDelete: "CASCADE"})
      
    }
  }
  project.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    type:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate:{
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate:{
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status:{
      type: DataTypes.STRING,
      defaultValue:"New",
    },
  }, {
    sequelize,
    modelName: 'project',
  });
  return project;
};