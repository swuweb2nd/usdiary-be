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
        diary_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
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
    
    db.TodayAnswer.belongsTo(db.Diary, {
      foreignKey: "diary_id",
      targetKey: "diary_id",
      onDelete: "CASCADE",
    });
  }
}

module.exports = TodayAnswer;