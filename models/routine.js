const {Sequelize} = require("sequelize");

class Routine extends Sequelize.Model {
  static initiate(sequelize) {
    return super.init(
      {
        routine_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        routine_title: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        is_completed: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
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
        modelName: "Routine",
        tableName: "routines",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db){
    db.Routine.belongsTo(db.User, {
        foreignKey: "sign_id",
        targetKey: "sign_id",
        onDelete: "CASCADE",
      });
  }
}

module.exports = Routine;