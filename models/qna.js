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
        is_completed: {
          type: Sequelize.BOOLEAN,
          allowNull: false
        },
        sign_id: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true,
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
        foreignKey: "sign_id",
        sourceKey: "sign_id",
        onDelete: "CASCADE",
      });
      
    }
    
}

module.exports = QnA;