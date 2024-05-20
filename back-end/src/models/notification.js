'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  notification.init({
    from: DataTypes.STRING,
    subject: DataTypes.STRING,
    useravatar: DataTypes.STRING,
    treated:{
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    to: {
      type: DataTypes.INTEGER,
      allowNull:true
    }
  }, 
  {
    sequelize,
    modelName: 'notification',
  });
  return notification;
};
/**
 *  {
      useravatar: 'assets/images/users/4.jpg',
      status: 'offline',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }
 */