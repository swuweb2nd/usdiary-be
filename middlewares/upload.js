const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 업로드 디렉토리 생성 함수
const createUploadDirectory = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    let uploadPath;
    if (file.fieldname === 'answer_photo') {
      uploadPath = path.join(__dirname, '../uploads/answers');
    } else if (file.fieldname === 'photos') {
      uploadPath = path.join(__dirname, '../uploads/diaries');
    } else {
      uploadPath = path.join(__dirname, '../uploads');
    }
    createUploadDirectory(uploadPath);
    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// 파일 필터 함수 추가
const fileFilter = (req, file, cb) => {
  // 이미지 파일만 허용
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('이미지 파일만 업로드 가능합니다.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// 미들웨어 함수로 래핑
const uploadSingle = (req, res, next) => {
  upload.single('answer_photo')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer 에러 처리
      return res.status(400).json({ 
        message: '파일 업로드 중 오류가 발생했습니다.',
        error: err.message 
      });
    } else if (err) {
      // 기타 에러 처리
      return res.status(400).json({ 
        message: '파일 업로드 중 오류가 발생했습니다.',
        error: err.message 
      });
    }
    next();
  });
};

const uploadMultiple = upload.array('photos', 5);

module.exports = { uploadSingle, uploadMultiple };
