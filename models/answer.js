const {Sequelize} = require("sequelize");

class Answer extends Sequelize.Model {
  static initiate(sequelize) {
    return super.init(
      {
        ans_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        ans_content: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        user_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          

        }
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Point",
        tableName: "points",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  
// Answer과 Question 간의 1:1 관계 설정
    static associate(db) { // DB 관계설정
      db.Answer.belongsTo(db.QnA, {
        foreignKey: "qna_id",
        sourceKey: "qna_id",
        onDelete: "CASCADE",
      });
    }

// Answer과 Admin 간의 1:1 관계 설정
static associate(db) { // DB 관계설정
    db.Answer.belongsTo(db.Admin, {
      foreignKey: "admin_id",
      sourceKey: "admin_id",
      onDelete: "CASCADE",
    });
  }
}

module.exports = Answer;