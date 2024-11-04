const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require('./swagger/swagger-output.json')

// 라우팅
// Place Swagger setup at the top of routes


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
const qnaRoutes = require('./routes/qna');
const noticeRoutes = require('./routes/notice');

const { sequelize } = require('./models'); // db.sequelize 객체


app.use(cors({
  origin: ['http://localhost:3001', 'https://api.usdiary.site'], // 배포된 도메인 추가
  methods: 'GET, POST, DELETE, PATCH, OPTIONS',
  allowedHeaders: 'Content-Type, Authorization',
}));
app.use(
  '/swagger',
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile, {
      swaggerOptions: {
          url: '/swagger/swagger-output.json', // swagger-output.json의 URL
          layout: "StandaloneLayout"
      }
  })
);



app.set('port', process.env.PORT || 3000);


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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




// docs 대신 swagger로 수정한다.
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
app.use('/qnas', qnaRoutes);
app.use('/notice', noticeRoutes);

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

});

// 서버 시작
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});