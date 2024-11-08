module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Routine 테이블 업데이트
    const routineTable = await queryInterface.describeTable('routines');
    if (routineTable.diary_id) {
      await queryInterface.removeColumn('routines', 'diary_id');
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
    if (!routineTable.date) {
      await queryInterface.addColumn('routines', 'date', {
        type: Sequelize.DATEONLY,
        allowNull: true
      });
    }

    // TodayPlaces 테이블 업데이트
    const todayPlacesTable = await queryInterface.describeTable('today_places');
    if (todayPlacesTable.diary_id) {
      await queryInterface.removeColumn('today_places', 'diary_id');
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
    if (!todayPlacesTable.date) {
      await queryInterface.addColumn('today_places', 'date', {
        type: Sequelize.DATEONLY,
        allowNull: true
      });
    }

    // Todos 테이블 업데이트
    const todosTable = await queryInterface.describeTable('todos');
    if (todosTable.diary_id) {
      await queryInterface.removeColumn('todos', 'diary_id');
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
    if (!todosTable.date) {
      await queryInterface.addColumn('todos', 'date', {
        type: Sequelize.DATEONLY,
        allowNull: true
      });
    }

    // TodayAnswers 테이블 업데이트
    const todayAnswersTable = await queryInterface.describeTable('today_answers');
    if (todayAnswersTable.diary_id) {
      await queryInterface.removeConstraint('today_answers', 'today_answers_ibfk_59'); 
      await queryInterface.removeColumn('today_answers', 'diary_id');
    }
    if (todayAnswersTable.user_id) {
      await queryInterface.removeColumn('today_answers', 'user_id');
    }
    if (!todayAnswersTable.question_id) {
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
    if (!todayAnswersTable.sign_id) {
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
    if (!todayAnswersTable.date) {
      await queryInterface.addColumn('today_answers', 'date', {
        type: Sequelize.DATEONLY,
        allowNull: true
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // 복구용 코드 작성 (필요에 따라 작성)
  }
};
