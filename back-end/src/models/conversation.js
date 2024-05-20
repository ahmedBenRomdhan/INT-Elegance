'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      conversation.belongsToMany(models.user, {through:'userconversation'})
      conversation.belongsToMany(models.message, {through:'conversationmessage'})
    }
  }
  conversation.init({
    conversation_name:{
      type: DataTypes.TEXT
    },
  }, {
    sequelize,
    modelName: 'conversation',
  });
  return conversation;
};