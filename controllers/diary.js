const Diary = require('../models/diary');
const User = require('../models/user');
const Board = require('../models/board');
const { gainPoints } = require('../controllers/point'); 
const dayjs = require('dayjs');

//특정 사용자 일기 조회
// handlers.js
exports.renderDiary = async (req, res) => {
  try {
      const diaryId = req.params.diary_id;
      const signId = res.locals.decoded.sign_id; // JWT에서 사용자 sign_id 가져오기
      const diary = await Diary.findOne({
        where: {
            diary_id: diaryId,
            sign_id: signId // 사용자 sign_id로 필터링
        }
    });
      if (!diary) {
          return res.status(404).json({ message: 'Diary not found' ,data: {diary}});
      }
      console.log(diary)
      res.json(diary);
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};
//해당 글 조회
exports.renderDiary = async (req, res) => {
  try {
      const diaryId = req.params.diary_id;
      
      
      const diary = await Diary.findOne({
        where: {
            diary_id: diaryId,
            
        },
        include: [
          { model: User,attributes: ['sign_id','user_nick']},
        { model: Board, attributes: ['board_name'] },
        ]
      });
      
      if (!diary) {
          return res.status(404).json({ message: 'Diary not found', data: { diary } });
      }
      
      console.log(diary);
      res.json({ data: { diary } });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};


//일기 작성
exports.createDiary = async (req, res) => {
  const signId = res.locals.decoded.sign_id; // JWT에서 사용자 sign_id 가져오기
  const postPhotos = req.files ? req.files.map(file => file.path) : [];
  try {
    const newDiary = await Diary.create({
        diary_title: req.body.diary_title,
        diary_content: req.body.diary_content,
        diary_cate: req.body.diary_cate,
        access_level: req.body.access_level,
        board_id: req.body.board_id,
        diary_emotion: req.body.diary_emotion,
        cate_num: req.body.cate_num,
        post_photo:  JSON.stringify(postPhotos),
        sign_id: signId // JWT에서 가져온 sign_id 사용
    });

  // 기본 활동에 대한 포인트 추가
  await gainPoints(req, res, '글쓰기');

  // 연속 작성일 경우 추가 포인트
  const lastDiary = await Diary.findOne({
    where: { sign_id: signId },
    order: [['createdAt', 'DESC']],
  });

  if (lastDiary && dayjs().diff(dayjs(lastDiary.createdAt), 'day') === 1) {
    await gainPoints(req, res, '연속 글 쓰기');
  }

  // 사진이 3장 이상이면 추가 포인트
  if (req.files && req.files.length >= 3) {
    await gainPoints(req, res, '일기에 사진 3장 이상 첨부 시');
  }

    res.status(201).json({
        message: 'Diary created successfully',
        data: newDiary
    });
} catch (error) {
    console.error('Error creating diary:', error);
    res.status(500).json({ error: 'An error occurred while creating the diary' });
  }
};

// 일기 수정
exports.updateDiary = async (req, res) => {
    const { diary_id } = req.params;
    const signId = res.locals.decoded.sign_id; // JWT에서 사용자 sign_id 가져오기
    const postPhotos = req.files ? req.files.map(file => file.path) : [];
    const {
      diary_title,
      diary_content,
      diary_cate,
      access_level,
      diary_emotion,
      cate_num,
    } = req.body;
    
    try {
      const diary = await Diary.findOne({
          where: {
              diary_id,
              sign_id: signId // 사용자 sign_id로 필터링
          }
      });
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
        post_photo:  JSON.stringify(postPhotos),
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
    const signId = res.locals.decoded.sign_id; // JWT에서 사용자 sign_id 가져오기

    try {
      // 일기가 존재하는지 확인
      const diary = await Diary.findOne({
          where: {
              diary_id: diaryId,
              sign_id: signId // 사용자 sign_id로 필터링
          }
      });
        if (!diary) {
            return res.status(404).json({ message: 'Diary not found' });
        }

        // 일기 삭제
        await diary.destroy();

        return res.status(200).json({ message: 'Diary deleted successfully' });
    } catch (error) {
        console.error('Error deleting diary:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// 일기 목록 정렬 (최신순)
exports.sortDiary = async (req, res) => {
  try {
    const { page = 1, limit = 15, board_id } = req.query; // board_id 쿼리 파라미터
    const offset = (page - 1) * limit; // 페이지네이션 오프셋 계산

    const whereCondition = {};
    if (board_id) {
      whereCondition.board_id = parseInt(board_id, 10); // board_id가 있을 경우 필터 추가
    }

    const totalDiaries = await Diary.count({ where: whereCondition }); // 필터링된 일기 총 개수

    const diary = await Diary.findAll({
      where: whereCondition,
      include: [
        { model: User, attributes: ['sign_id', 'user_nick'] }, // 사용자 정보 포함
        { model: Board, attributes: ['board_name'] }, // 게시판 이름 포함
      ],
      order: [['createdAt', 'DESC']], // 최신순 정렬
      limit: parseInt(limit, 10), // 페이지네이션 한계
      offset: offset,
      loggin: console.log // 페이지네이션 오프셋
    });

    res.json({ data: { diary, totalDiaries } }); // 결과 반환
  } catch (error) {
    console.error('Error sorting diary:', error); // 오류 로그
    res.status(500).json({ message: 'Internal Server Error' }); // 오류 응답
  }
};


const { Op } = require('sequelize');

// 주간 조회수 정렬
exports.sortWeeklyViews = async (req, res) => {
  try {
    const { page = 1, limit = 15, board_id } = req.query; // board_id 쿼리 추가
    const offset = (page - 1) * limit;

    // 현재 주의 시작과 끝 날짜 계산 (일요일부터 토요일)
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const whereCondition = {
      createdAt: {
        [Op.between]: [startOfWeek, endOfWeek] // 주간 범위 설정
      }
    };
    if (board_id) {
      whereCondition.board_id = board_id; // board_id 필터 추가
    }
    const totalDiaries = await Diary.count({ where: whereCondition });

    const diary = await Diary.findAll({
      where: whereCondition,
      include: [
        { model: User, attributes: ['sign_id','user_nick'] },
        { model: Board, attributes: ['board_name'] },
      ],
      order: [['view_count', 'DESC']],
      limit: parseInt(limit),
      offset: offset,
    });

    res.json({data: {diary,totalDiaries}});
  } catch (error) {
    console.error('Error sorting weekly views:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// 주간 좋아요 정렬
exports.sortWeeklyLikes = async (req, res) => {
  try {
    const { page = 1, limit = 15, board_id } = req.query; // board_id 쿼리 추가
    const offset = (page - 1) * limit;

    // 현재 주의 시작과 끝 날짜 계산 (일요일부터 토요일)
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const whereCondition = {
      createdAt: {
        [Op.between]: [startOfWeek, endOfWeek] // 주간 범위 설정
      }
    };
    if (board_id) {
      whereCondition.board_id = board_id; // board_id 필터 추가
    }
    const totalDiaries = await Diary.count({ where: whereCondition });
    const diary = await Diary.findAll({
      where: whereCondition,
      include: [
        { model: User, attributes: ['sign_id','user_nick'] },
        { model: Board, attributes: ['board_name'] },
      ],
      order: [['like_count', 'DESC']],
      limit: parseInt(limit),
      offset: offset,
    });

    
    res.json({data: {diary,totalDiaries}});
  } catch (error) {
    console.error('Error sorting weekly views:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
