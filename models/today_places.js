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
          type: Sequelize.BIGINT, //자연 or 도시-> 바다에서만 카테고리 데이터 삽입되므로 널 허용, 영화관1 놀이공원2 카페 3 이런식으로 항목 별 번호 할당 예정
          allowNull: true,
        },
        today_mood: { //오늘의 기분
          type: Sequelize.TEXT,
          allowNull: false,
        },
        place_memo: { //메모
          type: Sequelize.TEXT,
          allowNull: false,
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
  static associate(db){
    db.TodayPlace.belongsTo(db.User, {
      foreignKey: "user_id",
      targetKey: "user_id",
      onDelete: "CASCADE",
    });
  }
}

module.exports = TodayPlace;