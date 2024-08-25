const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // .env 파일에서 JWT_SECRET 가져오기

exports.verifyToken = (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(403).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET); // 'Bearer ' 부분 제거하고 검증
        res.locals.decoded = decoded;
        return next(); 
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(419).json({
                code: 419,
                message: '토큰이 만료되었습니다',
            });
        }
        return res.status(401).json({
            code: 401,
            message: '유효하지 않은 토큰입니다',
        });
    }
};
