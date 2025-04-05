'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // up: chạy bình thường, thêm dữ liệu vào
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'example@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  // down: khi muốn cancel khi thêm dữ liệu, chạy roolback
  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
