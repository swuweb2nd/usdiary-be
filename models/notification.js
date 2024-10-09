const {Sequelize} = require("sequelize");

class Notification extends Sequelize.Model {
  static initiate(sequelize) {
    return super.init(
      {
        noti_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        is_read: {
          type: Sequelize.BOOLEAN, //Domain은 BOOLEAN이고 type는 BOOL이라서 BOOL로 작성
          allowNull: true,
        },
        sign_id: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true,
        },
        friend_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
        
        },
        comment_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        like_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
        
        },
        qna_id3: {   //원래 아이디가 q&a id3인데 '&'가 오류를 일으켜서 n으로 대체하고 띄어쓰기 대신 언더바로 대체
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        ans_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },        
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Notification",
        tableName: "notification",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    //(N:1) 각 테이블에서 변동사항이 있을때마다 여러 알림이 갈 수 있음 
    db.Notification.belongsTo(db.User, { foreignKey: "sign_id", targetKey: "sign_id" }); 
    db.Notification.belongsTo(db.Friend, { foreignKey: "friend_id", targetKey: "friend_id" }); 
    db.Notification.belongsTo(db.Comment, { foreignKey: "comment_id", targetKey: "comment_id" });  
    db.Notification.belongsTo(db.Friend, { foreignKey: "follower_sign_id", targetKey: "follower_sign_id" });
    db.Notification.belongsTo(db.Like, { foreignKey: "like_id", targetKey: "like_id" });
    db.Notification.belongsTo(db.QnA, { foreignKey: "qna_id3", targetKey: "qna_id" }); 
    db.Notification.belongsTo(db.Answer, { foreignKey: "ans_id", targetKey: "ans_id" }); 
  }
}

module.exports = Notification;