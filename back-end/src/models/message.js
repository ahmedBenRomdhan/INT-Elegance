'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
      message.belongsTo(models.user, {foreignKey: 'senderId'})
      message.belongsToMany(models.conversation,{
        through:'conversationmessage'
      })
    }
  }
  message.init({
    message_body:{
      type: DataTypes.TEXT,
      allowNull: false
    },
    senderId:{
      type:DataTypes.INTEGER,
      allowNull: false,
      references:{
        model:"user",
        key:"id"
      }
    },
    fileMetadata: {
      type: DataTypes.JSON, // This field will store the file metadata as a JSON object
      allowNull: true,
      defaultValue: {}, // Default to an empty object if no metadata is provided
      get() {
        // Get the file metadata as is (already parsed as a JSON object)
        return this.getDataValue('fileMetadata');
      },
      set(value) {
        // Set the file metadata directly as a JSON object
        this.setDataValue('fileMetadata', value);
      },
    },
    
    viewed:{
      type:DataTypes.BOOLEAN,
      defaultValue: false}

  }, {
    sequelize,
    modelName: 'message',
  });
  return message;
};