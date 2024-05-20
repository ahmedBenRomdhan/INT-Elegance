'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("meetings", "description", {
      type: Sequelize.TEXT,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("meetings", "description");
  }
};
