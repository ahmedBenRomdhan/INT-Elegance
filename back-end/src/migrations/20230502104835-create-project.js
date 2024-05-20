'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique:true,
      },
      description: {
        type: Sequelize.TEXT,
      },
      type:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      startDate:{
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      endDate:{
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      status:{
        type: Sequelize.STRING,
        defaultValue:"New",
      },
      createdAt: {
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('projects');
  }
};