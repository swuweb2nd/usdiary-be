const tiers = [
    {
      tier_id: 1,
      tier_name: '가입 회원',
      tier_benefit: '기본 등급, 혜택 없음',
    },
    {
      tier_id: 2,
      tier_name: '2단계',
      tier_benefit: '반대 페이지 조회 및 댓글 작성 가능, 친구 커뮤니티, 팔로우 팔로잉 가능',
    },
    {
      tier_id: 3,
      tier_name: '3단계',
      tier_benefit: '반대 페이지 게시글 작성 3회권, 포인트로 성향 바꾸기권 구매 가능',
    },
    {
      tier_id: 4,
      tier_name: '4단계',
      tier_benefit: '1달에 3개의 나만 보기권 제공',
    },
  ];
  
  tiers.forEach(async (tier) => {
    await db.Tier.create(tier);
  });
  