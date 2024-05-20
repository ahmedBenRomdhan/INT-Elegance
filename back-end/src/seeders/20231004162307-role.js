'use strict';

/** @type {import('sequelize-cli').Migration} */

const data = [{
  id:1,
  name:"admin",
  description:"all"
}]
const superAdmin = [
  {
  id:1,
  firstName:"admin",
  lastName:"admin",
  email:"sofiatech2023@gmail.com",
  password:"$2b$10$imLJ7L5j5KT1mISTDJB4Dut09Qbc9J1HZyHv2V8e5qi3kYOa6QaP2",
  phoneNumber:"25910678",
  department:"it",
  position:"web",
  roleId:1,
  createdAt: new Date('2023-09-04 00:00:00'),
  updatedAt: new Date('2023-09-04 00:00:00'),
}
]

module.exports = {

  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', data, {});
    // await queryInterface.bulkInsert('users', superAdmin, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
