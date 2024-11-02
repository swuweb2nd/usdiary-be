const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getDiariesByDate } = require('../controllers/mypage');
const { uploadSingle } = require('../middlewares/upload.js');

// 프로필 조회
router.get('/profiles/:user_id', getProfile);

// 프로필 수정 (프로필 이미지 포함)
//router.put('/profile/:user_id', upload.single('profile_img'), updateProfile);
router.put('/profiles/:user_id', uploadSingle, updateProfile);

// 월별 기록 조회 
router.get('/diaries', getDiariesByMonth);

module.exports = router;