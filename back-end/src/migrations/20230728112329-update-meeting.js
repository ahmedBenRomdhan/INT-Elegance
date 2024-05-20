'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('meetings', 'title', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn('meetings', 'room', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn('meetings', 'startTime', {
      type: Sequelize.TIME,
      allowNull: false,
    });
    await queryInterface.changeColumn('meetings', 'endTime', {
      type: Sequelize.TIME,
      allowNull: false,
    });
    await queryInterface.changeColumn('meetings', 'startDate', {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });
    await queryInterface.changeColumn('meetings', 'createdBy', {
      type: Sequelize.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: false,
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('meetings', 'title', {
      type: Sequelize.STRING,
    });
    await queryInterface.changeColumn('meetings', 'room', {
      type: Sequelize.STRING,
    });
    await queryInterface.changeColumn('meetings', 'startTime', {
      type: Sequelize.TIME,
    });
    await queryInterface.changeColumn('meetings', 'endTime', {
      type: Sequelize.TIME,
    });
    await queryInterface.changeColumn('meetings', 'startDate', {
      type: Sequelize.DATEONLY,
    });
    await queryInterface.changeColumn('meetings', 'createdBy', {
      type: Sequelize.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    });
  }
};
