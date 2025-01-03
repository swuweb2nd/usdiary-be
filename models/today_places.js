const {Sequelize} = require("sequelize");

class TodayPlace extends Sequelize.Model {
  static initiate(sequelize) {
    return super.init(
      {
        place_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        cate_num: {
          type: Sequelize.BIGINT, // 영화관1 놀이공원2 카페 3 이런식으로 항목 별 번호 할당 예정
          allowNull: false
        },
        today_mood: { //오늘의 기분
          type: Sequelize.TEXT,
          allowNull: false,
        },
        place_memo: { //메모
          type: Sequelize.TEXT,
          allowNull: true,
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
        modelName: "TodayPlace",
        tableName: "today_places",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.TodayPlace.belongsTo(db.User, {
      foreignKey: "sign_id",
      targetKey: "sign_id",
      onDelete: "CASCADE",  // 일기가 삭제되면 해당 장소도 삭제됨
    });
  }
}

module.exports = TodayPlace;