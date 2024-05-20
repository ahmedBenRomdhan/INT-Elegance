'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('meetings', 'endDate', {
      type: Sequelize.DATEONLY,
      allowNull: false,

    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('meetings', 'endDate', {
      type: Sequelize.DATEONLY,
      allowNull: false,
      defaultValue: new Date(),

    });
  }
};
