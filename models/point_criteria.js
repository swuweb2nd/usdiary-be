const { Sequelize } = require("sequelize");

class PointCriteria extends Sequelize.Model {
  static initiate(sequelize) {
    return super.init(
      {
        criteria_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        content: {
          type: Sequelize.STRING(255),
          allowNull: false, // 내용 (예: 글쓰기, 댓글 달기 등)
        },
        remark: {
          type: Sequelize.STRING(255),
          allowNull: true, // 비고
        },
        points: {
          type: Sequelize.BIGINT,
          allowNull: false, // 부여되거나 차감될 포인트 수량 ex. 1, -10, ..
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "PointCriteria",
        tableName: "point_criteria",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
}

module.exports = PointCriteria;
