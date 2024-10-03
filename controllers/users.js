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
            return res.status(401).json({ message: '존재하지 않는 아이디입니다.'});
        }

        console.log('User found:', user.sign_id);

        const isPasswordValid = await bcrypt.compare(password, user.user_pwd);

        if (!isPasswordValid) {
            console.log('Invalid password.');
            return res.status(401).json({ message: '잘못된 비밀번호입니다.' });
        }

        console.log('Password validated successfully.');
               
         // 로그인 성공 시 최근 접속일 업데이트
        await user.update({ last_login: new Date() });
        const token = jwt.sign(
            { sign_id: user.sign_id }, // sign_id를 JWT 토큰에 포함
            process.env.JWT_SECRET,
            { expiresIn: '24h' } // 토큰 24시간 만료
        );

        res.json({ message: '로그인 성공', data: { token ,user,last_login: user.last_login } });
    } catch (error) {
        console.error('로그인 처리 중 오류 발생:', error);
        res.status(500).json({ message: '내부 서버 오류입니다.' });
    }
};

// 아이디 찾기
exports.findId = async (req, res) => {
    const { user_name, user_email, user_birthday } = req.body;

    try {
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
            data: { sign_id: user.sign_id }
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
        console.log(temporaryPassword)
        res.status(200).json({
            message: `${user_name}님의 임시 비밀번호입니다. 로그인 후 비밀번호를 변경해주세요.`,
            data: { temporaryPassword }
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
        const { sign_id } = req.params;  // URL 파라미터에서 sign_id 가져오기
        const { selection } = req.body;  

        const decoded = res.locals.decoded;

        if (decoded.sign_id !== sign_id) { // JWT의 sign_id와 URL 파라미터의 sign_id 비교
            return res.status(403).json({ message: '잘못된 사용자 ID입니다.' });
        }

        const user = await User.findOne({ where: { sign_id } }); // sign_id로 사용자 조회

        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        const createdAt = new Date(user.createdAt); 
        const now = new Date(); 

        const diffTime = now - createdAt; 
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays > 7) {
            return res.status(403).json({ message: '가입 후 7일 이내에만 성향을 변경할 수 있습니다.' });
        }
        
        let userTendency = null;
        if (selection === 'city') {
            userTendency = '도시';
        } else if (selection === 'forest') {
            userTendency = '숲';
        } else {
            return res.status(400).json({ message: '잘못된 성향 선택입니다.' });
        }

        user.user_tendency = userTendency;
        await user.save();

        return res.status(200).json({ 
            message: '성향이 성공적으로 수정되었습니다.', 
            data: { sign_id: user.sign_id,  // sign_id 반환
            user_tendency: user.user_tendency  }});
    } catch (error) {
        console.error('유저 성향 선택 중 오류 발생:', error);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// Google 로그인 페이지로 리디렉션
exports.getLoginPage = (req, res) => {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        "http://localhost:3001/users/login/google/callback"
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

        console.log('Google OAuth 2.0 Authorization Code:', req.query.code);
        
        const { tokens } = await oauth2Client.getToken(req.query.code);
        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2',
        });

        const userInfo = await oauth2.userinfo.get();
        const { email, name, given_name } = userInfo.data;

        let user = await User.findOne({ where: { user_email: email } });

        if (user) {
            console.log('Google 계정으로 이미 가입된 사용자입니다:', user.user_email);
            // 로그인 성공 시 최근 접속일 업데이트
            await user.update({ last_login: new Date() });
            const token = jwt.sign(
                { sign_id: user.sign_id }, // sign_id로 토큰 발급
                process.env.JWT_SECRET,
                { expiresIn: '24h' } 
            );

            res.status(200).json({ message: 'Google 로그인 성공', data: { token,user,last_login: user.last_login  } });
        } else {
            const newUser = await User.create({
                user_email: email,
                user_name: name || given_name,
                sign_id: `google_${userInfo.data.id}`, 
                user_pwd: 'google_auth',
                user_gender: 1, 
                user_birthday: '2000-01-01', 
                user_nick: '어스' 
            });

            console.log('신규 사용자로 Google 계정 등록:', newUser.user_email);

            const token = jwt.sign(
                { sign_id: newUser.sign_id }, // sign_id로 토큰 발급
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({ message: 'Google 계정으로 신규 가입 및 로그인 성공', data: { token,newUser } });
        }

    } catch (error) {
        console.error('Google OAuth 2.0 콜백 처리 중 오류 발생:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
// controllers/permissionsController.js
exports.checkOppositePagePermission = (req, res) => {
    res.json({ canAccess: true });
  };
  

// 로그아웃
exports.logout = (req, res) => {
    try {
        // 쿠키에 저장된 토큰을 삭제하는 경우
        res.clearCookie('token'); 

        res.status(200).json({ message: '성공적으로 로그아웃되었습니다.' });
    } catch (error) {
        console.error('로그아웃 처리 중 오류 발생:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};
