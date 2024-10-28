const { User, Diary, TierLog } = require('../models');
const { Op } = require('sequelize');

exports.checkAndUpgradeTier = async (user) => {
  const userId = user.user_id;
  const previousTierId = user.tier_id; // 기존 등급

  // 가입 기간 확인
  const today = new Date();
  const joinedDuration = Math.floor((today - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)); // 가입일로부터 경과된 일 수

  // 이번 달 일기 작성 횟수 확인
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const diaryCount = await Diary.count({
    where: {
      user_id: userId,
      createdAt: {
        [Op.gte]: startOfMonth, // 이번 달에 작성된 일기만 카운트
      },
    },
  });

  // 현재 등급에 따른 승급 조건 확인 및 등급 업데이트
  if (user.tier_id === 1 && joinedDuration >= 14 && diaryCount >= 7) {
    user.tier_id = 2; // 2단계로 승급
  } else if (user.tier_id === 2 && joinedDuration >= 60 && diaryCount >= 10) {
    user.tier_id = 3; // 3단계로 승급
  } else if (user.tier_id === 3 && joinedDuration >= 90 && diaryCount >= 15) {
    user.tier_id = 4; // 4단계로 승급
  } else if (diaryCount < requiredDiaryCountForTier(user.tier_id)) {
    user.tier_id = Math.max(1, user.tier_id - 1); // 일기 미달 시 등급 강등
  }

  await user.save(); // 사용자 정보 업데이트
  return previousTierId !== user.tier_id;
};

// 등급별 필요한 일기 횟수
function requiredDiaryCountForTier(tierId) {
  if (tierId === 2) return 7;
  if (tierId === 3) return 10;
  if (tierId === 4) return 15;
  return 0;
}

exports.logTierChange = async (userId, previousTierId, newTierId) => {
  await TierLog.create({
    user_id: userId,
    previous_tier: previousTierId,
    new_tier: newTierId,
    change_date: new Date(),
  });
};
