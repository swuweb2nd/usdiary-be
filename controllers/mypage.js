const { Op } = require('sequelize');
const { User, Profile, Diary } = require('../models'); 

//프로필 조회
exports.getProfile = async (req, res) => {
    const { user_id } = req.params; 

    try {
        const user = await User.findOne({
            where: { user_id: user_id },
            attributes: ['sign_id', 'user_nick', 'user_email', 'user_name', 'user_phone', 'user_birthday', 'user_gender'],
            include: [{
                model: Profile,
                attributes: ['profile_img'], // 프로필 이미지 추가
            }]
        });

        if (!user) {
            return res.status(404).json({ message: '해당 사용자가 존재하지 않습니다.' });
        }

        res.status(200).json({ message: '사용자 정보 조회 성공', data: user });
    } catch (error) {
        res.status(500).json({ message: '사용자 정보를 조회하는 중 오류가 발생했습니다.', error: error.message });
    }
};

//프로필 수정
exports.updateProfile = async (req, res) => {
    const { user_id } = req.params;
    const { sign_id, user_nick, user_email, user_name, user_phone, user_birthday, user_gender } = req.body;
    const profile_img = req.file ? req.file.filename : null; // 프로필 이미지 파일 처리

    try {
        const user = await User.findOne({ where: { user_id: user_id } });

        if (!user) {
            return res.status(404).json({ message: '해당 사용자가 존재하지 않습니다.' });
        }

        // 사용자 정보 업데이트
        await user.update({
            sign_id,
            user_nick,
            user_email,
            user_name,
            user_phone,
            user_birthday,
            user_gender,
        });

        // 프로필 이미지 업데이트
        const profile = await Profile.findOne({ where: { user_id: user_id } });
        if (profile) {
            await profile.update({ profile_img });
        } else {
            await Profile.create({ user_id, profile_img });
        }

        res.status(200).json({ message: '사용자 정보가 성공적으로 업데이트되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: '사용자 정보를 업데이트하는 중 오류가 발생했습니다.', error: error.message });
    }
};

//캘린더 기록 조회
exports.getDiariesByDate = async (req, res) => {
    const { date } = req.params; // 선택된 날짜 
  
    try {
      // 날짜의 시작과 끝을 설정
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
  
      const diaries = await Diary.findAll({
        where: {
          createdAt: {
            [Op.between]: [startOfDay, endOfDay]
          }
        },
        order: [['createdAt', 'DESC']],
        attributes: ['diary_id', 'diary_title', 'diary_content', 'board_id'] 
      });
  
      if (diaries.length === 0) {
        return res.status(404).json({ message: '해당 날짜에 작성된 일기가 없습니다.' });
      }
  
      res.status(200).json({
        message: '일기 조회 성공',
        data: diaries
      });
    } catch (error) {
      console.error('Error fetching diaries:', error);
      res.status(500).json({ message: '서버 오류', error: error.message });
    }
  };
