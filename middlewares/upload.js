const multer = require('multer');
const path = require('path');

// 저장소 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 업로드된 파일이 저장될 폴더
  },
  filename: (req, file, cb) => {
    // 업로드된 파일의 고유한 파일명 생성
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// multer 초기화
const upload = multer({ storage: storage });

module.exports = upload;
