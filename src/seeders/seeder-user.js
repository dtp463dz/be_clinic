'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // up: chạy bình thường, thêm dữ liệu vào
  async up(queryInterface, Sequelize) {
    // bulkInsert: chèn nhiều bảng ghi 1 lúc
    return queryInterface.bulkInsert('Users', [
      {
        email: 'admin@gmail.com',
        password: '123456', //đây là plain text, thì cần phải chuyển thành hash text
        firstName: 'Dean',
        lastName: 'TPhuz',
        address: 'VN',
        gender: 1,
        typeRole: 'Role',
        keyRole: 'R1',
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
