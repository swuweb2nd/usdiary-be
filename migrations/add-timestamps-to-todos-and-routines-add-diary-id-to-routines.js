module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 'todos' 테이블 업데이트
    const todoTableDesc = await queryInterface.describeTable('todos');
    
    if (!todoTableDesc.createdAt) {
      await queryInterface.addColumn('todos', 'createdAt', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      });
    }

    if (!todoTableDesc.updatedAt) {
      await queryInterface.addColumn('todos', 'updatedAt', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      });
    }

    // 'routines' 테이블 업데이트
    const routineTableDesc = await queryInterface.describeTable('routines');

    if (!routineTableDesc.createdAt) {
      await queryInterface.addColumn('routines', 'createdAt', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      });
    }

    if (!routineTableDesc.updatedAt) {
      await queryInterface.addColumn('routines', 'updatedAt', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      });
    }

    // diary_id 컬럼이 존재하는 경우 제거
    if (routineTableDesc.diary_id) {
      await queryInterface.removeColumn('routines', 'diary_id');
    }

    // 'user_id' 컬럼 제거
    if (routineTableDesc.user_id) {
      await queryInterface.removeColumn('routines', 'user_id');
    }

    // 'routine_title' 컬럼 제거
    if (routineTableDesc.routine_title) {
      await queryInterface.removeColumn('routines', 'routine_title');
    }

    // 'todo_title' 컬럼 제거
    if (todoTableDesc.todo_title) {
      await queryInterface.removeColumn('todos', 'todo_title');
    }

    // 'today_questions' 테이블에 today_date 컬럼 추가
    const todayQuestionsTableDesc = await queryInterface.describeTable('today_questions');
    if (!todayQuestionsTableDesc.today_date) {
      await queryInterface.addColumn('today_questions', 'today_date', {
        type: Sequelize.DATEONLY,
        allowNull: true,
        defaultValue: null,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
  }
};
