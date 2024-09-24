const multer = require("multer"); // multer 패키지 참조
const path = require("path");
const fs = require("fs");

// 현재 시간 + 파일명으로 유니크한 파일 이름 생성
const days = new Date().toISOString().replace(/:/g, "").split("T")[0]; // 20230615 형식의 현재 시간 나타내기

// 업로드 디렉토리 확인 및 생성
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 파일 저장 경로 설정 (여기서는 images 폴더에 저장)
    const uploadPath = path.join(__dirname, '../images');
    
    // 폴더가 존재하지 않으면 생성
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // 파일 이름을 현재 날짜와 파일 원본 이름으로 설정 (중복 방지)
    cb(null, days + "-" + Date.now() + "-" + file.originalname);
  },
});

// 여러 파일을 동시에 업로드할 수 있도록 설정 (최대 10개의 파일)
const upload = multer({ storage: storage }).array('photos', 5);

module.exports = upload;
