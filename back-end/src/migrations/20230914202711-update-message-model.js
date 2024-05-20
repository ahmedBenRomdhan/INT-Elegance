'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove deletedAt attribute
    await queryInterface.addColumn("messages", "fileMetadata", {
      type: Sequelize.JSON, 
      allowNull: true,
      defaultValue: {}, 
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("messages", "fileMetadata");

  },
};
