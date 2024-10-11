const express = require('express');
const router = express.Router();
const {
    sendVerificationCode,
    verifyCode, 
    register,
    checkId,
    checkNickname
} = require('../controllers/register'); 
const {
    sendVerificationEmail
} = require('../utils/mail'); 


// 회원 가입
router.post('/', register);

//이메일 인증
router.post('/verify-email', sendVerificationEmail);

// 이메일 인증 코드 전송
router.post('/send-verification-code', sendVerificationCode);

// 인증 코드 확인
router.post('/verify-code', verifyCode); 

// 아이디 중복 확인
router.get('/idcheck', checkId);

// 닉네임 중복 확인
router.get('/nicknamecheck',checkNickname);

module.exports = router;
