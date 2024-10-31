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
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        is_completed: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        diary_id: { 
          type: Sequelize.BIGINT,
          allowNull: false,
        },
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
    db.Routine.belongsTo(db.Diary, {
        foreignKey: "diary_id",
        targetKey: "diary_id",
        onDelete: "CASCADE",
      });
  }
}

module.exports = Routine;