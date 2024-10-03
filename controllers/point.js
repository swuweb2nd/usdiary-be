const PointCriteria = require('../models/point_criteria');
const { Op } = require("sequelize");
const dayjs = require("dayjs");

// 포인트 획득 및 차감 기준 등록
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

// 포인트 획득 및 차감 기준 수정
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

// 포인트 획득 및 차감 기준 삭제
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
exports.gainPoints = async (req, res, activity, pointsEarned = null) => {
  try {
    const signId = res.locals.decoded.sign_id; // JWT에서 사용자 sign_id 가져오기

    // 포인트 기준 테이블에서 해당 활동에 대한 포인트 기준을 찾음
    const criteria = await PointCriteria.findOne({ where: { content: activity } });

    if (!criteria && pointsEarned === null) {
      return res.status(404).json({
        status: 404,
        message: '해당 활동에 대한 포인트 기준이 없습니다.',
        data: null,
      });
    }

    // 유저의 포인트 업데이트
    const user = await User.findOne({ where: { sign_id: signId } });
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: '사용자를 찾을 수 없습니다.',
        data: null,
      });
    }

    // 기존 포인트에 기준에 따라 포인트 추가, pointsEarned가 주어진 경우 이를 사용
    const pointsToAdd = pointsEarned !== null ? pointsEarned : criteria.points;
    user.user_point += pointsToAdd;

    // 변경된 포인트 저장
    await user.save();

    return res.status(200).json({
      status: 200,
      message: `${pointsToAdd}점 획득했습니다.`,
      data: {
        points: user.user_point,
      },
    });
  } catch (error) {
    console.error('포인트 획득 중 오류 발생:', error);
    return res.status(500).json({
      status: 500,
      message: '포인트 획득 중 오류가 발생했습니다.',
      data: null,
    });
  }
};

// 포인트 차감 함수
exports.deductPoints = async (req, res, activity) => {
  try {
    const signId = res.locals.decoded.sign_id; // JWT에서 사용자 sign_id 가져오기

    // 포인트 기준 테이블에서 해당 활동에 대한 포인트 기준을 찾음
    const criteria = await PointCriteria.findOne({ where: { content: activity } });

    if (!criteria) {
      return res.status(404).json({
        status: 404,
        message: '해당 활동에 대한 포인트 기준이 없습니다.',
        data: null,
      });
    }

    // 유저의 포인트 업데이트
    const user = await User.findOne({ where: { sign_id: signId } });
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: '사용자를 찾을 수 없습니다.',
        data: null,
      });
    }

    // 기존 포인트에 기준에 따라 포인트 차감
    user.user_point -= Math.abs(criteria.points); // 차감 시 절대값으로 처리

    // 변경된 포인트 저장
    await user.save();

    return res.status(200).json({
      status: 200,
      message: `${Math.abs(criteria.points)}점 차감되었습니다.`,
      data: {
        points: user.user_point,
      },
    });
  } catch (error) {
    console.error('포인트 차감 중 오류 발생:', error);
    return res.status(500).json({
      status: 500,
      message: '포인트 차감 중 오류가 발생했습니다.',
      data: null,
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