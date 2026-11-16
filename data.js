/* =========================================================
   누구랑 예시 데이터 (data.js)
   - 실제 판매 상품이 아닌 과제용 예시 데이터입니다.
   - 다른 페이지(shop, detail, calendar 등)도 이 데이터를 함께 씁니다.
   ========================================================= */

// 상품 유형
const TYPES = {
  workshop:   { name: "공방",   page: "workshop.html",   categories: ["도자기", "가죽", "향수·캔들", "목공", "반지·액세서리", "유리"] },
  class:      { name: "클래스", page: "class.html",      categories: ["쿠킹·베이킹", "드로잉·캘리그라피", "플라워", "커피·음료", "댄스·운동"] },
  experience: { name: "체험",   page: "experience.html", categories: ["2인 데이트", "가족 나들이", "어린이 체험", "여행 체험", "지역체험"] },
  lecture:    { name: "강의",   page: "lecture.html",    categories: ["취미·교양", "사진·영상", "자기계발", "어린이 교육"] }
};

// 동행 태그
const COMPANIONS = {
  date:   { name: "2인 데이트",   emoji: "👫", desc: "분위기 좋은 커플링 공방, 둘만의 감성 도자기 체험" },
  friend: { name: "친구 모임",   emoji: "👭", desc: "여럿이 함께 즐기는 디저트 베이킹 & 힐링 공방" },
  family: { name: "가족 · 부모님", emoji: "👨‍👩‍👧", desc: "부담 없는 난이도의 다도 클래스 & 원목 공예" },
  kids:   { name: "어린이 동반", emoji: "👶", desc: "아이 눈높이에 맞춘 안전한 키즈 아트 & 비누 만들기" }
};

// 환불 안심 등급 (기획서 1-6 ②)
const REFUND = {
  safe:   { name: "안심 환불", className: "safe",   rule: "체험 2일 전까지 전액 환불, 1일 전 50% 이상 환불" },
  mid:    { name: "보통 환불", className: "mid",    rule: "체험 5일 전까지 전액 환불, 이후 단계적 공제" },
  strict: { name: "엄격 환불", className: "strict", rule: "체험 6일 이상 전에만 전액 환불, 2일 이내 환불 불가" }
};

