'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('meetings', 'roomId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'rooms',
        key: 'id',       
      },      
      allowNull: false,
    });
    await queryInterface.removeColumn('meetings', 'room');

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("meetings", "roomId");
    await queryInterface.addColumn('meetings', 'room', {
      type: Sequelize.STRING, 
      allowNull: false,
    });
  }
};
