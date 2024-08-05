const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
//로그인
router.post('/login', users.login);
//아이디찾기
router.post('/findId', users.findId)

module.exports = router;