// 상품 목록
// image: 저장소 images/ 폴더의 사진, imageRemote: 메인 시안의 임시 사진 주소(사진을 올리기 전 대체용)
const PRODUCTS = [
  {
    id: "ws-001", type: "workshop", category: "도자기", with: ["date"],
    title: "[성수] 백자 물레 성형 커플 도자기 클래스",
    region: "서울 성수", price: 40000, basePeople: 2,
    priceNote: "소성·배송비 포함", refund: "safe",
    rating: 4.95, reviewCount: 128, likes: 402,
    image: "images/hero-pottery.jpg",
    imageRemote: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNSxaE2tHfDoWJ6fc7QvcE35jzJpVYhvwBnkU7GJJvxsZfNGe-HDOTeVVD_-OWs-y9xMLRBXw5lvPgia1FgOueM1iiE6-pOUBwgW9Nh2n9PxVnqqbUfx4oMoSQDeX1yhEEWW0BN7Ub08ekF1J1sGcmZq0uj-iQV2rYB6tDfkYmwsjgdHf37d3W-tJFZAgzDkKd66qXqDUBphNxVnQCA35_u4jtvpmMNsPzlln38J8", hero: true, hot: true
  },
  {
    id: "ws-002", type: "workshop", category: "향수·캔들", with: ["date"],
    title: "[성수] 프라이빗 나만의 니치 향수 & 디퓨저 시그니처 조향 클래스",
    region: "서울 성수", price: 45000, basePeople: 2,
    priceNote: "재료비 포함", refund: "safe",
    rating: 4.95, reviewCount: 142, likes: 288,
    image: "images/ws-perfume.jpg",
    imageRemote: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgxJcWf0rRZWItZ85tusGXZruljkWYPWP0VSYa_ybD8dPpgt4DtmQHr9TWRrmrTPt7jEQkL1sHYBt-lPDwknxgvb0p22qeb8Ikhd6XF1gkOo__ciSgD2avttEftbSGshLmr8QJ1mCk-wtAYEXcd-FgKKVP2LaSHQr_oCtuekJm5qiPNT95q-Kr0pqA2PaQHzuBfkP5QgpCo52Y29xvrktKDeRUBmCsB20okd6q7U0", recommend: true
  },
  {
    id: "ws-003", type: "workshop", category: "도자기", with: ["date", "friend"],
    title: "[연남] 1:1 밀착 핸드빌딩 & 전동 물레 원데이 2개 작품 완성반",
    region: "서울 연남", price: 55000, basePeople: 2,
    priceNote: "가마소성 포함", refund: "safe",
    rating: 4.98, reviewCount: 215, likes: 351,
    image: "images/ws-pottery.jpg",
    imageRemote: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8fElnUkpZYXcgasm_6FDuGccBb6V_sdOfxOLKh4M6FsUBLlYSH1LbHwoRzCN2oGtNLRUGcpeWcb3iucCq6qkbcJ_MCoeQm8UVI2JE1NdemvWqj-SisliwWL_W8luPirtMwxZHr2Kq9h5gV9RezE06aqqgoHPeUS4XNLQ92-hrnS6igrq2ItWxl2venj4GODFcWuySI4D6BharOpgGVD9qFKubfO8XuEiH6gJyk30", recommend: true
  },
  {
    id: "ws-004", type: "workshop", category: "반지·액세서리", with: ["date"],
    title: "[한남] 925 실버 커플링 & 우정링 각인 원데이 클래스",
    region: "서울 한남", price: 60000, basePeople: 2,
    priceNote: "은 10g 포함", refund: "mid",
    rating: 4.89, reviewCount: 98, likes: 197,
    image: "images/ws-silver-ring.jpg",
    imageRemote: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbH43zuRI5zWgB9aA588QiywJqdukjtKsb5llp8tog-83mWAHix1-qFO2BALJGnsVSAMgHe1QZKhEC75gATVGX-7zxUFwLxw7h_b-ou-UOpW2EpmrXX-vHLzyvxaXTEBLlaQFb9X2F5NpAGKVWDk5mVdOcIXspKARPj1SNieSS-C-hCXzDOb1iOowG-_6tza2vc0Dxr_GYXS3AdnggfFkYY-bZ2Hsx7IEnoDQ-QS4", recommend: true
  },
  {
    id: "cl-001", type: "class", category: "커피·음료", with: ["family"],
    title: "[북촌] 부모님과 함께하는 전통 한옥 다도 명상 & 계절 화과자 빚기",
    region: "서울 종로", price: 50000, basePeople: 2,
    priceNote: "화과자 4구 포함", refund: "safe",
    rating: 4.97, reviewCount: 180, likes: 233,
    image: "images/cl-tea.jpg",
    imageRemote: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJMR8h17tlkrtf68V152pFvwb5PwXXTpur4gs9StBD_kt_UMRqeAM4xCAmLlnwM7szKGka-58cHxPJ1wOqgW1lm7JsgEkDjiD9amEzh432XwaPktOxjScZxm-sqsoX07bqfZYqJdRkAsTpgDip3XeReTMmYyq1B29xmEPGQQl646qY_QXATSNySLr8dnlBjHbjdgmX7NImVEeWOHVV-JyB0gItPauJloNBQKx5sXw", recommend: true
  },
  {
    id: "cl-002", type: "class", category: "쿠킹·베이킹", with: ["friend"],
    title: "[망원] 쫀득한 프렌치 마카롱 16구 완성 & 캐릭터 데코 베이킹",
    region: "서울 망원", price: 40000, basePeople: 2,
    priceNote: "포장박스 포함", refund: "safe",
    rating: 4.92, reviewCount: 310, likes: 524,
    image: "images/cl-macaron.jpg",
    imageRemote: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHkUBS8lU35tFyP5CjdcVZlNKqxlnNWlhdEhz-mgse89HfhvYG4sttm2wX-XEFG3F2Wc-gdUmWVOjbnK29zRgiUw1jmK5EPfytU5yeoLSuFwDGnpcb_Avm4Hcl4XGSe_-wfc7k4RAw18Ush0hWGXepAOZbey-oWfXW67r_qiiyS-LVR3ydnv6UE0qj_7TkbFifshSu1tkVT_2dIGlszqJVX1T5q49DX0DeUxiYg0w"
  },
  {
    id: "ws-005", type: "workshop", category: "유리", with: ["friend", "date"],
    title: "[판교] 감성 빛을 담은 스테인드글라스 도어벨 & 썬캐쳐 공방",
    region: "경기 판교", price: 48000, basePeople: 2,
    priceNote: "재료비 전액 포함", refund: "safe",
    rating: 4.91, reviewCount: 114, likes: 476,
    image: "images/ws-stained-glass.jpg",
    imageRemote: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXTja8xKOy6MGSsPFQ_KMhcvb1HYEjZ4I76yQ_yj-SAyDck8bwvPwmbU59N3sggNFK_osZBV1USvIG1WyLbUm5RSbPegJ_SoreBCOwFDekD661fvvj-xvK7IsoAPrYyzd778aBDHnhdZ_LSU4NacrI7jTHHPLMD7uowDH0Haz9OtNcdbmjbhBX6pJM1ZJ0j_scI2L22egY3HDwihf8pOqL4sV3B2lAlhTmuIG4RRI"
  },
  {
    id: "ws-006", type: "workshop", category: "목공", with: ["family"],
    title: "[서촌] 호두나무 원목 수저 & 버터나이프 우드카빙 힐링 클래스",
    region: "서울 서촌", price: 35000, basePeople: 2,
    priceNote: "천연오일 마감", refund: "mid",
    rating: 4.88, reviewCount: 86, likes: 431,
    image: "images/ws-wood-carving.jpg",
    imageRemote: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGY2T0oHWAGkwF9KKRy89It97GMJKzJD82Gz8FxJUVOpZ4K9Ckvh5TpUkiupWG1IWTAaXoHq1ZEjrDi8Ry4MnNbAjgpNNi-tbdQqjqG9Sg10ubfQDKwL7h1BUDtHWFUu6bH8kh6QUeYh37VtlaJb3XWw82J9UEDT_1OxHE1lX-C7YBpQiDBA_BkZ5xxPpcEtAKdAiUGiIN1SCUHvpwMRXRY5-zsC3Z1_ecGhSBdFk"
  },
  {
    id: "ex-001", type: "experience", category: "어린이 체험", with: ["kids", "family"],
    title: "[일산] 천연 알러지프리 어린이 배쓰밤 & 말랑 젤리비누 4종 키즈 클래스",
    region: "경기 일산", price: 32500, basePeople: 2,
    priceLabel: "보호자 1인 + 아이 1인 기준", perLabel: "총 4종 완성", refund: "safe",
    rating: 4.96, reviewCount: 164, likes: 389,
    image: "images/ex-kids-soap.jpg",
    imageRemote: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1511J86bxiKN77_qmSk2cnfExMqh151CysbOTC3PAnqBQdI9HbetNh0TZluV_slpS-BYvoTzO9wEEMPiZQbWfGcTsCwBN6gBSXltTkzsjsh9WHamJsAPOtJkCMbot4eOyI7e_lPCFcBbj1mYIzt7dDuY4lLSky8eby01pGuRh-cpV63vQl1PMgu53H1KWSQQUEIwxVwX5zxMhH4PGaBAOFABe2xMwM8tkj6gQEmA"
  }
];

// 판매자 메모 (내 일정 캘린더에서 사용 — calendar.html 제작 시 채움)
const SELLER_MEMOS = [];
