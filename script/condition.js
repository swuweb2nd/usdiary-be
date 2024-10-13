const conditions = [
    {
      condition_id: 1,
      tier_id: 2, // 2단계 조건
      condition_type: '가입 기간',
      condition_value: 14, // 2주 = 14일
    },
    {
      condition_id: 2,
      tier_id: 2,
      condition_type: '일기 작성',
      condition_value: 7, // 최소 7회 작성
    },
    {
      condition_id: 3,
      tier_id: 3, // 3단계 조건
      condition_type: '가입 기간',
      condition_value: 60, // 2달 = 60일
    },
    {
      condition_id: 4,
      tier_id: 3,
      condition_type: '일기 작성',
      condition_value: 10, // 한 달에 일기 10회
    },
    {
      condition_id: 5,
      tier_id: 3,
      condition_type: '반대 성향 댓글 작성',
      condition_value: 10, // 반대 성향 댓글 10개
    },
    {
      condition_id: 6,
      tier_id: 4, // 4단계 조건
      condition_type: '가입 기간',
      condition_value: 90, // 3달 = 90일
    },
    {
      condition_id: 7,
      tier_id: 4,
      condition_type: '일기 작성',
      condition_value: 15, // 한 달에 일기 15회
    },
  ];
  
  conditions.forEach(async (condition) => {
    await db.Condition.create(condition);
  });
  