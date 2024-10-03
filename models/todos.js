const {Sequelize} = require("sequelize");

class Todo extends Sequelize.Model {
  static initiate(sequelize) {
    return super.init(
      {
        todo_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        todo_title: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        is_completed: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        diary_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
      

        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "Todo",
        tableName: "todos",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db){
    db.Todo.belongsTo(db.Diary, {
      foreignKey: "diary_id",
      targetKey: "diary_id",
      onDelete: "CASCADE",
    });
  }
}

module.exports = Todo;