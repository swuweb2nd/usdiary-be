// utils/permissions.js
const tierPermissions = {
  1: { // 1단계: 초승달 - 가입 회원
    name: "초승달",
    canViewOppositePage: false,
    canWriteOppositePage: false,
    canUseCommunity: false,
    canUseFollow: false,
    privateDiaryLimit: 0,
  },
  2: { // 2단계: 상현달
    name: "상현달",
    canViewOppositePage: true, // 조회, 댓글 가능
    canWriteOppositePage: false, // 게시글 작성 불가
    canUseCommunity: true,
    canUseFollow: true,
    privateDiaryLimit: 0,
  },
  3: { // 3단계: 보름달
    name: "보름달",
    canViewOppositePage: true,
    canWriteOppositePage: true, // 게시글 작성 3회 가능
    writeLimit: 3, // 게시글 작성 제한 3회
    canUseCommunity: true,
    canUseFollow: true,
    canBuyTendencyChange: true, // 성향 바꾸기 가능
    privateDiaryLimit: 0,
  },
  4: { // 4단계: 그믐달
    name: "그믐달",
    canViewOppositePage: true,
    canWriteOppositePage: true,
    writeLimit: Infinity, // 게시글 작성 제한 없음
    canUseCommunity: true,
    canUseFollow: true,
    canBuyTendencyChange: true,
    privateDiaryLimit: 3, // 나만 보기권 제공
  },
};

module.exports = tierPermissions;
