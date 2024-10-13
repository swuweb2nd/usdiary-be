const {Sequelize} = require("sequelize");


class Board extends Sequelize.Model {
  static initiate(sequelize) {
    return super.init(
      {
        board_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true

        },
        board_name:{
            type: Sequelize.ENUM('숲','도시','바다'),
            allowNull: false,
  
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Board",
        tableName: "boards",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Board.hasMany(db.Diary, {
      foreignKey: "board_id", //상대 테이블에 참조하는 값의 칼럼 이름
      sourceKey: "board_id", //이 테이블의 참조당하는 값
      onDelete: "CASCADE",
    });

  }
}

module.exports = Board;