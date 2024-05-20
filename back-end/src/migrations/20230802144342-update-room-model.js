'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn("rooms", "availablity", "availability");
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn("rooms", "availability", "availablity");
  }
};
