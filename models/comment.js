const {Sequelize} = require("sequelize");

class Comment extends Sequelize.Model {
  static initiate(sequelize) {
    return super.init(
      {
        comment_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        diary_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
   
        },
        user_id: {
          type: Sequelize.BIGINT,
          allowNull: true,
  
        },
       comment_text: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Comment",
        tableName: "comment",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Comment.belongsTo(db.Diary, { foreignKey: "diary_id", targetKey: "diary_id" });  //(1:N)하나의 다이어리에 여러 개의 코멘트가 있을 수 있음
    db.Comment.belongsTo(db.User, { foreignKey: "user_id", targetKey: "user_id" }); //(N:1)여러 코멘트가 하나의 사용자에 의해 작성될 수 있음
    db.Comment.hasMany(db.Report, { foreignKey: "comment_id", sourceKey: "comment_id", onDelete: "CASCADE"});
  }
    }
    
module.exports = Comment;