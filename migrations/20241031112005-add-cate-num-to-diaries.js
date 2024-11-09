'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('diaries');

    if (!tableDescription.cate_num) { // cate_num 컬럼이 없을 때만 추가
      await queryInterface.addColumn('diaries', 'cate_num', {
        type: Sequelize.INTEGER,
        allowNull: true, // 필요한 경우 NULL 허용
      });
    }
  },

  async down (queryInterface, Sequelize) {
    // 컬럼 제거 시 사용: 마이그레이션 되돌리기
    const tableDescription = await queryInterface.describeTable('diaries');

    if (tableDescription.cate_num) { // cate_num 컬럼이 있을 때만 제거
      await queryInterface.removeColumn('diaries', 'cate_num');
    }
  }
};