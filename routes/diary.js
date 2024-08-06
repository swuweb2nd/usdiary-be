// /posts route에 get요청을 하는 예시 코드입니다. (게시글 전체 조회)
// tags에는 태그명을 넣어주었습니다.
// parameters에는 해당 route의 parameter들을 넣어줍니다.
// in: "query"는 쿼리스트링에 포함된 파라미터를 의미합니다. ex) /posts?category=카테고리1
// 이 외에도 in: "path"는 쿼리 파라미터를 의미하고, in: "body"는 req.body를 의미합니다.
// 자세한 사항은 swagger 관련 문서를 찾아보시면 될 것 같습니다.
// responses: 에는 응답에 관한 사항을 기록해줍니다.
/**
 * @swagger
 * /diaries:
 *   get:
 *     description: 모든 다이어리 조회
 *     tags: [Diary]
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - name: "body"
 *       in: "body"
 *       required: true
 *       schema:
 *         $ref: "#/definitions/Diary"
 *     responses:
 *       "200":
 *         description: "성공적으로 조회됨"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/definitions/Diary"
 *       "500":
 *         description: "서버 오류"
 *   post:
 *     description: 일기 등록
 *     tags: [Diary]
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - name: "body"
 *       in: "body"
 *       required: true
 *       schema:
 *         $ref: "#/definitions/Diary"
 *     responses:
 *       "201":
 *         description: "생성됨"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Diary'
 *       "400":
 *         description: "잘못된 요청"
 *       "500":
 *         description: "서버 오류"
 */



const express = require('express');
const router = express.Router();
const upload = require('../multer/multer'); // multer 설정 가져오기
const { renderDiary,createDiary } = require('../controller/diary');

// 일기 작성 페이지 렌더링

router.get('/:diary_id', renderDiary);

// user_id를 URL 파라미터로 받도록 설정
router.post('/', upload.single('post_photo'), createDiary);

module.exports = router;


