'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class rolePermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  rolePermission.init({
    roleId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'role',  
          key: 'id'
      }},
      permissionId: {
        type: DataTypes.INTEGER,
        references: {
          model:'permission',  
          key: 'id'
      }}
  }, {
    sequelize,
    modelName: 'rolePermission',
  });
  return rolePermission;
};