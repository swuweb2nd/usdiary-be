const express = require('express');
const router = express.Router();
const { renderQnaList, renderQna, createQna } = require('../controllers/qna');
const { verifyToken } = require('../middlewares/jwt');

// 1:1 문의 목록 조회
router.get('/', verifyToken, renderQnaList);

// 1:1 특정 문의 조회
router.get('/:qna_id', verifyToken, renderQna);

// 1:1 문의 작성
router.post('/', verifyToken, createQna);

module.exports = router;