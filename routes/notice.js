const express = require('express');
const router = express.Router();
const { renderNoticeList, renderNotice, createNotice, updateNotice, deleteNotice } = require('../controllers/notice');

// 공지사항 목록 조회
router.get('/',renderNoticeList);

// 공지사항 단일 조회
router.get('/:notice_id', renderNotice);

// 공지사항 생성 
router.post('/', createNotice);

// 공지사항 수정
router.patch('/:notice_id', updateNotice);

// 공지사항 삭제
router.delete('/:notice_id', deleteNotice);

module.exports = router;