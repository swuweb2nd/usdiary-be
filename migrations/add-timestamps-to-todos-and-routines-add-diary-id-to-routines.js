module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check for and add columns in 'todos' table
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

    // Check for and add columns in 'routines' table
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

    // Add diary_id column to 'routines' table if it doesn't exist
    if (!routineTableDesc.diary_id) {
      await queryInterface.addColumn('routines', 'diary_id', {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: 'diaries',
          key: 'diary_id',
        },
        onDelete: 'CASCADE',
      });
    }

    // Remove user_id column from 'routines' table if it exists
    if (routineTableDesc.user_id) {
      await queryInterface.removeColumn('routines', 'user_id');
    }

    // Remove routine_title column from 'routines' table if it exists
    if (routineTableDesc.routine_title) {
      await queryInterface.removeColumn('routines', 'routine_title');
    }

    // Remove todo_title column from 'todos' table if it exists
    if (todoTableDesc.todo_title) {
      await queryInterface.removeColumn('todos', 'todo_title');
    }

    // Check for and add today_date column in 'today_questions' table
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
    await queryInterface.removeColumn('todos', 'createdAt');
    await queryInterface.removeColumn('todos', 'updatedAt');
    await queryInterface.removeColumn('routines', 'createdAt');
    await queryInterface.removeColumn('routines', 'updatedAt');
    await queryInterface.removeColumn('routines', 'diary_id'); // Remove diary_id column
    await queryInterface.removeColumn('today_questions', 'today_date'); // Remove today_date column

    // Restore user_id column in routines table
    await queryInterface.addColumn('routines', 'user_id', {
      type: Sequelize.BIGINT,
      allowNull: false,
    });

    // Restore routine_title column in routines table
    await queryInterface.addColumn('routines', 'routine_title', {
      type: Sequelize.TEXT,
      allowNull: false,
    });

    // Restore todo_title column in todos table
    await queryInterface.addColumn('todos', 'todo_title', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  }
};
