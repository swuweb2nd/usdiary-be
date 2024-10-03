const express = require('express');
const router = express.Router();
const { createPointCriteria, updatePointCriteria, deletePointCriteria } = require('../controllers/point');
const { verifyAdmin } = require('../middlewares/jwt'); // 관리자만 접근 가능

// 포인트 획득 및 차감 기준 등록 
router.post('/criteria', verifyAdmin, createPointCriteria);

// 포인트 획득 및 차감 기준 수정
router.patch('/criteria/:criteria_id', verifyAdmin, updatePointCriteria);

// 포인트 획득 및 차감 기준 삭제
router.delete('/criteria/:criteria_id', verifyAdmin, deletePointCriteria);

module.exports = router;
