'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class conversationmessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  conversationmessage.init({
    messageId:{
      type: DataTypes.INTEGER,
      references: {
      model: 'message',  
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
    modelName: 'conversationmessage',
  });
  return conversationmessage;
};