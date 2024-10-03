const express = require('express');
const router = express.Router();
const { createReport,reportList } = require('../controllers/report');
const { verifyToken } = require('../middlewares/jwt');

// 신고 목록 조회
router.get('/', reportList);

// 신고 생성
router.post('/systems/reports', verifyToken, createReport);

module.exports = router;