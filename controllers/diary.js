const Diary = require('../models/diary');
const User = require('../models/user');
const Board = require('../models/board');

//일기 조회
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

//일기 작성
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
exports.updateDiary = async (req, res) => {
    const { diary_id } = req.params;
    const {
      diary_title,
      diary_content,
      diary_cate,
      access_level,
      diary_emotion,
      cate_num,
    } = req.body;
  
    try {
      // 다이어리 항목 찾기
      const diary = await Diary.findByPk(diary_id);
  
      if (!diary) {
        return res.status(404).json({ message: 'Diary not found' });
      }
  
      // 다이어리 항목 업데이트
      const updatedDiary = await diary.update({
        diary_title: diary_title || diary.diary_title,
        diary_content: diary_content || diary.diary_content,
        diary_cate: diary_cate || diary.diary_cate,
        access_level: access_level || diary.access_level,
        diary_emotion: diary_emotion || diary.diary_emotion,
        cate_num: cate_num || diary.cate_num,
        post_photo: req.file ? req.file.path : diary.post_photo,
      });
  
      // 성공적으로 업데이트된 다이어리 항목 반환
      res.status(200).json({
        message: 'Diary updated successfully',
        data: updatedDiary,
      });
    } catch (error) {
      console.error('Error updating diary:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

// 일기 삭제 
exports.deleteDiary = async (req, res) => {
    const diaryId = req.params.diary_id;

    try {
        // 일기가 존재하는지 확인
        const diary = await Diary.findByPk(diaryId);

        if (!diary) {
            return res.status(404).json({ message: 'Diary not found' });
        }

        // 일기 삭제
        await Diary.destroy({
            where: {
                diary_id: diaryId
            }
        });

        return res.status(200).json({ message: 'Diary deleted successfully' });
    } catch (error) {
        console.error('Error deleting diary:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.sortDiary = async (req, res, next) => {
  try {
      const diaries = await Diary.findAll({
          include: {
              model: User,
              attributes: ['user_id'],
          },
          order: [['createdAt', 'DESC']],
      });
      console.log(diaries);
      res.json(diaries); // res.render 대신 res.json 사용
  } catch (error) {
    console.error('Error sorting diary:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

exports.sortDiaryViews = async (req, res, next) => {
  try {
      const diaries = await Diary.findAll({
        include: [
          { model: User, attributes: ['user_id'] },
          { model: Board, attributes: ['board_name'] },
        ],
        order: [['view_count', 'DESC']]
      });
  
      console.log(diaries);
      res.json(diaries);
  } catch (error) {
    console.error('Error sorting diary:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

exports.sortDiaryLikes = async (req, res, next) => {
  try {
      const diaries = await Diary.findAll({
        include: [
          { model: User, attributes: ['user_id'] },
          { model: Board, attributes: ['board_name'] },
        ],
        order: [['like_count', 'DESC']]
      });
  
      console.log(diaries); // console 에 안뜸
      res.json(diaries);
  } catch (error) {
    console.error('Error sorting diary:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
