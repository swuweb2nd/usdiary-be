const {Sequelize} = require("sequelize");

class Profile extends Sequelize.Model {
  static initiate(sequelize) {
    return super.init(
      {
        profile_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        profile_img: {
          type: Sequelize.STRING(255),
          allowNull: true
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Profile",
        tableName: "profiles",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

    // Profile 과 User 간의 1:1 관계 설정
    static associate(db) { // DB 관계설정
      db.Profile.belongsTo(db.User, {
        foreignKey: "user_id",
        sourceKey: "user_id",
        onDelete: "CASCADE",
      });
    }
}

module.exports = Profile;