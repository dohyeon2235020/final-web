/* =========================================================
   누구랑 공통 기능 (app.js)
   - 헤더(네비게이션 바)·푸터 출력
   - 로그인 상태, 찜·좋아요 (localStorage)
   - 상품 카드 그리기
   ========================================================= */

/* ---------- localStorage 도우미 ---------- */
const store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v === null ? fallback : JSON.parse(v);
    } catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* 저장 불가 시 무시 */ }
  }
};

const KEYS = { user: "ng_user", wish: "ng_wish", like: "ng_like", qna: "ng_qna" };

/* ---------- 공통 유틸 ---------- */
const won = n => n.toLocaleString("ko-KR") + "원";
const isIndex = () => /(^|\/)(index\.html)?$/.test(location.pathname);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- 찜 · 좋아요 ---------- */
function toggleList(key, id) {
  const list = store.get(key, []);
  const i = list.indexOf(id);
  if (i >= 0) list.splice(i, 1); else list.push(id);
  store.set(key, list);
  return i < 0; // true = 추가됨
}
const isWished = id => store.get(KEYS.wish, []).includes(id);
const isLiked = id => store.get(KEYS.like, []).includes(id);
const likeCount = p => p.likes + (isLiked(p.id) ? 1 : 0);

// 관심 상품 수 = 찜 + 좋아요 (중복 제외)
function interestCount() {
  const set = new Set([...store.get(KEYS.wish, []), ...store.get(KEYS.like, [])]);
  return set.size;
}
function updateInterestBadge() {
  const el = document.getElementById("interest-count");
  if (el) { const n = interestCount(); el.textContent = n > 0 ? n : ""; }
}

/* ---------- 헤더 (네비게이션 바) ---------- */
const NAV = [
  { name: "전체보기", href: "shop.html" },
  { name: "공방", href: "workshop.html" },
  { name: "클래스", href: "class.html" },
  { name: "체험", href: "experience.html" },
  { name: "강의", href: "lecture.html" }
];
const COMMUNITY = [
  { id: "notice", name: "공지사항 (게시글)" },
  { id: "faq", name: "자주 묻는 질문" },
  { id: "qna", name: "1:1 문의" },
  { id: "guestbook", name: "방명록" }
];

function renderHeader() {
  const el = document.getElementById("site-header");
  if (!el) return;
  const here = location.pathname.split("/").pop() || "index.html";
  const user = store.get(KEYS.user, null);
  const navLinks = NAV.map(n => `<a href="${n.href}" class="${here === n.href ? "active" : ""}">${n.name}</a>`).join("");
  const commLinks = COMMUNITY.map(c => `<a href="index.html#${c.id}" data-tab="${c.id}">${c.name}</a>`).join("");
  const account = user
    ? `<span class="user-name">${esc(user.name)}님</span><a class="icon-btn" href="mypage.html" title="마이페이지"><span class="icon">person</span></a><button class="logout-btn" id="logout-btn" type="button">로그아웃</button>`
    : `<a class="login-link" href="login.html">로그인/회원가입</a>`;

  el.className = "site-header";
  el.innerHTML = `
    <div class="container header-inner">
      <div class="header-left">
        <a class="logo" href="index.html"><span class="icon">handshake</span><span>누구랑</span></a>
        <nav class="gnb" aria-label="주 메뉴">
          ${navLinks}
          <div class="dropdown">
            <button class="drop-btn" type="button" aria-haspopup="true">커뮤니티<span class="icon">keyboard_arrow_down</span></button>
            <div class="drop-menu">${commLinks}</div>
          </div>
        </nav>
      </div>
      <div class="header-right">
        <form class="search" role="search"><span class="icon">search</span><input type="search" name="q" placeholder="공방명, 동행, 지역 검색..." aria-label="검색"></form>
        <a class="icon-btn" href="wishlist.html" title="관심 상품"><span class="icon">favorite</span><span class="badge-count" id="interest-count"></span></a>
        <a class="icon-btn" href="calendar.html" title="내 일정"><span class="icon">calendar_today</span></a>
        ${account}
      </div>
    </div>
    <div class="mobile-bar">
      <div class="container">
        <form class="search" role="search"><span class="icon">search</span><input type="search" name="q" placeholder="어떤 동행과 어디로 가시나요?" aria-label="검색"></form>
        <nav class="mobile-gnb" aria-label="모바일 메뉴">${navLinks}<a href="index.html#community">커뮤니티</a></nav>
      </div>
    </div>`;

  // 검색: Enter → shop.html?q=검색어
  el.querySelectorAll("form.search").forEach(f => f.addEventListener("submit", e => {
    e.preventDefault();
    const q = f.q.value.trim();
    location.href = "shop.html" + (q ? "?q=" + encodeURIComponent(q) : "");
  }));

  // 커뮤니티 메뉴: 메인에서는 페이지 이동 없이 탭 전환, 다른 페이지에서는 index.html#탭으로 이동
  el.querySelectorAll("[data-tab]").forEach(a => a.addEventListener("click", e => {
    if (isIndex() && typeof openCommunity === "function") {
      e.preventDefault();
      openCommunity(a.dataset.tab);
      history.replaceState(null, "", "#" + a.dataset.tab);
    }
  }));
  // 터치 기기: 커뮤니티 버튼을 눌러 메뉴 열기
  const drop = el.querySelector(".dropdown");
  drop.querySelector(".drop-btn").addEventListener("click", () => drop.classList.toggle("open"));
  document.addEventListener("click", e => { if (!drop.contains(e.target)) drop.classList.remove("open"); });

  const out = document.getElementById("logout-btn");
  if (out) out.addEventListener("click", () => {
    try { localStorage.removeItem(KEYS.user); } catch (e) {}
    location.href = "index.html";
  });

  updateInterestBadge();
}

