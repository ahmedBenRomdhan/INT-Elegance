'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('meetings', 'startDate', 'start');
    await queryInterface.renameColumn('meetings', 'endDate', 'end');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('meetings', 'start', 'startDate');
    await queryInterface.renameColumn('meetings', 'end', 'endDate');
  }
};
