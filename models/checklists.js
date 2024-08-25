const {Sequelize} = require("sequelize");

class Checklist extends Sequelize.Model {
  static initiate(sequelize) {
    return super.init(
      {
        checklist_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        check_date: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        check_content: {
          type: Sequelize.TEXT,
          allowNull: true,
        }
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Checklist",
        tableName: "checklists",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db){
    db.Checklist.hasMany(db.Todo, {
      foreignKey: "checklist_id",
      sourceKey: "checklist_id",
      onDelete: "CASCADE",
    });
    db.Checklist.belongsTo(db.User, {
      foreignKey: "user_id",
      targetKey: "user_id",
      onDelete: "CASCADE",
    });
  }
}

module.exports = Checklist;