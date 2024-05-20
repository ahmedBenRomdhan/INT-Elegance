'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userconversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      userconversation.belongsTo(models.user, { foreignKey: 'userId' });
      userconversation.belongsTo(models.conversation, { foreignKey: 'conversationId' });
    }
  }
  userconversation.init({
    userId:{
      type: DataTypes.INTEGER,
      references: {
      model: 'user',  
      key: 'id'
  }},
    conversationId:{
      type: DataTypes.INTEGER,
      references:{
        model:'conversation',
        key:'id'
      }
    }
  }, {
    sequelize,
    modelName: 'userconversation',
  });
  return userconversation;
};