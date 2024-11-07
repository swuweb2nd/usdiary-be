module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Routine 테이블 업데이트
    const routineTable = await queryInterface.describeTable('routines');
    if (routineTable.diary_id) {
      await queryInterface.removeColumn('routines', 'diary_id'); // diary_id 필드가 존재할 때만 제거
    }
    if (!routineTable.sign_id) {
      await queryInterface.addColumn('routines', 'sign_id', {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: {
          model: 'users',
          key: 'sign_id'
        },
        onDelete: 'CASCADE'
      });
    }

    // TodayPlaces 테이블 업데이트
    const todayPlacesTable = await queryInterface.describeTable('today_places');
    if (todayPlacesTable.diary_id) {
      await queryInterface.removeColumn('today_places', 'diary_id'); // diary_id 필드가 존재할 때만 제거
    }
    if (!todayPlacesTable.sign_id) {
      await queryInterface.addColumn('today_places', 'sign_id', {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: {
          model: 'users',
          key: 'sign_id'
        },
        onDelete: 'CASCADE'
      });
    }

    // Todos 테이블 업데이트
    const todosTable = await queryInterface.describeTable('todos');
    if (todosTable.diary_id) {
      await queryInterface.removeColumn('todos', 'diary_id'); // diary_id 필드가 존재할 때만 제거
    }
    if (!todosTable.sign_id) {
      await queryInterface.addColumn('todos', 'sign_id', {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: {
          model: 'users',
          key: 'sign_id'
        },
        onDelete: 'CASCADE'
      });
    }

    // TodayAnswers 테이블 업데이트
    const todayAnswersTable = await queryInterface.describeTable('today_answers');

    if (todayAnswersTable.diary_id) { // diary_id가 있는 경우에만 외래 키 제거 후 컬럼 제거
      await queryInterface.removeConstraint('today_answers', 'today_answers_ibfk_59'); 
      await queryInterface.removeColumn('today_answers', 'diary_id');
    }
    if (todayAnswersTable.user_id) { // user_id가 있는 경우에만 제거
      await queryInterface.removeColumn('today_answers', 'user_id');
    }
    if (!todayAnswersTable.question_id) { // question_id가 없는 경우에만 추가
      await queryInterface.addColumn('today_answers', 'question_id', {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'today_questions',
          key: 'question_id'
        },
        onDelete: 'CASCADE'
      });
    }
    if (!todayAnswersTable.sign_id) { // sign_id가 없는 경우에만 추가
      await queryInterface.addColumn('today_answers', 'sign_id', {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: {
          model: 'users',
          key: 'sign_id'
        },
        onDelete: 'CASCADE'
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
  }
};
