exports.uploadFile = async (req, res, next) => {
    try {
      var param = {
        file: req.file,
      };
  
      return res.json({
        resultCode: 200,
        resultMsg: "파일 업로드 성공",
      });
    } catch (error) {
      next(error);  // Error handling middleware로 넘기기
    }
  };
