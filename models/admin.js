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
//   static associate(db) {
//     db.Board.hasMany(db.Diary, {
//       foreignKey: "board_id", //상대 테이블에 참조하는 값의 칼럼 이름
//       sourceKey: "board_id", //이 테이블의 참조당하는 값
//       onDelete: "CASCADE",
//     });

//   }
}

module.exports = Admin;