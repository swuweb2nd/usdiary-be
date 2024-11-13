const express = require('express');
const router = express.Router();
const { likeDiary, deleteLike } = require('../controllers/like');
const { verifyToken } = require('../middlewares/jwt');

//diaries/{diary_id}/like

// 일기 좋아요 생성
router.get('/:diary_id/like', verifyToken, likeDiary)

//일기 좋아요 삭제
router.delete('/:diary_id/like/:like_id', verifyToken, deleteLike);

module.exports = router;

