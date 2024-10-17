const {Sequelize} = require("sequelize");


class Admin extends Sequelize.Model {
  static initiate(sequelize) {
    return super.init(
      {
        admin_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true

        },
        admin_acc:{ // 관리자 아이디
            type: Sequelize.STRING(255),
            allowNull: false,
  
        },
        admin_pwd: {
            type: Sequelize.STRING(255),
            allowNull: false,
          }, 
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Admin",
        tableName: "admins",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.Admin.hasMany(db.Notice, {
      foreignKey: "admin_id",
      sourceKey: "admin_id",
      onDelete: "SET NULL",
    });
  }
}

module.exports = Admin;