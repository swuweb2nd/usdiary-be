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
        user_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
   
  
          },
      },
      {
        sequelize,
        timestamps: false,
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
        foreignKey: "user_id",
        targetKey: "user_id",
        onDelete: "CASCADE",
      });
  }
}

module.exports = Routine;