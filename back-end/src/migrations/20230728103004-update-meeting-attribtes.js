"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("meetings", "endDate", {
      allowNull: false,
      type: Sequelize.DATEONLY,
      defaultValue: new Date(),
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("meetings", "endDate");

  },
};
