const { Notice } = require('../models'); 

// 공지사항 목록 조회
exports.renderNoticeList = async (req, res) => {
  try {
    const notices = await Notice.findAll();
    return res.status(200).json({
      message: '공지사항 목록 조회 성공',
      data: notices
    });
  } catch (error) {
    console.error('공지사항 목록 조회 중 오류 발생:', error);
    return res.status(500).json({ message: '공지사항 목록 조회에 실패했습니다.' });
  }
};

// 공지사항 단일 조회
exports.renderNotice = async (req, res) => {
  const { notice_id } = req.params;
  
  try {
    const notice = await Notice.findByPk(notice_id);
    
    if (!notice) {
      return res.status(404).json({
        message: '해당 공지사항을 찾을 수 없습니다.'
      });
    }

    // 조회수 증가
    await notice.increment('view_count', { by: 1 });

    return res.status(200).json({
      message: '공지사항 조회 성공',
      data: notice
    });
  } catch (error) {
    console.error('공지사항 조회 중 오류 발생:', error);
    return res.status(500).json({ message: '공지사항 조회에 실패했습니다.' });
  }
};

// 공지사항 생성
exports.createNotice = async (req, res) => {
  const { title, content } = req.body;

  try {
    const newNotice = await Notice.create({
      title,
      content
    });
    return res.status(201).json({
      message: '공지사항 생성 성공',
      data: newNotice
    });
  } catch (error) {
    console.error('공지사항 생성 중 오류 발생:', error);
    return res.status(500).json({ message: '공지사항 생성에 실패했습니다.' });
  }
};

// 공지사항 수정 
exports.updateNotice = async (req, res) => {
  const { notice_id } = req.params;
  const { title, content } = req.body;

  try {
    const notice = await Notice.findByPk(notice_id);
    if (!notice) {
      return res.status(404).json({
        message: '해당 공지사항을 찾을 수 없습니다.'
      });
    }

    await notice.update({
      title,
      content
    });

    return res.status(200).json({
      message: '공지사항 수정 성공',
      data: notice
    });
  } catch (error) {
    console.error('공지사항 수정 중 오류 발생:', error);
    return res.status(500).json({ message: '공지사항 수정에 실패했습니다.' });
  }
};

// 공지사항 삭제
exports.deleteNotice = async (req, res) => {
  const { notice_id } = req.params;

  try {
    const notice = await Notice.findByPk(notice_id);
    if (!notice) {
      return res.status(404).json({
        message: '해당 공지사항을 찾을 수 없습니다.'
      });
    }

    await notice.destroy();
    return res.status(200).json({
      message: '공지사항 삭제 성공'
    });
  } catch (error) {
    console.error('공지사항 삭제 중 오류 발생:', error);
    return res.status(500).json({ message: '공지사항 삭제에 실패했습니다.' });
  }
};