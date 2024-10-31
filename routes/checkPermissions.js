const express = require('express');
const router = express.Router();
const checkPermissions = require('../middlewares/checkPermissions');
const membership = require('../controllers/membership');

// 반대 페이지 조회 권한 체크
router.get('/opposite-page', checkPermissions('canViewOppositePage'), membership.viewOppositePage);

// 친구 커뮤니티 기능 사용 권한 체크
router.get('/community', checkPermissions('canUseCommunity'), membership.useCommunity);

// 마이페이지 팔로우 팔로잉 권한 체크
router.get('/mypage/follow', checkPermissions('canFollow'), membership.follow);

// 반대 페이지 게시글 작성 권한 체크
router.post('/opposite-page/post', checkPermissions('canPostOnOppositePage'), membership.postOnOppositePage);

module.exports = router;
