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
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        is_completed: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        sign_id: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
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
    db.Todo.belongsTo(db.User, {
      foreignKey: "sign_id",
      targetKey: "sign_id",
      onDelete: "CASCADE",
    });
  }
}

module.exports = Todo;