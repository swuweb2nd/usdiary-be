
/**
 * @swagger
 * tags:
 *   name: Diary
 *   description: 일기 관리
 * definitions:
 *   Diary:
 *     type: "object"
 *     required:
 *       - diary_id
 *       - user_id
 *       - board_id
 *       - diary_title
 *       - diary_content
 *       - access_level
 *       - view_count
 *       - like_count
 *     properties:
 *       diary_id:
 *         type: "integer"
 *         format: "int64"
 *         description: diary ID 
 *       user_id:
 *         type: "integer"
 *         format: "int64"
 *         description: user ID
 *       board_id:
 *         type: "integer"
 *         format: "int64"
 *         description: board ID(숲,바다,도시)
 *       diary_title:
 *         type: "string"
 *         maxLength: 255
 *         description: 일기 제목
 *       diary_content:
 *         type: "string"
 *         description: 일기 내용
 *       access_level:
 *         type: "integer"
 *         description: "공개 범위 (public: 0, private: 1, friend: 2)"
 *       view_count:
 *         type: "integer"
 *         format: "int64"
 *         description: 조회수
 *         default: 0
 *       like_count:
 *         type: "integer"
 *         format: "int64"
 *         description: 좋아요 수
 *         default: 0
 *       post_photo:
 *         type: "string"
 *         maxLength: 255
 *         description: 일기 사진 URL
 *       diary_emotion:
 *         type: "string"
 *         maxLength: 255
 *         description: 일기 감정
 *       cate_num:
 *         type: "integer"
 *         format: "int64"
 *         description: 카테고리 번호
 *     example:
 *       diary_id: 1
 *       user_id: 1
 *       board_id: 1
 *       diary_title: "바다 여행"
 *       diary_content: "오늘은 바다에 갔다..."
 *       access_level: 0
 *       view_count: 100
 *       like_count: 20
 *       post_photo: "http://example.com/photo.jpg"
 *       diary_emotion: "행복"
 *       cate_num: 3
 */

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
        like_count: {
          type: Sequelize.BIGINT,
          allowNull: false,
          defaultValue: 0,
        },
        post_photo: {
          type: Sequelize.STRING(255),
          allowNull: true,
          defaultValue: 0,
        },
        diary_emotion: {
            type: Sequelize.STRING(255), //바다에만 보임
            allowNull: true,
            
        },
        cate_num: {
          type: Sequelize.BIGINT, //자연 or 도시-> 바다에서만 카테고리 데이터 삽입되므로 널 허용, 영화관1 놀이공원2 카페 3 이런식으로 항목 별 번호 할당 예정
          allowNull: true,
        },
        
       
     
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
  }
}

module.exports = Diary;
