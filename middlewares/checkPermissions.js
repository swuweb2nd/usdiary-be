// middleware/checkPermissions.js
const tierPermissions = require('../utils/permissions');

const checkPermissions = (permission) => {
  return (req, res, next) => {
    const tierId = res.locals.decoded.user.tier_id; // 로그인한 사용자 등급 가져오기

    // 해당 등급에서 해당 권한이 있는지 확인
    const hasPermission = tierPermissions[tierId] && tierPermissions[tierId][permission];

    if (!hasPermission) {
      return res.status(403).json({ message: 'Access denied: insufficient privileges' });
    }

    next(); // 권한이 있으면 다음 미들웨어로
  };
};

module.exports = checkPermissions;
