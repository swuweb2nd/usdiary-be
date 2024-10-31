const cron = require('node-cron');
const { User } = require('../models');
const { checkAndUpgradeTier } = require('../services/tierService');

// 매일 자정(00:00)에 실행되는 스케줄러
cron.schedule('0 0 * * *', async () => {
  

  try {
    // 모든 사용자 조회
    const users = await User.findAll();

    // 각 사용자에 대해 등급 확인 및 승급/강등 처리
    for (const user of users) {
      await checkAndUpgradeTier(user);
    }

    
  } catch (error) {
    console.error('자동 승급 및 강등 처리 중 오류 발생:', error);
  }
});
