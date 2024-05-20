'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('trailTasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      eventType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      entityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      oldValues: {
        type: Sequelize.STRING.BINARY
      },
      newValues: {
        type: Sequelize.STRING.BINARY
      },
      attributes: {
        type: Sequelize.STRING.BINARY
      },
      userId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
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
    await queryInterface.dropTable('trailTasks');
  }
};