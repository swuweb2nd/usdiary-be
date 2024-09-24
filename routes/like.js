const express = require('express');
const router = express.Router();
const upload = require('../multer/multer'); // multer 설정 가져오기
const { likeDiary, deleteLike } = require('../controllers/like');
const { verifyToken } = require('../middlewares/jwt');

//diaries/{diary_id}/like

// 일기 좋아요 생성
router.get('/:diary_id/like', verifyToken, likeDiary)

//일기 좋아요 삭제
router.delete('/:diary_id/like', verifyToken, deleteLike);

module.exports = router;

