const express = require('express');
const router = express.Router();
const {getFriendDiaries,getFollowers,deleteFollowers, sendFollowRequest, handleFollowRequest, getFollowing, deleteFollowing, searchFriend, getFriends} = require('../controllers/friendlist');  // Controller 파일 가져오기
const { verifyToken } = require('../middlewares/jwt');

// 팔로워 목록 조회
router.get('/:sign_id/followers', verifyToken, getFollowers);
// 팔로워 삭제
router.delete('/:sign_id/followers/:follower_sign_id', verifyToken, deleteFollowers);

// 팔로잉 목록 조회
router.get('/:sign_id/followings', verifyToken, getFollowing);
// 팔로잉 삭제
router.delete('/:sign_id/:following_sign_id', verifyToken, deleteFollowing);
// 팔로우 요청
router.post('/follow-request', verifyToken, sendFollowRequest);
// 팔로우 요청 처리 (수락 또는 거절)
router.post('/follow-request/handle', verifyToken, handleFollowRequest);
// 친구 검색
router.get('/:sign_id/search', verifyToken, searchFriend);
// 친구 목록 조회
router.get('/:sign_id/friends', verifyToken, getFriends);
// 친구 게시글 조회
router.get('/:sign_id/followings/:following_sign_id/diaries', verifyToken, getFriendDiaries);

module.exports = router;
