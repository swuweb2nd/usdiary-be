const Diary = require('../models/diary');
const User = require('../models/user');


// handlers.js
exports.renderDiary = async (req, res) => {
  try {
      const diaryId = req.params.diary_id;
      const diary = await Diary.findByPk(diaryId);

      if (!diary) {
          return res.status(404).json({ message: 'Diary not found' });
      }
      console.log(diary)
      res.json(diary);
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};


exports.createDiary = (req, res) => {
  const newDiary = {
      diary_title: req.body.diary_title,
      diary_content: req.body.diary_content,
      diary_cate: req.body.diary_cate,
      access_level: req.body.access_level,
      board_id: req.body.board_id,
      diary_emotion: req.body.diary_emotion,
      cate_num: req.body.cate_num,
      post_photo: req.file ? req.file.path : null
  };
  console.log(newDiary)
  // 예시 응답 데이터
  res.status(201).json({
      message: 'Diary created',
      data: newDiary
  });
};
