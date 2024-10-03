const bcrypt = require('bcrypt');
const crypto = require('crypto');
const validator = require('validator');
const { User } = require('../models');
const { sendVerificationEmail } = require('../utils/mail'); 

const verificationCodes = new Map();

// 이메일 유효성 검사 함수
const validateEmail = (user_email) => {
    return user_email && validator.isEmail(user_email);
};

// 이메일 인증 코드 전송
exports.sendVerificationCode = async (req, res) => {
    const { user_email } = req.body;

    if (!user_email) {
        return res.status(400).json({ message: '이메일을 입력하세요.' });
    }

    if (!validateEmail(user_email)) {
        return res.status(400).json({ message: '유효하지 않은 이메일 주소입니다.' });
    }

    try {
        const existingUser = await User.findOne({ where: { user_email: user_email } });
        if (existingUser) {
            return res.status(400).json({ message: '이미 등록된 이메일입니다.' });
        }

        const verificationToken = crypto.randomBytes(3).toString('hex');
        verificationCodes.set(user_email, {
            code: verificationToken,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes expiry
        });

        // 이메일 전송
        await sendVerificationEmail(user_email, verificationToken);
        res.status(200).json({ message: '이메일을 확인하세요.', verificationCode: verificationToken });
    } catch (error) {
        res.status(500).json({ message: '이메일 인증 중 오류가 발생했습니다.', error: error.message });
    }
};

// 인증 코드 확인
exports.verifyCode = async (req, res) => {
    const { user_email, verificationCode } = req.body;

    if (!user_email || !verificationCode) {
        return res.status(400).json({ success: false, message: '이메일과 인증번호를 입력하세요.' });
    }

    try {
        const storedCode = verificationCodes.get(user_email);

        if (!storedCode) {
            return res.status(400).json({ success: false, message: '이메일에 대한 인증번호가 없습니다.' });
        }

        if (storedCode.code !== verificationCode) {
            return res.status(400).json({ success: false, message: '인증번호가 일치하지 않습니다.' });
        }

        if (storedCode.expiresAt < new Date()) {
            return res.status(400).json({ success: false, message: '인증번호가 만료되었습니다.' });
        }

        verificationCodes.delete(user_email);

        res.status(200).json({ success: true, message: '인증번호가 확인되었습니다. 회원 가입을 계속 진행하세요.' });
    } catch (error) {
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.', error: error.message });
    }
};

// 회원 가입
exports.register = async (req, res) => {
    const { sign_id, user_phone, user_nick, user_email, user_pwd, user_name, verificationCode, confirmPassword, phone, user_birthday, user_gender } = req.body;

    if (!sign_id || !user_nick || !user_email || !user_pwd || !user_name  || !phone || !user_birthday || !user_gender) {
        return res.status(400).json({ message: '모든 필드를 입력해야 합니다.' });
    }

    if (!validateEmail(user_email)) {
        return res.status(400).json({ message: '유효하지 않은 이메일 주소입니다.' });
    }

    if (user_pwd.length < 6) {
        return res.status(400).json({ message: '비밀번호는 6자 이상이어야 합니다.' });
    }

    if (user_pwd !== confirmPassword) {
        return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    try {
        const storedCode = verificationCodes.get(user_email);
        console.log(storedCode)
        console.log(verificationCode)
        // if (!storedCode || storedCode.code !== verificationCode || storedCode.expiresAt < new Date()) {
        //     return res.status(400).json({ message: '유효하지 않거나 만료된 인증번호입니다.' });
        // }

        verificationCodes.delete(user_email);

        const hashedPassword = await bcrypt.hash(user_pwd, 10);

        const newUser = await User.create({
            sign_id: sign_id,
            user_nick: user_nick,
            user_pwd: hashedPassword,
            user_email: user_email,
            user_name: user_name,
            user_phone: user_phone,
            user_gender: user_gender === 'male' ? true : false,
            user_birthday: new Date(user_birthday),
            verificationToken: crypto.randomBytes(32).toString('hex'),
            isVerified: true
        });

        res.status(201).json({ message: '회원가입이 완료되었습니다.' , data: { newUser }});
    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
    }
};

// 아이디 중복 확인
exports.checkId = async (req, res) => {
    const { uid } = req.query;

    if (!uid) {
        return res.status(400).json({ message: '아이디를 입력하세요.' });
    }

    const decodedUid = decodeURIComponent(uid);

    try {
        const existingUser = await User.findOne({
            where: {
                sign_id: decodedUid
            } 
        });

        if (existingUser) {
            return res.status(400).json({ message: '이미 사용 중인 아이디입니다.' });
        }

        res.status(200).json({ message: '사용 가능한 아이디입니다.' });
    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
    }
};

// 닉네임 중복 확인
exports.checkNickname = async (req, res) => {
    const { unick } = req.query;

    if (!unick) {
        return res.status(400).json({ message: '닉네임을 입력하세요.' });
    }

    const decodedUnick = decodeURIComponent(unick);

    try {
        const existingUser = await User.findOne({
            where: {
                user_nick: decodedUnick
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: '이미 사용 중인 닉네임입니다.' });
        }

        res.status(200).json({ message: '사용 가능한 닉네임입니다.' });
    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
    }
};
