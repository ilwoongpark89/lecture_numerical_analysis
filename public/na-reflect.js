/* 수치해석 — 서술형 성찰(.longform) 저장·복원.
   · localStorage(학번별 격리): 즉시 저장 + 본인 재방문 시 이어쓰기(공용 PC 교차오염 차단).
   · /api/track note: 로그인 학생은 교수 열람용 서버 저장. 실패 시 pending → 다음 로드에 자동 재전송. */
(function () {
  "use strict";
  if (typeof document === "undefined") return;
  var WEEK = window.NA_WEEK || 0;
  function sidOf() { try { var m = /(?:^|; )na_sid=([^;]*)/.exec(document.cookie); return m ? decodeURIComponent(m[1]) : "anon"; } catch (e) { return "anon"; } }
  function key(qid) { return "na_reflect_" + sidOf() + "_" + WEEK + "_" + qid; }   // 학번 포함 → 공용 PC 에서 앞 학생 글 복원·오전송 차단
  function pkey(qid) { return key(qid) + "_pending"; }
  function isProf() { try { return /(?:^|; )na_sid=__prof__(?:;|$)/.test(document.cookie); } catch (e) { return false; } }

  function markSaved(lf, msg) {
    var b = lf.querySelector(".lf-save"), fb = lf.querySelector(".lf-fb");
    if (b) b.textContent = "수정하기";
    if (fb) { fb.textContent = msg; fb.style.color = "var(--accent)"; }
  }

  // 서버(note) 저장 시도 + 실패 시 pending 표시(다음 로드에 자동 재전송).
  function postNote(qid, v, fb, b) {
    return fetch("/api/track", {
      method: "POST", headers: { "content-type": "application/json" }, credentials: "same-origin",
      body: JSON.stringify({ kind: "note", week: WEEK, chapter: ("생각:" + qid).slice(0, 32), answer: v.slice(0, 2000) })
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (j && j.ok) {
        try { localStorage.removeItem(pkey(qid)); } catch (e) {}
        if (fb) { fb.textContent = "기록됨 ✓ · 교수 열람 + 언제든 수정"; fb.style.color = "var(--accent)"; }
        if (b) b.textContent = "수정하기";
        return true;
      }
      throw new Error("not-ok");
    }).catch(function () {
      try { localStorage.setItem(pkey(qid), "1"); } catch (e) {}
      if (fb) { fb.textContent = "이 기기에 저장됨 · 로그인 후 자동 재전송"; fb.style.color = "var(--accent)"; }
      if (b) b.textContent = "수정하기";
      return false;
    });
  }

  // 재방문 복원 + pending 자동 재전송.
  function restore() {
    Array.prototype.forEach.call(document.querySelectorAll(".longform"), function (lf) {
      var qid = lf.getAttribute("data-qid"); if (!qid) return;
      var input = lf.querySelector(".lf-input"); if (!input) return;
      var saved = null;
      try { saved = localStorage.getItem(key(qid)); } catch (e) {}
      if (saved) {
        input.value = saved; markSaved(lf, "저장됨 ✓ · 언제든 수정 가능");
        var pend = null; try { pend = localStorage.getItem(pkey(qid)); } catch (e) {}
        if (pend && !isProf()) postNote(qid, saved, lf.querySelector(".lf-fb"), lf.querySelector(".lf-save"));
      }
    });
  }

  // 기록하기: localStorage 즉시 저장(학번 격리) → 서버 저장 시도.
  document.addEventListener("click", function (e) {
    var b = (e.target && e.target.closest) ? e.target.closest(".lf-save") : null;
    if (!b) return;
    var lf = b.closest(".longform"); if (!lf) return;
    var input = lf.querySelector(".lf-input"), fb = lf.querySelector(".lf-fb");
    if (isProf()) { if (fb) { fb.textContent = "교수 미리보기 — 저장 안 함"; fb.style.color = "var(--gray2)"; } return; }
    var v = input ? (input.value || "").trim() : "";
    if (!v) { if (fb) { fb.textContent = "내용을 입력하세요"; fb.style.color = "var(--gray2)"; } return; }
    var qid = lf.getAttribute("data-qid") || "reflect";
    try { localStorage.setItem(key(qid), v); } catch (err) {}
    if (fb) { fb.textContent = "저장 중…"; fb.style.color = "var(--gray2)"; }
    postNote(qid, v, fb, b);
  });

  function esc(s) { var d = document.createElement("div"); d.textContent = s || ""; return d.innerHTML; }

  // P4: 교수 읽음 확인 + 회신 + 클래스 우수답변(익명) 을 학생 화면에 표시 (학생→교수 반대 방향).
  function loadFeedback() {
    if (isProf() || WEEK === 0) return;
    fetch("/api/feedback?week=" + WEEK, { credentials: "same-origin" })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j || !j.ok) return;
        (j.mine || []).forEach(function (m) {
          var qid = (m.chapter || "").replace(/^생각:/, "");
          var lf = document.querySelector('.longform[data-qid="' + qid + '"]');
          if (!lf) return;
          var input = lf.querySelector(".lf-input"), fb = lf.querySelector(".lf-fb");
          if (m.read_at && fb && input && (input.value || "").trim()) { fb.textContent = "기록됨 ✓ · 교수님이 읽었어요 👀"; fb.style.color = "var(--accent)"; }
          if (m.reply_body && !lf.querySelector(".lf-reply")) {
            var d = document.createElement("div"); d.className = "lf-reply"; d.innerHTML = "<b>교수님 회신</b> " + esc(m.reply_body); lf.appendChild(d);
          }
        });
        var byQ = {};
        (j.featured || []).forEach(function (f) { var qid = (f.chapter || "").replace(/^생각:/, ""); (byQ[qid] = byQ[qid] || []).push(f.body); });
        Object.keys(byQ).forEach(function (qid) {
          var lf = document.querySelector('.longform[data-qid="' + qid + '"]');
          if (!lf || lf.querySelector(".lf-featured")) return;
          var box = document.createElement("div"); box.className = "lf-featured";
          box.innerHTML = '<div class="lf-featured-h">★ 교수님 pick · 좋은 답변 (익명)</div>' + byQ[qid].map(function (b) { return '<div class="lf-featured-a">' + esc(b) + "</div>"; }).join("");
          lf.appendChild(box);
        });
      }).catch(function () {});
  }

  function init() { restore(); loadFeedback(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
