'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.renameColumn("meetings", "date", "startDate", {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn("meetings", "startDate", "date", {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });

  
  }
};
