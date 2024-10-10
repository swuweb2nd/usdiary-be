const Qna = require('../models/qna');

// 1:1 문의 목록 조회
exports.renderQnaList = async (req, res) => {
  try {
    const signId = res.locals.decoded.sign_id; 

    // 사용자가 작성한 전체 QnA 목록 조회
    const qnaList = await Qna.findAll({
      where: {
        sign_id: signId, // sign_id로 필터링
      },
      attributes: ['qna_id', 'qna_title', 'is_completed', 'view_count'], 
    });

    if (!qnaList || qnaList.length === 0) {
      return res.status(404).json({ message: 'No inquiries found' });
    }

    console.log(qnaList);
    res.json(qnaList);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


  // 1:1 특정 문의 조회
exports.renderQna = async (req, res) => {
  try {
    const signId = res.locals.decoded.sign_id; 
    const qnaId = req.params.qna_id; 

    // 특정 QnA 조회
    const qna = await Qna.findOne({
      where: {
        qna_id: qnaId,
        sign_id: signId, 
      },
      attributes: ['qna_id', 'qna_title', 'qna_content', 'is_completed', 'view_count'], // 필요한 필드만 조회
    });

    if (!qna) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    console.log(qna);
    res.json(qna);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

  
// 1:1 문의 등록
exports.createQna = async (req, res) => {
    try {
      const {titleId, contentId} = req.body; 
      const signId = res.locals.decoded.sign_id; 
      
      // QnA 생성
      const newQna = await Qna.create({
        sign_id: signId,
        qna_title: titleId, 
        qna_content: contentId,
        is_completed: false 
      });
  
      console.log(newQna);
      res.status(201).json(newQna); 
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };