const express = require('express');
const router = express.Router();
const { updateComment,createComment,renderComments, deleteComment } = require('../controllers/comment');
const { verifyToken } = require('../middlewares/jwt');

//댓글 조회 - 특정 일기에 대한 댓글 조회
router.get('/:diary_id/comments', verifyToken, renderComments);

// 댓글 작성 - 특정 일기에 댓글 작성
router.post('/:diary_id/comments', verifyToken, createComment);

// 댓글 수정 - 특정 댓글 수정
router.put('/:diary_id/comments/:comment_id', verifyToken, updateComment);

//댓글 삭제 - 특정 댓글 삭제
router.delete('/:diary_id/comments/:comment_id', verifyToken, deleteComment);

module.exports = router;
