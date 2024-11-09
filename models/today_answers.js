const {Sequelize} = require("sequelize");

class TodayAnswer extends Sequelize.Model {
  static initiate(sequelize) {
    return super.init(
      {
        answer_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        answer_text: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        answer_photo: {
          type: Sequelize.TEXT, 
          allowNull: true, // 사진은 선택사항
        },
        question_id: { 
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        sign_id: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        date: { 
          type: Sequelize.DATEONLY, 
          allowNull: true,
        }
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "TodayAnswer",
        tableName: "today_answers",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db){
    db.TodayAnswer.belongsTo(db.TodayQuestion, {
      foreignKey: "question_id",
      targetKey: "question_id",
      onDelete: "CASCADE",
    });

    db.TodayAnswer.belongsTo(db.User, {
      foreignKey: "sign_id",
      targetKey: "sign_id",
      onDelete: "CASCADE",
    });
  }
}

module.exports = TodayAnswer;