/* ---------- 푸터 ---------- */
function renderFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  const commLinks = COMMUNITY.map(c => `<li><a href="index.html#${c.id}" data-tab="${c.id}">${c.name.replace(" (게시글)", "")}</a></li>`).join("");
  el.className = "site-footer";
  el.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="logo" href="index.html"><span class="icon">handshake</span><span>누구랑 (Nugurang)</span></a>
          <p>소중한 동행과 함께하는 공방 · 클래스 · 체험 · 강의 예약 플랫폼. 인원별 총비용을 미리 보여주고, 3단계 안심 환불 등급으로 취소 기준을 알려드립니다.</p>
        </div>
        <div class="footer-links">
          <div><h4>탐색</h4><ul>${NAV.slice(1).map(n => `<li><a href="${n.href}">${n.name}</a></li>`).join("")}</ul></div>
          <div><h4>커뮤니티</h4><ul>${commLinks}</ul></div>
          <div><h4>저장소</h4><ul>
            <li><a href="https://github.com/dohyeon2235020/final-web" target="_blank" rel="noopener">GitHub 저장소</a></li>
            <li><a href="https://github.com/dohyeon2235020/final-web/issues" target="_blank" rel="noopener">이슈 게시판</a></li>
          </ul></div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 누구랑 (Nugurang) · 웹사이트 기획 구축 과제용 예시 사이트</span>
        <span>제작 2235020_이도현</span>
      </div>
    </div>`;
  el.querySelectorAll("[data-tab]").forEach(a => a.addEventListener("click", e => {
    if (isIndex() && typeof openCommunity === "function") {
      e.preventDefault();
      openCommunity(a.dataset.tab);
      history.replaceState(null, "", "#" + a.dataset.tab);
    }
  }));
}

/* ---------- 상품 카드 ---------- */
function imageHTML(p) {
  // images/ 사진 → (없으면) 시안 임시 사진 → (그것도 없으면) 색 블록 + 아이콘
  return `<img src="${p.image}" alt="${esc(p.title)}" loading="lazy" data-remote="${p.imageRemote || ""}" onerror="imgFallback(this)">`;
}
function imgFallback(img) {
  const remote = img.dataset.remote;
  if (remote && img.src !== remote) { img.dataset.remote = ""; img.src = remote; return; }
  img.outerHTML = '<div class="img-fallback"><span class="icon">palette</span></div>';
}

function cardHTML(p) {
  const t = TYPES[p.type];
  const r = REFUND[p.refund];
  const tags = p.with.map(w => "#" + COMPANIONS[w].name.replace(" · ", "·")).join(" ");
  const total = p.price * p.basePeople;
  const label = p.priceLabel || `${p.basePeople}인 기준 총 결제금액${p.priceNote ? " (" + p.priceNote + ")" : ""}`;
  const per = p.perLabel || `1인 ${won(p.price)}`;
  const wished = isWished(p.id), liked = isLiked(p.id);
  return `
    <article class="card" data-id="${p.id}">
      <div class="card-media">
        <a href="detail.html?id=${p.id}" tabindex="-1">${imageHTML(p)}</a>
        <span class="tag-chip">${tags}</span>
        <button class="wish-btn ${wished ? "on" : ""}" type="button" data-wish="${p.id}" title="찜하기" aria-pressed="${wished}">
          <span class="icon ${wished ? "fill" : ""}">favorite</span><span class="sr-only">찜하기</span>
        </button>
      </div>
      <div class="card-body">
        <div>
          <div class="card-meta"><span>${p.region} · ${t.name} · ${p.category}</span><span class="refund ${r.className}">${r.name}</span></div>
          <h3 class="card-title"><a href="detail.html?id=${p.id}">${esc(p.title)}</a></h3>
          <div class="card-rating">
            <span class="icon fill">star</span><b>${p.rating.toFixed(2)}</b><span class="muted">(${p.reviewCount})</span>
            <button class="like-btn ${liked ? "on" : ""}" type="button" data-like="${p.id}" aria-pressed="${liked}">
              <span class="icon ${liked ? "fill" : ""}">thumb_up</span><span class="like-num">${likeCount(p)}</span>
            </button>
          </div>
        </div>
        <div class="card-price">
          <div class="label">${label}</div>
          <div class="row"><span class="total">${won(total)}</span><span class="per">${per}</span></div>
        </div>
      </div>
    </article>`;
}

// 카드 묶음 그리기 + 찜·좋아요 버튼 연결
function renderCards(containerId, list) {
  const box = document.getElementById(containerId);
  if (!box) return;
  box.innerHTML = list.map(cardHTML).join("");
}

// 찜·좋아요 클릭 (한 번만 연결, 이벤트 위임)
document.addEventListener("click", e => {
  const w = e.target.closest("[data-wish]");
  if (w) {
    const on = toggleList(KEYS.wish, w.dataset.wish);
    document.querySelectorAll(`[data-wish="${w.dataset.wish}"]`).forEach(b => {
      b.classList.toggle("on", on); b.setAttribute("aria-pressed", on);
      b.querySelector(".icon").classList.toggle("fill", on);
    });
    updateInterestBadge();
    return;
  }
  const l = e.target.closest("[data-like]");
  if (l) {
    const on = toggleList(KEYS.like, l.dataset.like);
    const p = PRODUCTS.find(x => x.id === l.dataset.like);
    document.querySelectorAll(`[data-like="${l.dataset.like}"]`).forEach(b => {
      b.classList.toggle("on", on); b.setAttribute("aria-pressed", on);
      b.querySelector(".icon").classList.toggle("fill", on);
      if (p) b.querySelector(".like-num").textContent = likeCount(p);
    });
    updateInterestBadge();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
});
