/* 수치해석 — 서술형 성찰(.longform) 저장·복원.
   학생이 자기 생각을 자유롭게 써서 기록한다.
   · localStorage: 즉시 저장 + 본인 재방문 시 이어쓰기(서버·로그인 무관 항상 보존).
   · /api/track note: 로그인 학생은 교수 열람용으로도 서버 저장.
   백엔드 미구성/미로그인이어도 글은 이 기기에 안전히 남는다. */
(function () {
  "use strict";
  if (typeof document === "undefined") return;
  var WEEK = window.NA_WEEK || 0;
  function key(qid) { return "na_reflect_" + WEEK + "_" + qid; }

  function markSaved(lf, msg) {
    var b = lf.querySelector(".lf-save"), fb = lf.querySelector(".lf-fb");
    if (b) b.textContent = "수정하기";
    if (fb) { fb.textContent = msg; fb.style.color = "var(--accent)"; }
  }

  // 재방문 복원: 이 기기에 저장한 글을 textarea 에 다시 채운다.
  function restore() {
    Array.prototype.forEach.call(document.querySelectorAll(".longform"), function (lf) {
      var qid = lf.getAttribute("data-qid"); if (!qid) return;
      var input = lf.querySelector(".lf-input"); if (!input) return;
      var saved = null;
      try { saved = localStorage.getItem(key(qid)); } catch (e) {}
      if (saved) { input.value = saved; markSaved(lf, "저장됨 ✓ · 언제든 수정 가능"); }
    });
  }

  // 기록하기: localStorage 즉시 저장 → 서버(note) 저장 시도.
  document.addEventListener("click", function (e) {
    var b = (e.target && e.target.closest) ? e.target.closest(".lf-save") : null;
    if (!b) return;
    var lf = b.closest(".longform"); if (!lf) return;
    var input = lf.querySelector(".lf-input"), fb = lf.querySelector(".lf-fb");
    var v = input ? (input.value || "").trim() : "";
    if (!v) { if (fb) { fb.textContent = "내용을 입력하세요"; fb.style.color = "var(--gray2)"; } return; }
    var qid = lf.getAttribute("data-qid") || "reflect";
    try { localStorage.setItem(key(qid), v); } catch (err) {}
    if (fb) { fb.textContent = "저장 중…"; fb.style.color = "var(--gray2)"; }
    fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ kind: "note", week: WEEK, chapter: ("생각:" + qid).slice(0, 32), answer: v.slice(0, 2000) })
    })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (fb) { fb.textContent = (j && j.ok) ? "기록됨 ✓ · 교수 열람 + 언제든 수정" : "이 기기에 저장됨 · 로그인 후 서버 반영"; fb.style.color = "var(--accent)"; }
        b.textContent = "수정하기";
      })
      .catch(function () {
        if (fb) { fb.textContent = "이 기기에 저장됨 · 언제든 수정"; fb.style.color = "var(--accent)"; }
        b.textContent = "수정하기";
      });
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", restore);
  else restore();
})();
