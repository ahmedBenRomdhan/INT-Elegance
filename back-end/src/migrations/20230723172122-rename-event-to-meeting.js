'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Rename the table 'event' to 'meeting'
    await queryInterface.renameTable('events', 'meetings');
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the table name back to 'event' if needed
    await queryInterface.renameTable('meetings', 'events');
  }
};
