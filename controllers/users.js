const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const dotenv = require('dotenv');
const { google } = require('googleapis');

dotenv.config();

// 로그인
exports.login = async (req, res) => {
    const { sign_id, password } = req.body;

    try {
        if (!sign_id || !password) {
            return res.status(400).json({ message: '아이디와 비밀번호는 필수 입력 사항입니다.' });
        }

        const user = await User.findOne({ where: { sign_id } });

        if (!user) {
            return res.status(401).json({ message: '존재하지 않는 아이디입니다.' });
        }

        console.log('User found:', user.sign_id);

        const isPasswordValid = await bcrypt.compare(password, user.user_pwd);

        if (!isPasswordValid) {
            console.log('Invalid password.');
            return res.status(401).json({ message: '잘못된 비밀번호입니다.' });
        }

        console.log('Password validated successfully.');

        const token = jwt.sign(
            { userId: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' } // 토큰 24시간 만료
        );

        res.json({ message: '로그인 성공', token });
    } catch (error) {
        console.error('로그인 처리 중 오류 발생:', error);
        res.status(500).json({ message: '내부 서버 오류입니다.' });
    }
};

// 아이디 찾기
exports.findId = async (req, res) => {
    const { user_name, user_email, user_birthday } = req.body;

    try {
        // 입력된 user_birthday를 문자열로 처리
        const formattedBirthday = typeof user_birthday === 'string'
            ? user_birthday.split('T')[0]  // 'T'로 나누고 날짜 부분만 사용
            : new Date(user_birthday).toISOString().split('T')[0]; // Date 객체라면 변환

        const user = await User.findOne({
            where: {
                user_name: user_name,
                user_email: user_email,
                user_birthday: formattedBirthday
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "사용자 정보와 일치하는 계정이 없습니다."
            });
        }

        res.status(200).json({
            message: `${user_name}님의 아이디입니다.`,
            sign_id: user.sign_id
        });

    } catch (error) {
        console.error('ID 찾기 중 오류 발생:', error);
        res.status(500).json({
            message: "서버 내부 오류"
        });
    }
};

// 비밀번호 찾기
const generateTemporaryPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};

exports.findPwd = async (req, res) => {
    const { user_name, sign_id, user_email } = req.body;

    try {
        const user = await User.findOne({
            where: {
                user_name: user_name,
                sign_id: sign_id,
                user_email: user_email
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "사용자 정보와 일치하는 계정이 없습니다."
            });
        }

        const temporaryPassword = generateTemporaryPassword();
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        await user.update({ user_pwd: hashedPassword });

        res.status(200).json({
            message: `${user_name}님의 임시 비밀번호입니다. 로그인 후 비밀번호를 변경해주세요.`,
            temporaryPassword: temporaryPassword
        });

    } catch (error) {
        console.error('비밀번호 찾기 중 오류 발생:', error);
        res.status(500).json({
            message: "서버 내부 오류"
        });
    }
};

// 유저 성향 업데이트
exports.updateTendency = async (req, res) => {
    try {
        const { user_id } = req.params; 
        const { user_tendency } = req.body; 

        const decoded = res.locals.decoded;

        if (decoded.userId !== parseInt(user_id, 10)) {
            return res.status(403).json({ message: '잘못된 사용자 ID입니다.' });
        }

        // 유저 확인
        const user = await User.findByPk(user_id);
        console.log('User found:', user);

        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        // 유저 가입 후 경과 일수 계산
        const createdAt = new Date(user.createdAt); 
        const now = new Date(); 

        const diffTime = now - createdAt; 
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays > 7) {
            return res.status(403).json({ message: '가입 후 7일 이내에만 성향을 변경할 수 있습니다.' });
        }

        user.user_tendency = user_tendency;
        await user.save();

        return res.status(200).json({ message: '성향이 성공적으로 수정되었습니다.', user });
    } catch (error) {
        console.error('유저 성향 선택 중 오류발생', error);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// Google 로그인 페이지로 리디렉션
exports.getLoginPage = (req, res) => {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        "http://localhost:3001/users/login/google/callback" // Redirect URI
    );

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
    });

    res.redirect(authUrl);
};


// Google OAuth 2.0 콜백 처리
exports.googleCallback = async (req, res) => {
    try {
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            "http://localhost:3001/users/login/google/callback"
        );

        // 인증 코드 확인
        console.log('Google OAuth 2.0 Authorization Code:', req.query.code);
        
        const { tokens } = await oauth2Client.getToken(req.query.code);
        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2',
        });

        const userInfo = await oauth2.userinfo.get();
        const { email, name, given_name } = userInfo.data;

        // 데이터베이스에서 해당 이메일을 가진 사용자 확인
        let user = await User.findOne({ where: { user_email: email } });

        if (user) {
            // 이미 Google 계정으로 가입된 사용자일 때 로그인 처리
            console.log('Google 계정으로 이미 가입된 사용자입니다:', user.user_email);

            const token = jwt.sign(
                { userId: user.user_id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' } // 토큰 24시간 만료
            );

            res.status(200).json({ message: 'Google 로그인 성공', token });
        } else {
            // 신규 사용자로 데이터베이스에 저장
            const newUser = await User.create({
                user_email: email,
                user_name: name || given_name,
                sign_id: `google_${userInfo.data.id}`, // Google 계정의 고유 ID를 sign_id로 사용
                user_pwd: 'google_auth', // 더미 데이터 저장
                user_gender: 1, //기본값설정
                user_birthday: '2000-01-01', //기본값설정
                user_nick: '어스' //기본값설정
            });

            console.log('신규 사용자로 Google 계정 등록:', newUser.user_email);

            const token = jwt.sign(
                { userId: newUser.user_id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' } // 토큰 24시간 만료
            );

            res.status(201).json({ message: 'Google 계정으로 신규 가입 및 로그인 성공', token });
        }

    } catch (error) {
        console.error('Google OAuth 2.0 콜백 처리 중 오류 발생:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
