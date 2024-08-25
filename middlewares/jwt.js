const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // .env 파일에서 JWT_SECRET 가져오기

exports.verifyToken = (req, res, next) => {
    try {
        // 요청 헤더에서 토큰 가져오기
        const token = req.headers['authorization'];

        if (!token) {
        return res.status(403).json({ message: 'No token provided' });
        }

        // JWT 검증
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.locals.decoded = decoded; // 디코딩된 정보를 res.locals에 저장
        return next(); 
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
        // 토큰이 만료된 경우
        return res.status(419).json({
            code: 419,
            message: '토큰이 만료되었습니다',
        });
        }
        // 유효하지 않은 토큰일 경우
        return res.status(401).json({
        code: 401,
        message: '유효하지 않은 토큰입니다',
        });
    }
};