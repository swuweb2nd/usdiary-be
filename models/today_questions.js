const {Sequelize} = require("sequelize");

class TodayQuestion extends Sequelize.Model {
  static initiate(sequelize) {
    return super.init(
      {
        question_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        question_text: {
          type: Sequelize.TEXT,
          allowNull: false,
      }
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "TodayQuestion",
        tableName: "today_questions",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db){
    db.TodayQuestion.hasMany(db.TodayAnswer, {
      foreignKey: "question_id",
      sourceKey: "question_id",
      onDelete: "CASCADE",
    });
  }
}

module.exports = TodayQuestion;