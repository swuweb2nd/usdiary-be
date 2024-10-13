const {Sequelize} = require("sequelize");

class QnA extends Sequelize.Model {
  static initiate(sequelize) {
    return super.init(
      {
        qna_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        answer_id: {
          type: Sequelize.BIGINT,
          allowNull: true,
          primaryKey: true,
        },
        user_id: { 
          type: Sequelize.BIGINT,
          allowNull: false,
          type: Sequelize.BIGINT,
        },
        is_completed: {
          type: Sequelize.BOOLEAN,
          allowNull: false
        },
        qna_title: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        qna_content: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        answer_content: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        view_count: {
          type: Sequelize.BIGINT,
          allowNull: false,
          defaultValue: 0,
        },
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
  
// QnA 와 User 간의 N:1 관계 설정
    static associate(db) { // DB 관계설정
      db.QnA.belongsTo(db.User, {
        foreignKey: "user_id",
        sourceKey: "user_id",
        onDelete: "CASCADE",
      });
      
    }
    
}

module.exports = QnA;