const multer = require("multer"); //multer 패키지 참조
const path = require("path");
const fs = require("fs");

const days = new Date().toLocaleDateString().replace(/\./g, "").replace(/ /g, ""); // 20230615 형식의 현재 시간 나타내기

// 업로드 디렉토리 확인 및 생성
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../images'));
    },
    filename: function (req, file, cb) {
      cb(null, days + " - " + file.originalname);
    },
  });
  

const upload = multer({ storage: storage });

module.exports = upload;