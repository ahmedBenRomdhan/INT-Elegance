'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type:{
        type: Sequelize.STRING,
      },
      priority:{
        type: Sequelize.STRING,
      },
      status:{
        type: Sequelize.STRING,
        defaultValue:"New",
      },
      startDate:{
        type: Sequelize.DATEONLY
      },
      endDate:{
        type: Sequelize.DATEONLY
      },
      estimatedTime:{
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      realisation:{
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      passedTime: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      color: {
        type: Sequelize.STRING,
      },
      comment:{
        type: Sequelize.TEXT,
      },
      phaseId:{
        type: Sequelize.INTEGER,
        references: {
          model: 'phases',
          key: 'id'
        },
        allowNull: false,
        onDelete:"CASCADE"
      },
      parentId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'tasks',
          key: 'id'
        }
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tasks');
  }
};