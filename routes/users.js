const express = require('express');
const router = express.Router();
const { login, findId, findPwd, checkPassword, getUserInfo, updateTendency, getLoginPage, googleCallback } = require('../controllers/users');
const { verifyToken } = require('../middlewares/jwt');

// 로그인
router.post('/login', login);
// 아이디 찾기
router.post('/findId', findId);
// 비밀번호 찾기
router.post('/findPwd', findPwd);
// 비밀번호 확인
router.post('/check-password', verifyToken, checkPassword);
// 현재 로그인된 사용자 정보 조회
router.get('/me', verifyToken, getUserInfo);
// 유저 성향 선택
router.patch('/:sign_id/tendency', verifyToken, updateTendency);


// Google 로그인 페이지 렌더링
router.get('/login/google', getLoginPage);
// Google OAuth 2.0 콜백 처리
router.get('/login/google/callback', googleCallback);



  

module.exports = router;