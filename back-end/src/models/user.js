'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.belongsTo(models.role,{
        foreignKey: "roleId"
      });

      user.belongsToMany(models.project, {
        through: 'userproject'
      })

      user.hasMany(models.trailProject)
      user.hasMany(models.trailTask)
      user.hasMany(models.trailUser)
      user.hasMany(models.trailPhase)
      user.hasMany(models.task);     

      user.hasMany(models.usermeeting, { foreignKey: "userId" });
      user.belongsToMany(models.meeting, { through: models.usermeeting, foreignKey: "userId" , as: "users"});

      // user.hasMany(models.meeting);
      /*user.belongsToMany(models.meeting, {
        through: 'usermeeting'
      })*/
    }
  }
  user.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      defaultValue:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'role',
        key: 'id'
      }
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    paranoid: true,
    modelName: 'user',
  });
  return user;
};