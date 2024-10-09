const {Sequelize} = require("sequelize");

class Point extends Sequelize.Model {
  static initiate(sequelize) {
    return super.init(
      {
        point_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        point_num: {
          type: Sequelize.BIGINT,
          allowNull: false,
          defaultValue: 0
        },
        criteria_id: {  // PointCriteria 테이블과 연계
          type: Sequelize.BIGINT,
          allowNull: false,
          references: {
            model: 'PointCriteria',
            key: 'criteria_id',
          },
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

  static associate(db) {
    db.Point.belongsTo(db.User, { foreignKey: "sign_id", targetKey: "sign_id", onDelete: "CASCADE" });
    db.Point.belongsTo(db.PointCriteria, { foreignKey: "criteria_id", targetKey: "criteria_id" });
  }
}

module.exports = Point;