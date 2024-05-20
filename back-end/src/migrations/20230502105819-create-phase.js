'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('phases', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT
      },
      startDate:{
        type: Sequelize.DATEONLY
      },
      endDate:{
        type: Sequelize.DATEONLY
      },
      status:{
        type: Sequelize.STRING,
      },
      projectId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'projects',
          key: 'id',
          
        },
        onDelete:"CASCADE"
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
    await queryInterface.dropTable('phases');
  }
};