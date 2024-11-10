const User = require('../models/user');
const PointCriteria = require('../models/point_criteria');
const { Op } = require("sequelize");
const dayjs = require("dayjs");

// 포인트 기준 등록
exports.createPointCriteria = async (req, res) => {
  try {
    const { content, remark, points } = req.body;

    if (!content || !points) {
      return res.status(400).json({ message: '필수 항목이 누락되었습니다.' });
    }

    const newCriteria = await PointCriteria.create({
      content,
      remark,
      points,
    });

    return res.status(201).json({
      message: '포인트 획득 기준이 성공적으로 등록되었습니다.',
      data: newCriteria,
    });
  } catch (error) {
    console.error('포인트 기준 등록 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류' });
  }
};

// 포인트 기준 조회
exports.getAllPointCriteria = async (req, res) => {
  try {
    const criteriaList = await PointCriteria.findAll();

    if (!criteriaList || criteriaList.length === 0) {
      return res.status(404).json({ message: '포인트 기준이 없습니다.' });
    }

    return res.status(200).json({
      message: '포인트 기준 조회 성공',
      data: criteriaList
    });
  } catch (error) {
    console.error('포인트 기준 조회 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류' });
  }
};

// 포인트 기준 수정
exports.updatePointCriteria = async (req, res) => {
  try {
    const { criteria_id } = req.params;
    const { content, remark, points } = req.body;

    const criteria = await PointCriteria.findByPk(criteria_id);

    if (!criteria) {
      return res.status(404).json({ message: '포인트 획득 기준을 찾을 수 없습니다.' });
    }

    // 필드 업데이트
    await criteria.update({
      content: content || criteria.content,
      remark: remark || criteria.remark,
      points: points || criteria.points,
    });

    return res.status(200).json({
      message: '포인트 획득 기준이 성공적으로 수정되었습니다.',
      data: criteria,
    });
  } catch (error) {
    console.error('포인트 기준 수정 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류' });
  }
};

// 포인트 기준 삭제
exports.deletePointCriteria = async (req, res) => {
  try {
    const { criteria_id } = req.params;

    const criteria = await PointCriteria.findByPk(criteria_id);

    if (!criteria) {
      return res.status(404).json({ message: '포인트 획득 기준을 찾을 수 없습니다.' });
    }

    await criteria.destroy();

    return res.status(200).json({ message: '포인트 획득 기준이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error('포인트 기준 삭제 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류' });
  }
};

// 포인트 획득 함수
exports.gainPoints = async (signId, activity, pointsEarned = null) => {
  try {
    // 포인트 기준 테이블에서 해당 활동에 대한 포인트 기준을 찾음
    const criteria = await PointCriteria.findOne({ where: { content: activity } });
    if (!criteria && pointsEarned === null) {
      console.error(`활동 "${activity}"에 대한 포인트 기준이 없습니다.`);
      return '해당 활동에 대한 포인트 기준이 존재하지 않습니다.';
    }

    // 사용자 유효성 검사
    const user = await User.findOne({ where: { sign_id: signId } });
    if (!user) {
      console.error(`사용자 ${signId}를 찾을 수 없습니다.`);
      return '사용자를 찾을 수 없습니다.';
    }

    // 기준에 따른 포인트 계산
    const pointsToAdd = pointsEarned ?? criteria.points; // pointsEarned가 null이 아니면 해당 값 사용
    user.user_point += pointsToAdd;

    // 변경된 포인트 저장
    await user.save();

    const successMessage = `${pointsToAdd}점 획득했습니다. 현재 포인트: ${user.user_point}`;
    console.log(successMessage);
    return successMessage;
  } catch (error) {
    console.error('포인트 획득 중 오류 발생:', error);
    return '포인트 획득 중 오류가 발생했습니다.';
  }
};

// 포인트 차감 함수
exports.deductPoints = async (req, res) => {
  try {
    const signId = res.locals.decoded.sign_id; // JWT에서 사용자 sign_id 가져오기
    const activity = req.body.activity || req.query.activity; // req에서 활동명 가져오기

    // 포인트 기준 테이블에서 해당 활동에 대한 포인트 기준을 찾음
    const criteria = await PointCriteria.findOne({ where: { content: activity } });
    if (!criteria) {
      return res.status(404).json({
        message: '해당 활동에 대한 포인트 기준이 없습니다.',
      });
    }

    // 유저의 포인트 업데이트
    const user = await User.findOne({ where: { sign_id: signId } });
    if (!user) {
      return res.status(404).json({
        message: '사용자를 찾을 수 없습니다.',
      });
    }

    // 포인트 부족 여부 확인
    const pointsToDeduct = Math.abs(criteria.points);
    if (user.user_point < pointsToDeduct) {
      return res.status(400).json({
        message: `포인트가 부족합니다. 현재 포인트: ${user.user_point}`,
      });
    }

    // 기존 포인트에 기준에 따라 포인트 차감
    user.user_point -= pointsToDeduct;

    // 변경된 포인트 저장
    await user.save();

    return res.status(200).json({
      message: `${pointsToDeduct}점 차감되었습니다.`,
      data: {
        points: user.user_point,
      },
    });
  } catch (error) {
    console.error('포인트 차감 중 오류 발생:', error);
    return res.status(500).json({
      message: '포인트 차감 중 오류가 발생했습니다.',
    });
  }
};

// 해당 주(월요일~일요일)에 사용자가 획득한 포인트를 계산하는 함수
exports.getWeeklyPoints = async (signId) => {
  const today = dayjs();
  
  const startOfWeek = today.startOf('week').add(1, 'day').toDate(); 
  const endOfWeek = today.endOf('week').add(1, 'day').toDate();

  const pointsThisWeek = await Point.sum('point_num', {
    where: {
      user_id: signId, 
      createdAt: {
        [Op.between]: [startOfWeek, endOfWeek],
      },
    },
  });

  return pointsThisWeek || 0;
};