const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const dotenv = require('dotenv');
const { sequelize } = require('../models');

dotenv.config();

//로그인
exports.login = async (req, res) => {
    const { sign_id, user_pwd } = req.body;

    console.log('Request body:', req.body); // 요청 본문 로그

    try {
        if (!sign_id || !user_pwd) {
            return res.status(400).json({ message: '아이디와 비밀번호는 필수 입력 사항입니다.' });
        }

        const user = await User.findOne({ where: { sign_id } });

        if (!user) {
            return res.status(401).json({ message: '잘못된 아이디입니다.' });
        }

        const isPasswordValid = await bcrypt.compare(user_pwd, user.user_pwd);

        if (!isPasswordValid) {
            return res.status(401).json({ message: '잘못된 비밀번호입니다.' });
        }

        const token = jwt.sign(
            { sign_id: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' } // 토큰 24시간 만료
        );

        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error.message, error.stack);
        res.status(500).json({ message: '내부 서버 오류입니다.' });
    }
};

//아이디찾기
exports.findId = async (req, res) => {
    const { user_name, user_email, user_birthday } = req.body;

    try {

        const user = await User.findOne({
            where: {
                user_name,
                user_email,
                user_birthday: sequelize.where(sequelize.fn('DATE', sequelize.col('user_birthday')), '=', user_birthday) // 날짜 형식 조정: user_birthday와 일치하는 날짜만 조회
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "사용자 정보와 일치하는 계정이 없습니다."
            });
        }

        res.status(200).json({
            sign_id: user.sign_id  // 사용자 ID 반환
        });

    } catch (error) {
        console.error('ID 찾기 중 오류 발생:', error);
        res.status(500).json({
            message: "서버 내부 오류"
        });
    }
};
