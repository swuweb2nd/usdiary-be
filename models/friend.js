const {Sequelize} = require("sequelize");

class Friend extends Sequelize.Model {
  static initiate(sequelize) {
    return super.init(
      {
        friend_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        follower_id: {
          type: Sequelize.BIGINT,   // 팔로우하는 유저의 sign_id
          allowNull: false,
        
        },
        following_id: {
          type: Sequelize.BIGINT,  // 팔로잉되는 유저의 sign_id
          allowNull: false,
        },
        status: {
          type: Sequelize.ENUM("pending", "rejected", "accepted", "removed"), // 요청 중, 거절, 친구 수락, 친구 삭제
          allowNull: true, // 기본값 없이 null 허용
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Friend",
        tableName: "Friend",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(models) {
    // 팔로워 관계 (N:1) 여러 명의 사용자가 팔로잉될 수 있음
    this.belongsTo(models.User, { foreignKey: "follower_id", targetKey: "user_id", as: 'Follower' });

    // 팔로잉 관계 (N:1) 한 사용자가 여러 명의 친구를 팔로우할 수 있음
    this.belongsTo(models.User, { foreignKey: "following_id", targetKey: "user_id", as: 'Following' });
  }
}

module.exports = Friend;