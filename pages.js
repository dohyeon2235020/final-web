/* =========================================================
   누구랑 서브 페이지 공통 기능 (pages.js)
   - data.js, app.js 다음에 불러옵니다.
   - 목록(필터·정렬·페이지), 카드, 예약·일정·후기 저장(localStorage)
   ========================================================= */

const PKEYS = { orders: "ng_orders", replies: "ng_replies", reviews: "ng_reviews", draft: "ng_draft", users: "ng_users" };
const qs = k => new URLSearchParams(location.search).get(k);
const byId = id => PRODUCTS.find(p => p.id === id);
const won2 = n => Number(n).toLocaleString("ko-KR") + "원";

const WITH_UI = {
  date:   { icon: "favorite",        emoji: "❤️",  short: "데이트" },
  friend: { icon: "groups",          emoji: "👥",  short: "친구" },
  family: { icon: "family_restroom", emoji: "👨‍👩‍👧", short: "가족" },
  kids:   { icon: "child_care",      emoji: "👶",  short: "아이" }
};
const withLabel = w => COMPANIONS[w].name.replace(" · ", "·");
const REFUND_UI = {
  safe:   { box: "bg-[#EBF4EF] text-[#3A7A5E]", dot: "bg-[#3A7A5E]", short: "안심", rule: "2일 전 100%" },
  mid:    { box: "bg-[#FDF7EC] text-[#966318]", dot: "bg-[#B37D2E]", short: "보통", rule: "5일 전 100%" },
  strict: { box: "bg-[#FBEFED] text-[#A3433B]", dot: "bg-[#A3433B]", short: "엄격", rule: "6일 전 100%" }
};
function refundBadge(p, text) {
  const r = REFUND_UI[p.refund];
  return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-label-sm font-label-sm font-semibold ${r.box}"><span class="w-1.5 h-1.5 rounded-full ${r.dot}"></span>${text || r.short}</span>`;
}
const durText = m => (m >= 60 ? Math.floor(m / 60) + "시간" : "") + (m % 60 ? " " + (m % 60) + "분" : "");

