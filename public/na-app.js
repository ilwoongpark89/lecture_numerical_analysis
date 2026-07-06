/* Heat-Transfer Week2 학습 추적 — new2.html(mockup)에 주입.
   학번 게이트 확인 + 접속/체류/답안 이벤트를 /api/track 로 전송. */
// 채점 단일 정의 (#18 통합) — 상대오차 rtol + 절대오차 atol (numpy isclose 형). 0 근처 target 은 atol 필수.
// lecture-engine.js(시각 피드백) 와 na-app.js(서버 isCorrect) 가 동일 함수 사용 → 판정 불일치 0.
window.NA_grade = function (v, ans, rtol, atol) {
  return !isNaN(v) && !isNaN(ans) && Math.abs(v - ans) <= Math.abs(ans) * (rtol || 0) + (atol || 0);
};

(function () {
  "use strict";
  var WEEK = (typeof window !== "undefined" && window.NA_WEEK) ? window.NA_WEEK : 2;

  // ?reveal=all 딥링크는 mockup applyDeep() 가 모든 점검을 '정답'으로 자동 제출함 → 추적 오염 차단
  var REVEAL = false;
  try { REVEAL = new URLSearchParams(location.search).get("reveal") === "all"; } catch (e) {}

  function cookie(name) {
    return document.cookie.split("; ").reduce(function (a, c) {
      var i = c.indexOf("=");
      if (c.slice(0, i) === name) a = decodeURIComponent(c.slice(i + 1));
      return a;
    }, "");
  }

  // ── 학번 게이트: 없으면 /enter 로 ─────────────────────────────
  var sid = cookie("na_sid");
  if (!sid) {
    location.replace("/enter?next=" + encodeURIComponent(location.pathname));
    return;
  }
  // 교수 세션(__prof__): 강의 컨텐츠 열람은 허용하되 학습 기록은 남기지 않음
  var IS_PROF = sid === "__prof__";

  function post(payload) {
    if (IS_PROF) return;
    try {
      payload.week = WEEK;
      var body = JSON.stringify(payload);
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
      } else {
        fetch("/api/track", { method: "POST", headers: { "content-type": "application/json" }, body: body, keepalive: true });
      }
    } catch (e) { /* 추적 실패는 학습 흐름을 막지 않음 */ }
  }

  function activeScreen() { return document.querySelector(".screen.active"); }
  function slideIndex(el) {
    if (!el || !el.parentNode) return null;
    return Array.prototype.indexOf.call(el.parentNode.children, el);
  }
  function chOf(el) { return el && el.getAttribute ? el.getAttribute("data-ch") : null; }
  function stageOf(el) { return el && el.getAttribute ? el.getAttribute("data-stage") : null; }
  function textOf(el) { return el ? (el.textContent || "").replace(/\s+/g, " ").trim() : ""; }
  var IS_STUDENT = !IS_PROF;

  // ── 정답·풀이·답변예시 봉인 ──
  // 봉인 CSS 는 lecture.css 정적 규칙(body:not(.na-prof) …{display:none})이 담당 = fail-closed.
  // JS 주입을 폐기해 "봉인 전 순간 노출(flash 유출)" 을 구조적으로 제거. 여기선 교수만 na-prof 로 해제.
  (function seal() {
    function tag() { if (document.body) document.body.classList.add(IS_STUDENT ? "na-student" : "na-prof"); }
    if (document.body) tag(); else document.addEventListener("DOMContentLoaded", tag);
  })();

  // ── 학생 제출 가로채기: 연습 '확인' = 제출(정오 비공개) + 서버 저장. '풀이 보기' 봉인. ──
  //    엔진(bubble)보다 먼저 capture 로 가로채 정오·풀이 공개를 차단, 답만 서버에 남긴다(교수 열람).
  if (IS_STUDENT && !REVEAL) {
    var lastAns = {};   // 문항키 → 마지막 전송 답. 같은 답 재클릭은 중복 전송 안 함(수정 시에만 재기록)
    document.addEventListener("click", function (e) {
      var t = e.target; if (!t || !t.closest) return;
      var rb = t.closest(".reveal-btn");
      if (rb) { e.stopPropagation(); e.preventDefault(); return; }
      var chk = t.closest(".pr-check");
      if (!chk) return;
      e.stopPropagation();
      var pb = chk.closest(".prob") || chk.closest(".screen");
      var scr = pb ? pb.closest(".screen") : null;
      var input = pb ? pb.querySelector(".ans-input") : null;
      var pf = pb ? (pb.querySelector(".pr-fb") || pb.querySelector(".check-fb")) : null;
      var raw = input ? (input.value || "").trim() : "";
      if (!raw) { if (pf) { pf.textContent = "먼저 답을 입력하세요"; pf.className = "check-fb pr-fb"; pf.style.color = "var(--gray2)"; } return; }
      var target = input ? parseFloat(input.getAttribute("data-answer")) : NaN;
      var tol = input ? parseFloat(input.getAttribute("data-tol") || "0.02") : 0.02;
      var atol = input ? parseFloat(input.getAttribute("data-atol") || "0") : 0;
      var v = parseFloat(raw.replace(/[,\s]/g, ""));
      var ok = window.NA_grade(v, target, tol, atol);
      var aKey = ansKey(scr, pb, stageOf(scr) || "연습", ".prob");
      if (lastAns[aKey] !== raw) {
        lastAns[aKey] = raw;
        post({
          kind: "answer", chapter: chOf(scr), section: stageOf(scr),
          question: (textOf(pb.querySelector(".prob-num")) || "연습").slice(0, 120),
          prompt: (textOf(pb.querySelector(".prob-statement")) || "").slice(0, 500),
          answer: raw.slice(0, 200), isCorrect: isNaN(target) ? null : ok
        });
      }
      if (pf) { pf.textContent = "제출됨 ✓ · 교수 열람 · 언제든 수정"; pf.className = "check-fb pr-fb ok"; pf.style.color = "var(--accent)"; }
    }, true);
  }

  // ── 접속: 탭 세션당 1회 (reload 마다 inflate 방지) ────────────
  try {
    if (!sessionStorage.getItem("na_entered_w" + WEEK)) {
      sessionStorage.setItem("na_entered_w" + WEEK, "1");
      var s0 = activeScreen();
      post({ kind: "enter", slide: slideIndex(s0), chapter: chOf(s0) });
    }
  } catch (e) {
    post({ kind: "enter" });
  }

  // ── 단계별 체류시간(dwell): "화살표 연타 = 열람"이 아니라 실제 머문 시간을 측정. ──
  //    보이는 동안 현재 화면(chapter+stage)에 머문 ms 를 누적해 화면 전환/이탈/주기마다 전송.
  //    서버는 (학번,챕터,단계) 누적 UPSERT → 부분 전송도 가산이라 안전. <1s 는 연타로 간주해 버림.
  if (!REVEAL) {
    var dwellScreen = null, segStart = 0, banked = 0;
    var nowMs = function () { return (window.performance && performance.now) ? performance.now() : Date.now(); };
    function bankDwell() {
      if (dwellScreen && segStart && document.visibilityState === "visible") banked += nowMs() - segStart;
      segStart = document.visibilityState === "visible" ? nowMs() : 0;
    }
    function flushDwell() {
      bankDwell();
      if (dwellScreen && banked >= 1000) {
        post({ kind: "dwell", slide: slideIndex(dwellScreen), chapter: chOf(dwellScreen), stage: stageOf(dwellScreen), ms: Math.round(banked) });
        banked = 0;
      }
    }
    function onScreen(sc) {
      if (!sc) return;
      flushDwell();
      banked = 0;
      dwellScreen = sc;
      segStart = document.visibilityState === "visible" ? nowMs() : 0;
    }
    var stageEl = document.getElementById("stage");
    if (stageEl && window.MutationObserver) {
      new MutationObserver(function () {
        var sc = activeScreen();
        if (sc && sc !== dwellScreen) onScreen(sc);
      }).observe(stageEl, { attributes: true, subtree: true, attributeFilter: ["class"] });
    }
    onScreen(activeScreen());
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") flushDwell(); else segStart = nowMs();
    });
    window.addEventListener("pagehide", flushDwell);
    setInterval(flushDwell, 30000);
  }

  // ── 로그인 상태 표시: 헤더에 내 학번 칩(익명이 아님을 명확히). 클릭 = 로그아웃(세션 정리 후 /enter). ──
  (function () {
    var brand = document.querySelector("header .brand");
    if (!brand) return;
    var chip = document.createElement("span");
    chip.style.cssText = "margin-left:10px;padding:3px 10px;border-radius:999px;background:#eef2fb;border:1px solid #cdd9f0;color:#1e40af;font-weight:700;font-size:12px;white-space:nowrap;cursor:pointer";
    chip.textContent = IS_PROF ? "👤 교수 열람" : "👤 " + sid;
    chip.title = IS_PROF ? "" : "클릭하면 로그아웃";
    brand.appendChild(chip);
    chip.addEventListener("click", function () {
      if (IS_PROF) return;
      if (!confirm(sid + " — 로그아웃할까요? (다음 입장은 학번·비밀번호 필요)")) return;
      fetch("/api/auth", { method: "DELETE" }).catch(function () {}).then(function () {
        try { sessionStorage.clear(); } catch (e) {}
        location.href = "/enter";
      });
    });
  })();

  // ── 목차 네비게이터: 챕터 점프(우상단 chrail 이 작아 불편 → 명확한 목차). 학생·교수 공용.
  //    클릭 시 chrail 의 해당 chdot 을 트리거 → 엔진의 show() 재사용(중복 로직 0). ──
  (function () {
    var scs = document.querySelectorAll(".screen");
    if (scs.length < 2) return;
    var chaps = [];
    Array.prototype.forEach.call(scs, function (s) {
      var c = s.getAttribute("data-ch");
      if (c && !chaps.some(function (x) { return x.ch === c; })) chaps.push({ ch: c, title: s.getAttribute("data-chtitle") || "" });
    });
    if (chaps.length < 2) return;
    var st = document.createElement("style");
    st.textContent =
      "#htlToc{position:fixed;left:18px;bottom:74px;z-index:99998;display:flex;align-items:center;gap:6px;background:#18181b;color:#fff;" +
      "border:none;border-radius:999px;padding:10px 15px;font:600 13px/1 -apple-system,'Noto Sans KR',sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.18);cursor:pointer}" +
      "#htlToc:hover{background:#3f3f46}" +
      "#htlTocP{position:fixed;left:18px;bottom:120px;z-index:99999;width:min(288px,84vw);max-height:60vh;overflow:auto;background:#fff;" +
      "border:1px solid #e4e4e7;border-radius:14px;box-shadow:0 12px 34px rgba(0,0,0,.16);padding:8px;display:none}#htlTocP.open{display:block}" +
      ".htlTocItem{display:block;width:100%;text-align:left;border:none;background:none;border-radius:8px;padding:8px 10px;font:13.5px/1.4 sans-serif;color:#3f3f46;cursor:pointer}" +
      ".htlTocItem:hover{background:#f4f4f5}.htlTocItem.cur{background:#eef2fb;color:#1e40af;font-weight:700}" +
      ".htlTocItem b{color:#18181b;margin-right:7px;font-variant-numeric:tabular-nums}.htlTocItem.cur b{color:#1e40af}";
    document.head.appendChild(st);
    var tbtn = document.createElement("button");
    tbtn.id = "htlToc"; tbtn.type = "button"; tbtn.innerHTML = "☰ 목차";
    var tp = document.createElement("div"); tp.id = "htlTocP";
    tp.innerHTML = chaps.map(function (c) { return '<button class="htlTocItem" data-ch="' + c.ch + '"><b>' + c.ch + "</b>" + c.title + "</button>"; }).join("");
    document.body.appendChild(tbtn); document.body.appendChild(tp);
    function curCh() { var a = document.querySelector(".screen.active"); return a ? a.getAttribute("data-ch") : null; }
    tbtn.addEventListener("click", function () {
      tp.classList.toggle("open");
      if (tp.classList.contains("open")) {
        var cc = curCh();
        Array.prototype.forEach.call(tp.children, function (it) { it.classList.toggle("cur", it.getAttribute("data-ch") === cc); });
      }
    });
    tp.addEventListener("click", function (e) {
      var it = e.target.closest ? e.target.closest(".htlTocItem") : null;
      if (!it) return;
      var ch = it.getAttribute("data-ch");
      var dots = document.querySelectorAll("#chrail .chdot");
      for (var i = 0; i < dots.length; i++) { if (dots[i].textContent === ch) { dots[i].click(); break; } }
      tp.classList.remove("open");
    });
    document.addEventListener("click", function (e) {
      if (tp.classList.contains("open") && !tp.contains(e.target) && e.target !== tbtn) tp.classList.remove("open");
    });
  })();

  // ── 챕터 메모(교수 전용): 플로팅 위젯. 학생이 남긴 한 줄 → kind=note. 본인 화면엔 "전달됨"만,
  //    다른 학생·본인에게 대화는 안 보이고 어드민에서만 학생별·챕터별로 모임. (muddiest point 수집) ──
  if (!IS_PROF) {
    var st = document.createElement("style");
    st.textContent =
      "#htlNoteBtn{position:fixed;right:18px;bottom:74px;z-index:99998;display:flex;align-items:center;gap:6px;" +
      "background:#1e40af;color:#fff;border:none;border-radius:999px;padding:10px 16px;font:600 13px/1 -apple-system,'Noto Sans KR',sans-serif;" +
      "box-shadow:0 6px 18px rgba(0,0,0,.18);cursor:pointer}#htlNoteBtn:hover{background:#1d4ed8}" +
      "#htlNotePanel{position:fixed;right:18px;bottom:120px;z-index:99999;width:min(320px,86vw);background:#fff;border:1px solid #e4e4e7;" +
      "border-radius:14px;box-shadow:0 12px 34px rgba(0,0,0,.16);padding:14px;display:none}" +
      "#htlNotePanel.open{display:block}.htlNH{font:700 12px/1.4 sans-serif;color:#52525b;display:flex;align-items:center;gap:6px;margin-bottom:8px}" +
      ".htlLock{font:700 10px/1 sans-serif;color:#1e40af;background:#eef2fb;border:1px solid #cdd9f0;border-radius:999px;padding:2px 7px}" +
      "#htlNoteText{width:100%;box-sizing:border-box;border:1px solid #e4e4e7;border-radius:10px;padding:9px 11px;font:14px/1.5 sans-serif;" +
      "resize:vertical;min-height:56px;outline:none}#htlNoteText:focus{border-color:#1e40af}" +
      ".htlNSend{margin-top:8px;width:100%;background:#1e40af;color:#fff;border:none;border-radius:10px;padding:9px;font:700 13px sans-serif;cursor:pointer}" +
      ".htlNSend:hover{background:#1d4ed8}.htlNOk{margin-top:8px;font:600 12px sans-serif;color:#16a34a;text-align:center;min-height:14px}";
    document.head.appendChild(st);
    var nbtn = document.createElement("button");
    nbtn.id = "htlNoteBtn"; nbtn.type = "button"; nbtn.innerHTML = "💬 이 챕터 질문·메모";
    var np = document.createElement("div"); np.id = "htlNotePanel";
    np.innerHTML =
      '<div class="htlNH">이 챕터 한 줄 메모 <span class="htlLock">🔒 교수님만 봅니다</span></div>' +
      '<textarea id="htlNoteText" maxlength="2000" placeholder="여기서 막혔어요 / 이게 궁금해요…"></textarea>' +
      '<button class="htlNSend" type="button">전송</button><div class="htlNOk"></div>';
    document.body.appendChild(nbtn); document.body.appendChild(np);
    nbtn.addEventListener("click", function () { np.classList.toggle("open"); if (np.classList.contains("open")) np.querySelector("#htlNoteText").focus(); });
    np.querySelector(".htlNSend").addEventListener("click", function () {
      var ta = np.querySelector("#htlNoteText"); var v = (ta.value || "").trim();
      if (!v) return;
      var sc = activeScreen();
      post({ kind: "note", chapter: chOf(sc), stage: stageOf(sc), answer: v.slice(0, 2000) });
      ta.value = "";
      var ok = np.querySelector(".htlNOk"); ok.textContent = "교수님께 전달됨 ✓";
      setTimeout(function () { ok.textContent = ""; np.classList.remove("open"); }, 1500);
    });
  }

  // ── 답안 hook: 문항당 첫 제출만 기록 ────────────────────────────
  //    dedupe = 문항 서수 key + localStorage 영속 (리로드 재제출 중복 기록 차단; 옛 WeakSet 은 리로드에 리셋).
  var DONE_KEY = "na_done_w" + WEEK;
  var doneSet = (function () {
    try { return new Set(JSON.parse(localStorage.getItem(DONE_KEY) || "[]")); } catch (e) { return new Set(); }
  })();
  function markDone(k) {
    doneSet.add(k);
    try { localStorage.setItem(DONE_KEY, JSON.stringify(Array.from(doneSet))); } catch (e) {}
  }
  function langOf(el) { return el.closest(".lang-en") || (el.classList && el.classList.contains("lang-en")) ? "en" : "ko"; }
  function ordinalOf(scr, el, selector) {
    var lang = langOf(el), n = 0;
    var all = scr ? scr.querySelectorAll(selector) : [];
    for (var i = 0; i < all.length; i++) {
      if (langOf(all[i]) !== lang) continue;
      if (all[i] === el) return n;
      n++;
    }
    return n;
  }
  function ansKey(scr, el, section, selector) {
    return WEEK + "|" + (chOf(scr) || "?") + "|" + section + "|" + ordinalOf(scr, el, selector);
  }
  function twinOf(scr, el, selector) {
    if (!scr) return null;
    var lang = langOf(el), want = lang === "ko" ? "en" : "ko";
    var ord = ordinalOf(scr, el, selector), n = 0;
    var all = scr.querySelectorAll(selector);
    for (var i = 0; i < all.length; i++) {
      if (langOf(all[i]) !== want) continue;
      if (n === ord) return all[i];
      n++;
    }
    return null;
  }
  var mirroring = false;
  function textOf(el) { return el ? (el.textContent || "").replace(/\s+/g, " ").trim() : ""; }

  document.addEventListener("click", function (e) {
    if (REVEAL) return; // 딥링크 자동 제출 무시
    var t = e.target;
    if (!t || !t.closest) return;

    // 점검(개념 점검)
    var sub = t.closest(".cp-submit");
    if (sub) {
      setTimeout(function () {
        var cq = sub.closest(".cq");
        if (!cq) return;
        var sel = cq.querySelector(".opt.sel");
        if (!sel) return;                 // 미선택 제출 가드
        var scr = cq.closest(".screen");
        var key = ansKey(scr, cq, "점검", ".cq");
        if (!mirroring && !doneSet.has(key)) {
          markDone(key);
          post({
            kind: "answer", slide: slideIndex(scr), chapter: chOf(scr), section: "점검",
            question: textOf(cq.querySelector(".qn")) || "Q",
            prompt: textOf(cq.querySelector(".qtext")).slice(0, 200),
            answer: textOf(sel),
            isCorrect: sel.getAttribute("data-correct") === "1",
          });
        }
        if (!mirroring) {
          var tw = twinOf(scr, cq, ".cq");
          if (tw && !tw.querySelector(".opt.sel")) {
            var opts = cq.querySelectorAll(".opt"), twOpts = tw.querySelectorAll(".opt");
            var selIdx = Array.prototype.indexOf.call(opts, sel);
            if (selIdx >= 0 && twOpts[selIdx]) {
              mirroring = true;
              try {
                twOpts[selIdx].click();
                var twSub = tw.querySelector(".cp-submit");
                if (twSub) twSub.click();
              } finally { mirroring = false; }
            }
          }
        }
      }, 0);
      return;
    }

    // 연습(공학문제)
    var chk = t.closest(".pr-check");
    if (chk) {
      setTimeout(function () {
        var pb = chk.closest(".prob");
        if (!pb) return;
        var inp = pb.querySelector(".ans-input");
        var raw = inp ? (inp.value || "").trim() : "";
        if (!raw) return;                 // 빈 입력 가드
        var scr = pb.closest(".screen");
        var key = ansKey(scr, pb, "연습", ".prob");
        if (!mirroring && !doneSet.has(key)) {
          markDone(key);
          var fb = pb.querySelector(".pr-fb");
          post({
            kind: "answer", slide: slideIndex(scr), chapter: chOf(scr), section: "연습",
            question: textOf(pb.querySelector(".prob-num")) || "연습",
            prompt: textOf(pb.querySelector(".prob-statement")).slice(0, 200),
            answer: raw,
            isCorrect: fb ? /(^|\s)ok(\s|$)/.test(fb.className) : null,
          });
        }
        if (!mirroring) {
          var tw = twinOf(scr, pb, ".prob");
          if (tw) {
            var twInp = tw.querySelector(".ans-input");
            if (twInp && !(twInp.value || "").trim()) {
              mirroring = true;
              try {
                twInp.value = raw;
                var twChk = tw.querySelector(".pr-check");
                if (twChk) twChk.click();
              } finally { mirroring = false; }
            }
          }
        }
      }, 0);
    }
  });

  // ── 학습 경험 v2: 진도 저장·표시 + 이어보기 + 모바일 세로 스크롤 ──
  (function () {
    var N = document.querySelectorAll(".screen").length;
    if (N < 2) return;

    var st = document.createElement("style");
    st.textContent =
      "#htlProg{display:flex;align-items:center;gap:9px;min-width:0}" +
      "#htlProgTxt{font:600 11.5px/1 -apple-system,'Noto Sans KR',sans-serif;color:#71717a;white-space:nowrap;font-variant-numeric:tabular-nums}" +
      "#htlProgBar{width:120px;height:5px;border-radius:3px;background:#f4f4f5;overflow:hidden}" +
      "#htlProgBar>span{display:block;height:100%;border-radius:3px;background:var(--accent,#18181b);width:0;transition:width .25s ease}" +
      "#htlResume{position:fixed;left:50%;transform:translateX(-50%);bottom:78px;z-index:99999;background:#18181b;color:#fff;border-radius:999px;padding:10px 18px;font:600 13px/1.2 -apple-system,'Noto Sans KR',sans-serif;box-shadow:0 8px 22px rgba(0,0,0,.22);white-space:nowrap}" +
      "#htlResume a{color:#fda4af;text-decoration:underline;text-underline-offset:2px;margin-left:2px}" +
      "@media (max-width:820px){" +
      "html,body{overflow:auto!important;height:auto!important}" +
      "header{height:auto;flex-wrap:wrap;gap:6px;padding:8px 14px}" +
      ".chrail{display:none}" +
      ".stepbar{justify-content:flex-start;overflow-x:auto;-webkit-overflow-scrolling:touch;padding:0 12px}" +
      "main{height:auto!important;overflow:visible!important;padding:16px 14px 120px}" +
      ".stage{height:auto!important;overflow:visible!important;max-width:100%}" +
      ".screen.active{transform:none!important}" +
      ".two,.vizgrid,.learn-grid,.deriv,.sumgrid{display:block!important}" +
      ".two>*,.vizgrid>*,.learn-grid>*,.deriv>*,.sumgrid>*{margin-bottom:14px}" +
      ".stat-grid{grid-template-columns:1fr 1fr!important}" +
      ".terms{grid-template-columns:1fr!important}" +
      "table.ktab{font-size:12px}" +
      "svg{max-width:100%;height:auto}" +
      "footer{position:fixed;left:0;right:0;bottom:0;background:#fff;border-top:1px solid #e4e4e7;z-index:99990;padding:0 14px;height:58px}" +
      ".foot-hint{display:none}" +
      "#htlProgBar{width:70px}" +
      "#htlToc{bottom:72px}" +
      "#htlNoteBtn{bottom:72px}" +
      "}";
    document.head.appendChild(st);

    var PKEY = "na_progress_w" + WEEK;
    var prog;
    try { prog = JSON.parse(localStorage.getItem(PKEY) || "null"); } catch (e) { prog = null; }
    if (!prog || !prog.seen) prog = { seen: [], last: 0, total: N };
    var seenSet = new Set(prog.seen);

    var foot = document.querySelector("footer"), bar = null, txt = null;
    if (foot) {
      var wrap = document.createElement("div");
      wrap.id = "htlProg";
      wrap.innerHTML = '<span id="htlProgTxt"></span><div id="htlProgBar"><span></span></div>';
      var hint = document.getElementById("footHint");
      foot.insertBefore(wrap, hint || null);
      bar = wrap.querySelector("#htlProgBar > span");
      txt = wrap.querySelector("#htlProgTxt");
    }
    function updateBar() {
      if (!bar) return;
      var pct = Math.round((seenSet.size / N) * 100);
      bar.style.width = pct + "%";
      txt.textContent = seenSet.size + "/" + N + " · " + pct + "%";
    }
    function saveProg(idx) {
      seenSet.add(idx);
      prog.seen = Array.from(seenSet);
      prog.last = idx;
      prog.total = N;
      try { localStorage.setItem(PKEY, JSON.stringify(prog)); } catch (e) {}
      updateBar();
    }
    var stageEl2 = document.getElementById("stage");
    if (stageEl2 && window.MutationObserver) {
      new MutationObserver(function () {
        var a = document.querySelector(".screen.active");
        if (a) saveProg(slideIndex(a));
      }).observe(stageEl2, { attributes: true, subtree: true, attributeFilter: ["class"] });
    }
    updateBar();

    var q = new URLSearchParams(location.search);
    if (!REVEAL && !q.has("slide") && !q.has("unit") && prog.last > 0 && prog.last < N) {
      try {
        history.replaceState(null, "", location.pathname + "?slide=" + prog.last);
        var lang = "ko";
        try { lang = localStorage.getItem("lecture_lang") === "en" ? "en" : "ko"; } catch (e) {}
        var tst = document.createElement("div");
        tst.id = "htlResume";
        tst.innerHTML = (lang === "en" ? "Resumed where you left off · " : "저장된 위치에서 이어봅니다 · ") +
          '<a href="' + location.pathname + '?slide=0">' + (lang === "en" ? "start over" : "처음부터") + "</a>";
        document.body.appendChild(tst);
        setTimeout(function () { if (tst.parentNode) tst.parentNode.removeChild(tst); }, 7000);
      } catch (e) {}
    }
  })();
})();
