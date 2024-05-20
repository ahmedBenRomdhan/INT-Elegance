'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Rename the table 'userevent' to 'usermeeting'
    await queryInterface.renameTable('userevents', 'usermeetings');

    // Rename the column 'eventId' to 'meetingId'
    await queryInterface.renameColumn('usermeetings', 'eventId', 'meetingId');

    // Update the foreign key reference to the 'meeting' table
    await queryInterface.renameColumn('usermeetings', 'meetingId', 'meetingId', {
      references: {
        model: 'meetings',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the table name back to 'userevent'
    await queryInterface.renameTable('usermeetings', 'userevents');

    // Revert the column name back to 'eventId'
    await queryInterface.renameColumn('userevents', 'meetingId', 'eventId');

    // Revert the foreign key reference back to 'event'
    await queryInterface.renameColumn('userevents', 'meetingId', 'meetingId', {
      references: {
        model: 'events',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
};
