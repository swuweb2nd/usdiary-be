const {Sequelize} = require("sequelize");

class Diary extends Sequelize.Model {
  static initiate(sequelize) {
    return super.init(
      {
        diary_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        user_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
        },
        board_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
        },
        diary_title: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        diary_content: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        access_level: {
          type: Sequelize.INTEGER, // public:0 private:1 friend:2-> 여기서 콘텐츠를 비회원에게는  제목이랑 글 내용 2줄만 보여주고 상세보기는 회원에게만 보여주는게 어떨지
          allowNull: false,
        },
        view_count: {
          type: Sequelize.BIGINT,
          allowNull: false,
          defaultValue: 0,
        },
        cate_num: {
          type: Sequelize.INTEGER,
          allowNull: true
          
        },
        like_count: {
          type: Sequelize.BIGINT,
          allowNull: false,
          defaultValue: 0,
        },
        post_photo: {
          type: Sequelize.TEXT,
          allowNull: true,
          defaultValue: 0,
        },
        /*question_id: {  // 오늘의 질문 id
          type: Sequelize.BIGINT,
          allowNull: true,
          references: {
            model: "TodayQuestion",
            key: "question_id",
          },
        },*/
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Diary",
        tableName: "diaries",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db){
    db.Diary.belongsTo(db.User,{foreignKey : "user_id", targetKey: "user_id", onDelete: "CASCADE"});
    db.Diary.belongsTo(db.Board,{foreignKey : "board_id", targetKey: "board_id", onDelete: "CASCADE"})
    db.Diary.hasMany(db.Todo,{foreignKey : "diary_id", targetKey: "diary_id", onDelete: "CASCADE"})
    db.Diary.hasMany(db.Routine,{foreignKey : "diary_id", targetKey: "diary_id", onDelete: "CASCADE"})
    db.Diary.hasMany(db.Report, { foreignKey: "diary_id", sourceKey: "diary_id", onDelete: "CASCADE" });
    db.Diary.hasMany(db.TodayPlace, { foreignKey: "diary_id", sourceKey: "diary_id", onDelete: "CASCADE" });
    db.Diary.hasMany(db.TodayAnswer,{foreignKey : "diary_id", targetKey: "diary_id", onDelete: "CASCADE"})
    //db.Diary.belongsTo(db.TodayQuestion, { foreignKey: "question_id", targetKey: "question_id" });
  }
}

module.exports = Diary;
