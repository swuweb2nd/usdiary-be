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
        today_mood: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        place_memo: {
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