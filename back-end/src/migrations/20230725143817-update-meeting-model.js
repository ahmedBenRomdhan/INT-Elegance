"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("meetings", "createdBy", {
      type: Sequelize.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    });
    await queryInterface.removeColumn("usermeetings", "createdBy");

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("meetings", "createdBy");
    await queryInterface.addColumn("usermeetings", "createdBy", {
      type: Sequelize.INTEGER,
    });
  },
};
