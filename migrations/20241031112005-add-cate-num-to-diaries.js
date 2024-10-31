'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('diaries', 'cate_num', {
      type: Sequelize.INTEGER,
      allowNull: true, // 필요한 경우 NULL 허용
    });
   },

  async down (queryInterface, Sequelize) {
  
  }
};