/* ---------- 안내 토스트 · 예시 기능 ---------- */
function toast(msg) {
  let el = document.getElementById("ng-toast");
  if (!el) { el = document.createElement("div"); el.id = "ng-toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 2600);
}
const DEMO_MSG = "과제용 예시 기능입니다. 실제로는 동작하지 않아요.";
document.addEventListener("click", e => {
  const d = e.target.closest("[data-demo]");
  if (!d) return;
  e.preventDefault();
  if (d.type === "checkbox" || d.type === "radio") d.checked = false;
  toast(d.dataset.demo || DEMO_MSG);
}, true);

/* ---------- 사진 ---------- */
// images/ 사진이 있는 상품(처음 9개)은 저장소 사진을 먼저, 나머지는 시안 사진 주소를 바로 씁니다.
const LOCAL_PHOTO = new Set(["ws-001", "ws-002", "ws-003", "ws-004", "ws-005", "ws-006", "cl-001", "cl-002", "ex-001"]);
function photo(p, cls) {
  const first = LOCAL_PHOTO.has(p.id) ? p.image : p.imageRemote;
  const second = LOCAL_PHOTO.has(p.id) ? p.imageRemote : "";
  return `<img class="${cls}" src="${first}" alt="${esc(p.title)}" loading="lazy" data-remote="${second}" onerror="twImgFallback(this)">`;
}
function twImgFallback(img) {
  const r = img.dataset.remote;
  if (r && img.src !== r) { img.dataset.remote = ""; img.src = r; return; }
  img.outerHTML = '<div class="tw-img-fallback"><span class="icon">palette</span></div>';
}
function wishBtn(p, cls) {
  const on = isWished(p.id);
  return `<button type="button" aria-label="찜하기" title="찜하기" data-wish="${p.id}" aria-pressed="${on}" class="tw-wish ${on ? "on" : ""} ${cls}"><span class="icon ${on ? "fill" : ""} text-[18px]">favorite</span></button>`;
}
const statusBadge = p => p.status === "마감임박"
  ? '<span class="px-2 py-0.5 rounded-full bg-[#A3433B] text-white font-label-sm text-label-sm font-semibold shadow-sm">마감임박</span>'
  : p.status === "품절" ? '<span class="px-2 py-0.5 rounded-full bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm font-semibold">품절</span>' : "";
const recBadge = p => p.recommend ? '<span class="px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-semibold flex items-center gap-1"><span class="icon text-[13px]">auto_awesome</span>에디터 추천</span>' : "";
const detailUrl = p => `detail.html?id=${p.id}`;
const placeOf = p => `${p.sido} ${p.sigungu} ${p.region.split(" ").slice(1).join(" ")}`;

/* ---------- 카드 (페이지별 시안 모양) ---------- */
const CARDS = {
  // 전체보기 (shop 시안)
  shop: p => `
<article class="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group">
  <div class="relative aspect-[4/3] w-full overflow-hidden bg-surface-container">
    <a href="${detailUrl(p)}" tabindex="-1">${photo(p, "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300")}</a>
    <div class="absolute top-3 left-3 flex flex-wrap items-center gap-1">
      ${p.with.slice(0, 2).map((w, i) => `<span class="${i ? "bg-surface-container-lowest text-on-surface-variant border border-outline-variant" : "bg-primary-container text-on-primary-container"} font-label-sm text-label-sm px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1"><span class="icon text-[14px]">${WITH_UI[w].icon}</span>#${withLabel(w)}</span>`).join("")}
      ${statusBadge(p)}
    </div>
    ${wishBtn(p, "absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur-sm flex items-center justify-center text-outline hover:text-primary transition-colors shadow-sm")}
  </div>
  <div class="p-4 flex-1 flex flex-col justify-between">
    <div>
      <div class="flex items-center justify-between gap-1 mb-1">
        <span class="text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1 min-w-0"><span class="icon text-[14px]">location_on</span><span class="truncate">${p.region} · ${esc(p.shop)}</span></span>
        ${refundBadge(p)}
      </div>
      <h3 class="font-headline-sm text-headline-sm text-on-surface line-clamp-1 group-hover:text-primary transition-colors"><a href="${detailUrl(p)}">${esc(p.title)}</a></h3>
      <p class="text-on-surface-variant text-body-sm font-body-sm mt-1 line-clamp-2">${esc(p.summary)} · ${TYPES[p.type].name} · ${p.category}</p>
    </div>
    <div class="mt-4 pt-3 border-t border-outline-variant flex items-end justify-between">
      <div>
        <div class="flex items-center gap-1 text-label-sm font-label-sm mb-0.5"><span class="icon fill text-[16px] text-secondary">star</span><span class="font-bold text-on-surface">${p.rating.toFixed(2)}</span><span class="text-outline">(${p.reviewCount})</span></div>
        <div class="text-body-sm font-body-sm text-outline">1인 ₩${p.price.toLocaleString()}</div>
      </div>
      <div class="text-right"><div class="text-label-sm font-label-sm text-outline">${p.basePeople}인 기준</div><div class="font-headline-sm text-headline-sm font-bold text-primary">₩${(p.price * p.basePeople).toLocaleString()}</div></div>
    </div>
  </div>
</article>`,

  // 공방 시안
  workshop: p => `
<article class="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group">
  <div class="relative w-full aspect-[4/3] overflow-hidden bg-surface-container">
    <a href="${detailUrl(p)}" tabindex="-1">${photo(p, "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500")}</a>
    <div class="absolute top-3 left-3 flex flex-wrap gap-1">
      <span class="px-2.5 py-1 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm font-semibold shadow-sm">${WITH_UI[p.with[0]].emoji} ${withLabel(p.with[0])}</span>${statusBadge(p)}
    </div>
    ${wishBtn(p, "absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur flex items-center justify-center text-outline hover:bg-surface-container-lowest transition-colors shadow-sm")}
    <div class="absolute bottom-2.5 left-3">${refundBadge(p, REFUND[p.refund].name + " (" + REFUND_UI[p.refund].rule + ")")}</div>
  </div>
  <div class="p-space-md flex flex-col flex-1 justify-between">
    <div>
      <div class="flex items-center justify-between text-outline font-label-sm text-label-sm mb-1">
        <span class="flex items-center gap-1"><span class="icon text-[14px]">location_on</span> ${p.region}</span>
        <span class="text-tertiary font-medium">${esc(p.shop)}</span>
      </div>
      <h3 class="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors line-clamp-2"><a href="${detailUrl(p)}">${esc(p.title)}</a></h3>
      <div class="flex items-center gap-1.5 mt-2">
        <div class="flex items-center text-primary"><span class="icon fill text-[16px]">star</span><span class="font-label-md text-label-md font-bold ml-0.5 text-on-surface">${p.rating.toFixed(2)}</span></div>
        <span class="text-outline font-label-sm text-label-sm">(${p.reviewCount})</span><span class="text-outline-variant text-[11px]">•</span><span class="text-outline font-label-sm text-label-sm">${p.category}</span>
      </div>
    </div>
    <div class="mt-space-md pt-space-sm bg-surface-container-low/50 p-2.5 rounded-lg flex items-end justify-between">
      <div>
        <span class="font-label-sm text-label-sm text-outline block">${p.basePeople}인 기준 세트가</span>
        <div class="flex items-baseline gap-1 flex-wrap"><span class="font-headline-sm text-headline-sm text-primary font-bold">${won2(p.price * p.basePeople)}</span><span class="font-label-sm text-label-sm text-on-surface-variant font-medium">(1인 ${won2(p.price)})</span></div>
      </div>
      <a href="${detailUrl(p)}" class="px-3.5 py-1.5 rounded bg-primary-container hover:bg-primary text-on-primary-container font-label-md text-label-md transition-colors flex items-center gap-1 shrink-0"><span>예약</span><span class="icon text-[16px]">arrow_forward</span></a>
    </div>
  </div>
</article>`,

  // 클래스 시안
  class: p => `
<article class="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
  <div class="relative w-full h-56 overflow-hidden bg-surface-container">
    <a href="${detailUrl(p)}" tabindex="-1">${photo(p, "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500")}</a>
    <div class="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
      ${p.with.slice(0, 2).map(w => `<span class="px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface font-label-sm text-label-sm shadow-sm flex items-center gap-1"><span>${WITH_UI[w].emoji}</span> #${withLabel(w)}</span>`).join("")}${recBadge(p)}${statusBadge(p)}
    </div>
    ${wishBtn(p, "absolute top-3 right-3 w-9 h-9 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface-variant hover:text-primary flex items-center justify-center shadow-sm transition-colors z-10")}
    <div class="absolute bottom-3 right-3 shadow-sm">${refundBadge(p, REFUND[p.refund].name)}</div>
  </div>
  <div class="p-space-md flex flex-col flex-1 justify-between gap-space-md">
    <div class="flex flex-col gap-space-xs">
      <div class="flex items-center justify-between text-outline font-label-sm text-label-sm gap-2">
        <span class="flex items-center gap-1 min-w-0"><span class="icon text-[15px]">location_on</span><span class="truncate">${p.region} · ${esc(p.shop)}</span></span>
        <div class="flex items-center gap-1 text-on-surface font-semibold shrink-0"><span class="icon fill text-[16px] text-amber-500">star</span><span>${p.rating.toFixed(2)}</span><span class="text-outline font-normal">(${p.reviewCount})</span></div>
      </div>
      <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold group-hover:text-primary transition-colors line-clamp-1"><a href="${detailUrl(p)}">${esc(p.title)}</a></h3>
      <div class="flex items-center gap-2 mt-1"><span class="px-2 py-0.5 rounded bg-surface-container-low text-primary font-label-sm text-label-sm font-semibold">${p.category}</span><span class="text-outline text-label-sm font-label-sm flex items-center gap-1"><span class="icon text-[14px]">schedule</span> ${durText(p.duration)}</span><span class="text-outline text-label-sm font-label-sm">· ${p.difficulty}</span></div>
    </div>
    <div class="pt-space-sm flex items-end justify-between">
      <div class="flex flex-col"><span class="font-label-sm text-label-sm text-outline">1인 ${won2(p.price)}</span><div class="flex items-baseline gap-1"><span class="font-label-sm text-label-sm text-on-surface-variant">${p.basePeople}인 기준</span><span class="font-headline-sm text-headline-sm font-bold text-primary">${won2(p.price * p.basePeople)}</span></div></div>
      <a class="px-3.5 py-2 rounded-lg bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface font-label-md text-label-md transition-colors flex items-center gap-1" href="${detailUrl(p)}">예약하기<span class="icon text-[16px]">arrow_forward</span></a>
    </div>
  </div>
</article>`,

  // 체험 시안
  experience: p => `
<article class="group rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
  <div class="relative w-full aspect-[4/3] bg-surface-container overflow-hidden">
    <a href="${detailUrl(p)}" tabindex="-1">${photo(p, "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500")}</a>
    <div class="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
      <span class="px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm text-secondary font-label-sm text-label-sm font-semibold flex items-center gap-1 shadow-xs"><span class="icon text-[13px]">${WITH_UI[p.with[0]].icon}</span>${withLabel(p.with[0])}</span>${recBadge(p)}${refundBadge(p, REFUND[p.refund].name)}${statusBadge(p)}
    </div>
    ${wishBtn(p, "absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur-sm flex items-center justify-center text-outline hover:text-primary transition-colors")}
    <div class="absolute bottom-3 left-3 bg-inverse-surface/85 backdrop-blur-sm text-inverse-on-surface px-2.5 py-1 rounded-md text-label-sm font-label-sm flex items-center gap-1"><span class="icon text-[14px] text-secondary-fixed">explore</span><span>${p.category}</span></div>
  </div>
  <div class="p-space-lg flex-1 flex flex-col justify-between gap-space-md">
    <div class="flex flex-col gap-1.5">
      <div class="flex items-center justify-between text-outline font-label-sm text-label-sm gap-2">
        <span class="flex items-center gap-1 min-w-0"><span class="icon text-[15px]">location_on</span><span class="truncate">${esc(p.shop)} (${p.region})</span></span>
        <span class="flex items-center gap-1 shrink-0"><span class="icon text-[15px]">schedule</span>소요시간 ${durText(p.duration)}</span>
      </div>
      <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold group-hover:text-primary transition-colors line-clamp-2"><a href="${detailUrl(p)}">${esc(p.title)}</a></h3>
      <p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">${esc(p.summary)}</p>
    </div>
    <div class="pt-space-sm border-t border-outline-variant/30 flex items-end justify-between">
      <div class="flex items-center gap-1 text-primary"><span class="icon fill text-[18px] text-primary">star</span><span class="font-label-lg text-label-lg font-bold text-on-surface">${p.rating.toFixed(2)}</span><span class="text-outline font-label-sm text-label-sm">(${p.reviewCount})</span></div>
      <div class="flex flex-col items-end"><span class="font-label-sm text-label-sm text-outline">${p.basePeople}인 기준 ${won2(p.price * p.basePeople)}</span><div class="flex items-baseline gap-1"><span class="text-outline text-label-sm font-label-sm">1인</span><span class="font-headline-sm text-headline-sm text-primary font-extrabold">${won2(p.price)}</span></div></div>
    </div>
  </div>
</article>`,

  // 강의 시안
  lecture: p => `
<article class="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
  <div class="relative w-full h-52 overflow-hidden bg-surface-container">
    <a href="${detailUrl(p)}" tabindex="-1">${photo(p, "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500")}</a>
    <div class="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">${recBadge(p)}${refundBadge(p, REFUND[p.refund].name)}${statusBadge(p)}</div>
    ${wishBtn(p, "absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-primary transition-colors")}
    <div class="absolute bottom-3 left-3 flex items-center gap-1 flex-wrap">
      <span class="px-2 py-0.5 rounded bg-inverse-surface/80 backdrop-blur-sm text-inverse-on-surface font-label-sm text-label-sm">오프라인 · 최대 ${p.maxPeople}인</span>
      <span class="px-2 py-0.5 rounded bg-surface-container-lowest/90 backdrop-blur-sm text-primary font-label-sm text-label-sm font-semibold">${p.with.map(w => WITH_UI[w].emoji + " " + WITH_UI[w].short).join(" · ")}</span>
    </div>
  </div>
  <div class="p-space-md flex flex-col flex-1 justify-between">
    <div>
      <div class="flex items-center gap-2 text-outline font-label-sm text-label-sm mb-1.5 flex-wrap">
        <span class="flex items-center gap-0.5"><span class="icon text-[14px]">location_on</span>${p.sido} ${p.sigungu}</span><span>·</span><span class="text-primary font-semibold">${esc(p.shop)}</span><span>·</span><span>${p.category}</span>
      </div>
      <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold leading-snug group-hover:text-primary transition-colors mb-2"><a href="${detailUrl(p)}">${esc(p.title)}</a></h2>
      <p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-3">${esc(p.summary)} · ${p.steps.join(" → ")}</p>
      <div class="flex flex-wrap gap-1.5 mb-4">
        <span class="px-2 py-0.5 rounded-md bg-surface-container font-label-sm text-label-sm text-tertiary">📘 ${p.difficulty} · ${durText(p.duration)}</span>
        ${p.material ? '<span class="px-2 py-0.5 rounded-md bg-surface-container font-label-sm text-label-sm text-on-surface-variant">🧾 재료·교재비 포함</span>' : ""}
      </div>
    </div>
    <div class="pt-3 bg-surface-container-low/50 -mx-space-md -mb-space-md p-space-md flex items-end justify-between">
      <div>
        <div class="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant mb-1"><span class="icon fill text-primary text-[15px]">star</span><span class="font-bold text-on-surface">${p.rating.toFixed(2)}</span><span class="text-outline">(후기 ${p.reviewCount})</span></div>
        <div class="flex items-baseline gap-1.5"><span class="font-headline-sm text-headline-sm text-primary font-bold">${won2(p.price)}</span><span class="font-body-sm text-body-sm text-outline">/ 1인</span></div>
        <span class="font-label-sm text-label-sm text-secondary font-semibold">${p.basePeople}인 기준 총 ${won2(p.price * p.basePeople)}</span>
      </div>
      <a href="${detailUrl(p)}" class="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-colors shadow-sm flex items-center gap-1"><span>신청하기</span><span class="icon text-[16px]">chevron_right</span></a>
    </div>
  </div>
</article>`
};

/* ---------- 목록 페이지 (필터 · 정렬 · 페이지) ---------- */
function initList(cfg) {
  const all = cfg.type ? PRODUCTS.filter(p => p.type === cfg.type) : PRODUCTS.slice();
  const list = document.getElementById("list");
  const S = { type: "", cat: "", with: [], region: [], price: [], pmax: null, refund: ["safe", "mid", "strict"], dur: [], size: [], sort: "rec", q: "", page: 1 };

  // 주소로 넘어온 값 (?with=date&cat=도자기&q=검색어&type=class)
  if (qs("with") && COMPANIONS[qs("with")]) S.with = [qs("with")];
  if (qs("cat")) S.cat = qs("cat");
  if (qs("type") && TYPES[qs("type")]) S.type = qs("type");
  if (qs("q")) S.q = qs("q").trim();

  // 버튼 묶음: 선택/비선택 모양을 시안에서 그대로 가져옴
  const groups = {};
  document.querySelectorAll("button[data-g], a[data-g]").forEach(b => {
    const g = b.dataset.g;
    groups[g] = groups[g] || { btns: [], on: null, off: null };
    groups[g].btns.push(b);
    if (b.hasAttribute("data-active")) groups[g].on = groups[g].on || b.className;
    else groups[g].off = groups[g].off || b.className;
  });
  const multi = g => document.querySelector(`[data-g="${g}"][data-multi]`) !== null;
  const val = el => el.dataset.v !== undefined ? el.dataset.v : el.value;

  const isOn = (g, v) => {
    if (g === "sort") return S.sort === v;
    if (g === "type") return S.type === v;
    if (g === "cat") return S.cat === v;
    if (g === "pricemax") return S.pmax !== null && String(S.pmax) === v;
    const arr = S[g === "with" ? "with" : g];
    return Array.isArray(arr) ? (v === "" ? arr.length === 0 : arr.includes(v)) : false;
  };
  function paintButtons() {
    Object.entries(groups).forEach(([g, G]) => G.btns.forEach(b => {
      const on = isOn(g, val(b));
      if (G.on && G.off) b.className = on ? G.on : G.off;
      b.setAttribute("aria-pressed", on);
    }));
    document.querySelectorAll("input[data-g]").forEach(i => {
      const g = i.dataset.g;
      if (g === "pricemax") return;
      i.checked = isOn(g, i.value);
    });
  }

  // 클릭 → 상태 변경
  document.addEventListener("click", e => {
    const b = e.target.closest("button[data-g], a[data-g]");
    if (!b) return;
    e.preventDefault();
    const g = b.dataset.g, v = val(b);
    if (g === "sort") S.sort = v;
    else if (g === "type") S.type = v, S.cat = "";
    else if (g === "cat") S.cat = (S.cat === v ? "" : v);
    else if (g === "pricemax") { const [a, c] = v.split("-"); S.price = [v]; S.pmax = null; syncRange(); }
    else {
      const arr = S[g];
      if (v === "") S[g] = [];
      else if (multi(g)) arr.includes(v) ? arr.splice(arr.indexOf(v), 1) : arr.push(v);
      else S[g] = arr.includes(v) ? [] : [v];
    }
    S.page = 1; render();
  });
  document.querySelectorAll("input[data-g]").forEach(i => i.addEventListener("click", () => {
    const g = i.dataset.g;
    if (g === "pricemax") return;
    if (i.type === "radio") {
      S[g] = (S[g].includes(i.value) ? [] : [i.value]);   // 같은 항목을 다시 누르면 해제
    } else {
      const arr = S[g];
      i.checked ? (!arr.includes(i.value) && arr.push(i.value)) : arr.splice(arr.indexOf(i.value), 1);
    }
    S.page = 1; render();
  }));
  // 가격 슬라이더 (shop)
  const range = document.querySelector('input[data-g="pricemax"]');
  const rangeLabel = document.querySelector("[data-range-label]");
  function syncRange() { if (range) { range.value = S.pmax || range.max; } if (rangeLabel) rangeLabel.textContent = S.pmax ? `₩${PRICE_MIN.toLocaleString()} ~ ₩${Number(S.pmax).toLocaleString()}` : "가격 전체"; }
  const PRICE_MIN = Math.min(...all.map(p => p.price));
  if (range) range.addEventListener("input", () => { S.pmax = Number(range.value) >= Number(range.max) ? null : Number(range.value); S.price = []; S.page = 1; syncRange(); render(); });
  const sel = document.querySelector('select[data-g="sort"]');
  if (sel) sel.addEventListener("change", () => { S.sort = sel.value; S.page = 1; render(); });
  document.querySelectorAll("[data-reset]").forEach(b => b.addEventListener("click", e => {
    e.preventDefault();
    Object.assign(S, { cat: "", with: [], region: [], price: [], pmax: null, refund: ["safe", "mid", "strict"], dur: [], size: [], q: "", page: 1 });
    if (!cfg.type) S.type = "";
    history.replaceState(null, "", location.pathname);
    syncRange(); render();
  }));
  document.querySelectorAll("[data-apply]").forEach(b => b.addEventListener("click", e => {
    e.preventDefault();
    list.scrollIntoView({ behavior: "smooth", block: "start" });
  }));

  // 범위 문자열 "a-b" 검사
  const inRange = (n, r) => { const [a, b] = r.split("-"); return (a === "" || n >= +a) && (b === "" || b === undefined || n < +b); };
  const regionHit = (p, v) => v.split(",").some(k => k.startsWith("sido:") ? p.sido === k.slice(5) : p.region.includes(k));

  function filtered() {
    return all.filter(p =>
      (!S.type || p.type === S.type) &&
      (!S.cat || p.category === S.cat) &&
      (!S.with.length || S.with.some(w => p.with.includes(w))) &&
      (!S.region.length || S.region.some(v => regionHit(p, v))) &&
      (!S.price.length || S.price.some(r => inRange(p.price, r))) &&
      (S.pmax === null || p.price <= S.pmax) &&
      S.refund.includes(p.refund) &&
      (!S.dur.length || S.dur.some(r => inRange(p.duration, r))) &&
      (!S.size.length || S.size.some(r => inRange(p.maxPeople, r))) &&
      (!S.q || [p.title, p.summary, p.region, p.category, p.shop, TYPES[p.type].name, p.sigungu].join(" ").includes(S.q))
    );
  }
  const SORTS = {
    rec: (a, b) => (b.recommend ? 1 : 0) - (a.recommend ? 1 : 0) || (b.rating * Math.log(b.reviewCount + 2)) - (a.rating * Math.log(a.reviewCount + 2)),
    pop: (a, b) => likeCount(b) - likeCount(a),
    rating: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
    price: (a, b) => a.price - b.price,
    dur: (a, b) => a.duration - b.duration,
    new: (a, b) => b.id.localeCompare(a.id),
    urgent: (a, b) => (b.status === "마감임박") - (a.status === "마감임박") || b.rating - a.rating
  };

  function renderPager(total) {
    const pager = document.querySelector("[data-pager]");
    if (!pager) return;
    const pages = Math.max(1, Math.ceil(total / cfg.pageSize));
    if (!pager._init) {
      const nums = [...pager.querySelectorAll("button")].filter(b => /^\s*\d+\s*$/.test(b.textContent));
      pager._on = nums[0].className; pager._off = (nums[1] || nums[0]).className;
      pager._box = nums[0].parentElement;
      pager._anchor = document.createComment("pages");
      pager._box.insertBefore(pager._anchor, nums[0]);
      nums.forEach(b => b.remove());
      const others = [...pager.querySelectorAll("button")];
      pager._prev = others[0]; pager._next = others[others.length - 1];
      pager._prev.addEventListener("click", () => { if (S.page > 1) { S.page--; render(true); } });
      pager._next.addEventListener("click", () => { if (S.page < pager._pages) { S.page++; render(true); } });
      pager._init = true;
    }
    pager._pages = pages;
    pager._box.querySelectorAll("[data-pnum]").forEach(b => b.remove());
    const start = Math.max(1, Math.min(S.page - 2, pages - 4));
    for (let i = start; i <= Math.min(pages, start + 4); i++) {
      const b = document.createElement("button");
      b.type = "button"; b.textContent = i; b.dataset.pnum = i;
      b.className = i === S.page ? pager._on : pager._off;
      if (i === S.page) b.setAttribute("aria-current", "page");
      b.addEventListener("click", () => { S.page = i; render(true); });
      pager._box.insertBefore(b, pager._anchor);
    }
    pager._prev.disabled = S.page <= 1;
    pager._next.disabled = S.page >= pages;
    pager.style.display = pages > 1 ? "" : "none";
  }

  function renderChips() {
    const box = document.querySelector("[data-chips]");
    if (!box) return;
    const chips = [];
    if (S.q) chips.push([`검색: ${S.q}`, () => S.q = ""]);
    if (S.type) chips.push([TYPES[S.type].name, () => S.type = ""]);
    if (S.cat) chips.push([S.cat, () => S.cat = ""]);
    S.with.forEach(w => chips.push([COMPANIONS[w].name, () => S.with.splice(S.with.indexOf(w), 1)]));
    S.region.forEach(r => {
      const el = document.querySelector(`[data-g="region"][value="${r}"], [data-g="region"][data-v="${r}"]`);
      const lab = el ? (el.closest("label") || el).textContent.trim() : r;
      chips.push([lab, () => S.region.splice(S.region.indexOf(r), 1)]);
    });
    if (S.pmax) chips.push([`~₩${S.pmax.toLocaleString()}`, () => S.pmax = null]);
    S.price.forEach(r => chips.push([r.replace(/(\d+)/g, m => (m / 10000) + "만").replace("-", "~") + "원", () => S.price.splice(S.price.indexOf(r), 1)]));
    box.innerHTML = chips.map((c, i) => `<span class="flex items-center gap-1 bg-surface-container-highest px-2.5 py-1 rounded-md">${esc(c[0])}<button type="button" data-chip="${i}" aria-label="${esc(c[0])} 해제" class="icon text-[14px] cursor-pointer hover:text-primary">close</button></span>`).join("")
      + (chips.length ? '<button type="button" data-chip="all" class="text-outline hover:text-primary underline ml-1">초기화</button>' : "");
    box.querySelectorAll("[data-chip]").forEach(b => b.onclick = () => {
      if (b.dataset.chip === "all") document.querySelector("[data-reset]").click();
      else { chips[b.dataset.chip][1](); S.page = 1; syncRange(); render(); }
    });
  }

  function render(scroll) {
    const rows = filtered().sort(SORTS[S.sort] || SORTS.rec);
    const pages = Math.max(1, Math.ceil(rows.length / cfg.pageSize));
    if (S.page > pages) S.page = pages;
    const pageRows = rows.slice((S.page - 1) * cfg.pageSize, S.page * cfg.pageSize);
    list.innerHTML = pageRows.length ? pageRows.map(CARDS[cfg.card]).join("")
      : `<div class="col-span-full py-16 text-center bg-surface-container-lowest rounded-xl border border-outline-variant">
           <span class="icon text-[40px] text-outline-variant">search_off</span>
           <p class="mt-2 font-headline-sm text-headline-sm text-on-surface">조건에 맞는 상품이 없어요</p>
           <p class="text-body-sm text-outline mt-1">필터를 줄이거나 초기화해 보세요.</p></div>`;
    document.querySelectorAll("[data-count]").forEach(el => el.textContent = el.dataset.count.replace("{n}", rows.length));
    paintButtons(); renderPager(rows.length); renderChips();
    if (scroll) list.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (sel) { sel.value = S.sort; }
  syncRange();
  render();
}

/* ---------- 예약 · 일정 ---------- */
const pad = n => String(n).padStart(2, "0");
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const todayStr = () => ymd(new Date());
const DAYS = ["일", "월", "화", "수", "목", "금", "토"];
function fmtDate(s, withDay = true) {
  const d = new Date(s + "T00:00:00");
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일` + (withDay ? ` (${DAYS[d.getDay()]})` : "");
}
const dday = s => Math.round((new Date(s + "T00:00:00") - new Date(todayStr() + "T00:00:00")) / 86400000);
const ddayText = s => { const n = dday(s); return n === 0 ? "D-DAY" : n > 0 ? "D-" + n : "D+" + (-n); };
function endTime(time, minutes) {
  const [h, m] = time.split(":").map(Number); const t = h * 60 + m + minutes;
  return `${pad(Math.floor(t / 60) % 24)}:${pad(t % 60)}`;
}
const getOrders = () => store.get(PKEYS.orders, []);
const saveOrders = list => store.set(PKEYS.orders, list);
function orderStatus(o) {
  if (o.status === "취소") return "취소";
  return dday(o.date) < 0 ? "완료" : "예정";
}
// 금액 계산: 1인 가격 × 인원 + 옵션(주문당) − 단체 할인(4인 이상, 상품별 %)
function calcPrice(p, people, withOption) {
  const base = p.price * people;
  const option = withOption ? p.option.price : 0;
  const discount = people >= 4 && p.groupDiscount ? Math.round(base * p.groupDiscount / 100 / 100) * 100 : 0;
  return { base, option, discount, total: base + option - discount };
}
function newOrderNo() {
  const d = new Date();
  return `NG-${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
}
const TIMES = p => p.weekdayEvening ? ["10:00", "14:00", "19:00"] : ["10:00", "13:00", "16:00"];

/* ---------- 후기 ---------- */
const REVIEW_LINES = {
  workshop: ["선생님이 손 위치를 꼼꼼하게 잡아주셔서 처음인데도 완성도가 높았어요.", "둘이서 이야기 나누며 만들다 보니 시간 가는 줄 몰랐어요. 결과물도 너무 마음에 들어요!", "재료가 미리 다 준비돼 있어서 추가 비용 걱정 없이 편하게 즐겼습니다.", "공방 분위기가 따뜻하고 조용해서 힐링 그 자체였어요."],
  class: ["설명이 쉽고 단계별로 알려주셔서 따라가기 좋았어요.", "친구들과 함께 만들고 바로 맛보고 사진도 남겨서 최고의 하루였어요.", "소규모라 질문도 편하게 할 수 있었고 집에서도 다시 해볼 수 있을 것 같아요.", "부모님이 정말 좋아하셨어요. 다음에도 함께 오려고요."],
  experience: ["아이가 하루 종일 신나 했어요. 안전 안내도 꼼꼼했습니다.", "날씨가 걱정됐는데 운영팀이 미리 연락 주셔서 안심하고 다녀왔어요.", "가족 모두 처음 해보는 체험이라 더 기억에 남아요.", "사진을 많이 찍어주셔서 좋은 추억이 됐습니다."],
  lecture: ["강의 내용이 알차고 실습 시간이 넉넉해서 좋았어요.", "소규모라 강사님께 바로바로 피드백 받을 수 있었어요.", "아이와 함께 들었는데 둘 다 집중해서 들었습니다.", "퇴근 후 들었는데 지친 하루가 채워지는 느낌이었어요."]
};
const NICK = ["김*연", "이*호", "박*은", "최*준", "정*아", "강*민", "조*윤", "윤*희", "장*우", "한*솔", "오*린", "서*진"];
function sampleReviews() {
  if (sampleReviews._c) return sampleReviews._c;
  const out = [];
  PRODUCTS.forEach((p, i) => {
    const n = (p.reviewCount > 0 ? 1 : 0) + (i % 3 === 0 ? 1 : 0);
    for (let k = 0; k < n; k++) {
      const d = new Date(); d.setDate(d.getDate() - ((i * 7 + k * 13) % 120) - 3);
      out.push({
        no: `S-${p.id}-${k}`, id: p.id, user: NICK[(i + k) % NICK.length], with: p.with[k % p.with.length],
        rating: Math.max(4, Math.min(5, Math.round((p.rating - (k * 0.3)) * 2) / 2)),
        scores: { teacher: 5, material: 4.5 + (i % 2) * 0.5, price: 4 + ((i + k) % 3) * 0.5, mood: 5 },
        text: REVIEW_LINES[p.type][(i + k) % 4] + " " + (p.memo.info ? "(" + p.memo.info + ")" : ""),
        photos: k === 0 && i % 2 === 0 ? [p.imageRemote].concat(p.photos.slice(0, 1)) : [],
        date: ymd(d), helpful: (i * 3 + k) % 40, verified: true, sample: true
      });
    }
  });
  return (sampleReviews._c = out);
}
const getMyReviews = () => store.get(PKEYS.reviews, []);
const allReviews = () => getMyReviews().concat(sampleReviews()).sort((a, b) => b.date.localeCompare(a.date));

/* ---------- 회원 · 데모 계정 ---------- */
async function hashPw(pw) {
  try {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("nugurang:" + pw));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
  } catch (e) { return "plain:" + pw; }
}
const DEMO_USER = { name: "김서연", email: "demo@nugurang.kr", phone: "010-0000-0000", with: ["date", "friend"], interests: ["향수·캔들", "도자기"], demo: true };
function seedDemo() {
  store.set(KEYS.user, DEMO_USER);
  const orders = getOrders().filter(o => !o.demo);
  const add = (days) => { const d = new Date(); d.setDate(d.getDate() + days); return ymd(d); };
  const mk = (id, days, time, people, opt, w, extra) => {
    const p = byId(id); const c = calcPrice(p, people, opt);
    return Object.assign({ no: `NG-DEMO-${id}`, id, date: add(days), time, people, option: opt, with: w, ...c,
      pay: "카카오페이", name: DEMO_USER.name, phone: DEMO_USER.phone, email: DEMO_USER.email, request: "", status: "결제완료", createdAt: add(days - 7), demo: true }, extra || {});
  };
  orders.unshift(
    mk("ws-002", 5, "14:00", 2, true, "date", { request: "1주년 기념 데이트로 방문합니다." }),
    mk("ws-003", -20, "15:00", 2, false, "date"),
    mk("cl-002", -9, "11:00", 3, false, "friend")
  );
  saveOrders(orders);
  const reviews = getMyReviews().filter(r => !r.demo);
  reviews.unshift({ no: "R-DEMO-1", order: "NG-DEMO-ws-003", id: "ws-003", user: "김*연", with: "date", rating: 5,
    scores: { teacher: 5, material: 5, price: 4.5, mood: 5 }, text: "선생님이 손 위치를 꼼꼼하게 교정해주셔서 초보인데도 너무 예쁜 잔이 나왔어요!",
    photos: [byId("ws-003").imageRemote], date: add(-18), helpful: 12, verified: true, demo: true });
  store.set(PKEYS.reviews, reviews);
  const wish = store.get(KEYS.wish, []);
  ["ws-001", "ws-004", "cl-001", "ws-005", "ex-001"].forEach(id => !wish.includes(id) && wish.push(id));
  store.set(KEYS.wish, wish);
}
function requireLogin(msg) {
  if (store.get(KEYS.user, null)) return true;
  toast(msg || "로그인이 필요해요. 로그인 페이지로 이동합니다.");
  setTimeout(() => location.href = "login.html?next=" + encodeURIComponent(location.pathname.split("/").pop() + location.search), 900);
  return false;
}
