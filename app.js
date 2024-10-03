const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require('./swagger/swagger-output.json')
const cors = require('cors');
const permissionRoutes = require('./routes/checkPermissions');
const diaryRoutes = require('./routes/diary');
const userRoutes = require('./routes/users'); 
const registerRoutes = require('./routes/register'); 
const commentRoutes = require('./routes/comment'); 
const contentRoutes = require('./routes/contents');
const friendRoutes = require('./routes/friends');
const mypageRoutes = require('./routes/mypage');
const likeRoutes = require('./routes/like');
const pointRoutes = require('./routes/point');
const reportRoutes = require('./routes/reports');

const { sequelize } = require('./models'); // db.sequelize 객체
app.use(cors({
  origin: 'http://localhost:3000', // 허용할 출처
  methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE','OPTIONS'], // 허용할 HTTP 메서드
  credentials: true // 필요한 경우 인증 정보 허용
}));

app.set('port', process.env.PORT || 3001);


// 데이터베이스 연결
sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터 베이스 연결 성공');
  })
  .catch((err) => {
    console.log(err);
  });

// 미들웨어 설정
app.use(morgan('dev'));

app.use(express.json()); // JSON 요청 파싱 미들웨어 추가
// 정적 파일 제공 설정
app.use('/uploads', express.static(path.join(__dirname, 'images')));


// 라우팅
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile)) // docs 대신 swagger로 수정한다.
app.use('/diaries', diaryRoutes);
app.use('/users', userRoutes);
app.use('/register', registerRoutes);
app.use('/diaries', commentRoutes);
app.use('/contents', contentRoutes);
app.use('/friends', friendRoutes);
app.use('/checkPermissions', permissionRoutes);
app.use('/mypages', mypageRoutes);
app.use('/like', likeRoutes);
app.use('/points', pointRoutes)
app.use('/reports', reportRoutes);

// 404 오류 처리
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

// 오류 처리
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// 서버 시작
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});
