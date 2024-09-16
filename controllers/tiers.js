async function checkTierUpgrade(userId) {
    const user = await db.User.findByPk(userId);
    const userConditions = await db.UserCondition.findAll({ where: { user_id: userId } });
  
    // 각 조건을 체크하여 등급이 변경될 수 있는지 확인
    const currentTierId = user.tier_id;
    const nextTier = await db.Tier.findOne({ where: { tier_id: currentTierId + 1 } });
    
    if (nextTier) {
      const conditions = await db.Condition.findAll({ where: { tier_id: nextTier.tier_id } });
  
      // 모든 조건을 충족하는지 확인
      let canUpgrade = true;
      for (const condition of conditions) {
        const userCondition = userConditions.find(uc => uc.condition_id === condition.condition_id);
        if (!userCondition || userCondition.condition_value < condition.condition_value) {
          canUpgrade = false;
          break;
        }
      }
  
      // 조건을 모두 충족하면 승급 처리
      if (canUpgrade) {
        await db.User.update({ tier_id: nextTier.tier_id }, { where: { user_id: userId } });
        await db.TierLog.create({ user_id: userId, prev_tier: currentTierId, new_tier: nextTier.tier_id });
        console.log(`User ${userId} upgraded to tier ${nextTier.tier_name}`);
      }
    }
  }
  