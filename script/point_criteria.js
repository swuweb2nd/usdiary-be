const { PointCriteria } = require('../models');
const pointCriteriaList = [
   //포인트 획득 기준
  {
    criteria_id: 1,
    content: '글쓰기',       
    remark: '일기 작성',
    points: 1,
  },
  {
    criteria_id: 2,
    content: '연속 글쓰기',     // 다음날 연속 작성일 경우
    remark: '연속으로 일기 작성',
    points: 2, 
  },
  {
    criteria_id: 3,
    content: '콘텐츠 사용',
    remark: '오늘의 답변, 오늘의 장소, 투두 혹은 루틴 사용 시',
    points: 1,
  },
  {
    criteria_id: 4,
    content: '일기에 좋아요',
    remark: '5개당 1점씩/ 일주일에 최대 5점',
    points: 1,
  },
  {
    criteria_id: 5,
    content: '일기에 댓글',
    remark: '3개당 1점씩/ 일주일에 최대 5점',
    points: 1,
  },
  {
    criteria_id: 6,
    content: '일기에 사진 3장 이상 첨부 시',
    remark: '일기 작성 시 사진 3장 이상 첨부할 때 추가 포인트',
    points: 1, 
  },
  {
    criteria_id: 7,
    content: '서로 무너 관계 맺기',      
    remark: '5명당 2점씩 획득',
    points: 2,
  },

  //포인트 차감 기준
  {
    criteria_id: 8,
    content: '게시글 신고',
    remark: '운영자에 의해 삭제당했을 때',
    points: -10,
  },
  {
    criteria_id: 9,
    content: '댓글 신고',
    remark: '',
    points: -5,
  },
  {
    criteria_id: 10,
    content: '반복적인 신고 접수',
    remark: '3번 이상 신고 당했을 경우',
    points: -15,
  },
  {
    criteria_id: 11,
    content: '허위 신고',
    remark: '',
    points: -10,
  },
];

const insertPointCriteria = async () => {
  try {
    for (const criteria of pointCriteriaList) {
      await PointCriteria.create(criteria); // 각 기준을 데이터베이스에 삽입
    }
    console.log('포인트 기준이 성공적으로 삽입되었습니다.');
  } catch (error) {
    console.error(`포인트 기준 삽입 중 오류 발생: ${error.message}`);
  }
};

// 데이터베이스 동기화 이후 데이터 삽입
insertPointCriteria();