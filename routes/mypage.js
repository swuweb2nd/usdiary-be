const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getDiariesByDate } = require('../controllers/mypage');
const upload = require('../middlewares/upload.js'); 

// 프로필 조회
router.get('/profile/:user_id', getProfile);

// 프로필 수정 (프로필 이미지 포함)
router.put('/profile/:user_id', upload.single('profile_img'), updateProfile);

// 캘린더 기록 조회
router.get('/diaries/:createdAt', getDiariesByDate);

module.exports = router;
