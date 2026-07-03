/* 수치해석 고유 인터랙티브 — 반복 스테퍼(.stepper).
   학생이 알고리즘을 한 스텝씩 진행하며 표+그래프로 수렴을 관찰한다.
   data-kind: root-bracket | root-tangent | root-secant | fixed-point | matrix-iter | integration
   (채점 인터랙션은 엔진의 .prob/.ans-input + na-track 재사용 — 여기선 탐색·시연만.) */
(function () {
  "use strict";

  // ── 수식 컴파일: "x^3 - x - 2" → JS 함수 ──
  function compileFn(expr, vars) {
    var s = String(expr || "0")
      .replace(/\^/g, "**")
      .replace(/\b(sin|cos|tan|asin|acos|atan|atan2|exp|log2|log10|sqrt|abs|sinh|cosh|tanh|sign|cbrt|floor|ceil|round|pow|max|min)\b/g, "Math.$1")
      .replace(/\bln\b/g, "Math.log")
      .replace(/\bpi\b/gi, "Math.PI")
      .replace(/(^|[^a-zA-Z.])e\b/g, "$1Math.E");
    try { return Function.apply(null, (vars || ["x"]).concat(["var fact=function(k){var r=1;for(var j=2;j<=k;j++)r*=j;return r;};return (" + s + ");"])); }
    catch (e) { return function () { return NaN; }; }
  }
  function num(v, d) { var x = parseFloat(v); return isFinite(x) ? x : d; }
  function fmt(x, p) {
    if (!isFinite(x)) return "—";
    var a = Math.abs(x);
    if (a !== 0 && (a < 1e-4 || a >= 1e6)) return x.toExponential(p == null ? 3 : p);
    return (Math.round(x * 1e8) / 1e8).toString();
  }
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }

  // ── SVG 함수 플롯 (축 + 곡선 + x축), 좌표 매퍼 반환 ──
  function plotBase(fn, xMin, xMax, opts) {
    opts = opts || {};
    var W = 520, H = 300, pad = { l: 34, r: 14, t: 14, b: 30 };
    var pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;
    // y 범위: 샘플링
    var yMin = opts.yMin, yMax = opts.yMax;
    if (yMin == null || yMax == null) {
      var lo = Infinity, hi = -Infinity;
      for (var i = 0; i <= 200; i++) {
        var x = xMin + (i / 200) * (xMax - xMin), y = fn(x);
        if (isFinite(y)) { if (y < lo) lo = y; if (y > hi) hi = y; }
      }
      if (!isFinite(lo)) { lo = -1; hi = 1; }
      if (lo === hi) { lo -= 1; hi += 1; }
      var mg = (hi - lo) * 0.12; yMin = lo - mg; yMax = hi + mg;
    }
    var mx = function (x) { return pad.l + ((x - xMin) / (xMax - xMin)) * pw; };
    var my = function (y) { return pad.t + ph - ((y - yMin) / (yMax - yMin)) * ph; };
    var svg = [];
    svg.push('<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" style="max-width:560px;display:block;margin:0 auto">');
    // grid
    for (var g = 0; g <= 4; g++) {
      var gy = pad.t + (g / 4) * ph;
      svg.push('<line x1="' + pad.l + '" y1="' + gy + '" x2="' + (W - pad.r) + '" y2="' + gy + '" stroke="#eef1f4" stroke-width="1"/>');
    }
    // x-axis (y=0)
    if (yMin < 0 && yMax > 0) {
      var zy = my(0);
      svg.push('<line x1="' + pad.l + '" y1="' + zy + '" x2="' + (W - pad.r) + '" y2="' + zy + '" stroke="#94a3b8" stroke-width="1"/>');
    }
    svg.push('<line x1="' + pad.l + '" y1="' + pad.t + '" x2="' + pad.l + '" y2="' + (pad.t + ph) + '" stroke="#94a3b8" stroke-width="1"/>');
    // curve
    var d = "", started = false;
    for (var k = 0; k <= 300; k++) {
      var xx = xMin + (k / 300) * (xMax - xMin), yy = fn(xx);
      if (!isFinite(yy)) { started = false; continue; }
      d += (started ? "L" : "M") + mx(xx).toFixed(1) + "," + my(yy).toFixed(1) + " "; started = true;
    }
    if (opts.curve !== false) svg.push('<path d="' + d + '" fill="none" stroke="#1e40af" stroke-width="2.4" stroke-linejoin="round"/>');
    return { W: W, H: H, mx: mx, my: my, yMin: yMin, yMax: yMax, svg: svg, close: function () { svg.push("</svg>"); return svg.join(""); } };
  }

  // ════════ 반복 계산 (kind 별) ════════
  function iterate(cfg) {
    var rows = [], k = cfg.kind, steps = cfg.steps;
    if (k === "root-bracket") {
      var f = cfg.f, a = cfg.a, b = cfg.b;
      for (var i = 1; i <= steps; i++) {
        var c = (a + b) / 2, fc = f(c);
        rows.push({ i: i, a: a, b: b, c: c, fc: fc, w: Math.abs(b - a) });
        if (Math.abs(fc) < 1e-13) break;
        if (f(a) * fc < 0) b = c; else a = c;
      }
    } else if (k === "root-tangent") {
      var f2 = cfg.f, df = cfg.df, x = cfg.x0;
      for (var j = 0; j < steps; j++) {
        var fx = f2(x), dfx = df(x), xn = x - fx / dfx;
        rows.push({ i: j, xn: x, fx: fx, dfx: dfx, xn1: xn });
        if (!isFinite(xn) || Math.abs(fx) < 1e-13) break;
        x = xn;
      }
    } else if (k === "root-secant") {
      var f3 = cfg.f, x0 = cfg.x0, x1 = cfg.x1;
      for (var s = 0; s < steps; s++) {
        var f0 = f3(x0), f1 = f3(x1), xn2 = x1 - f1 * (x1 - x0) / (f1 - f0);
        rows.push({ i: s, x0: x0, x1: x1, f1: f1, xn1: xn2 });
        if (!isFinite(xn2) || Math.abs(f1) < 1e-13) break;
        x0 = x1; x1 = xn2;
      }
    } else if (k === "fixed-point") {
      var g = cfg.g, xf = cfg.x0;
      for (var p = 0; p < steps; p++) {
        var gx = g(xf);
        rows.push({ i: p, xn: xf, gxn: gx, diff: Math.abs(gx - xf) });
        if (!isFinite(gx) || Math.abs(gx - xf) < 1e-13) { xf = gx; break; }
        xf = gx;
      }
    } else if (k === "matrix-iter") {
      var A = cfg.A, bb = cfg.b, n = bb.length, xv = cfg.x0.slice(), gs = cfg.mode === "gs";
      var errOf = function (v) { if (!cfg.sol) return null; var m = 0; for (var t = 0; t < n; t++) m = Math.max(m, Math.abs(v[t] - cfg.sol[t])); return m; };
      rows.push({ i: 0, x: xv.slice(), err: errOf(xv) });
      for (var it = 1; it <= steps; it++) {
        var xnew = xv.slice();
        for (var r = 0; r < n; r++) {
          var sum = 0;
          for (var col = 0; col < n; col++) if (col !== r) sum += A[r][col] * (gs ? xnew[col] : xv[col]);
          xnew[r] = (bb[r] - sum) / A[r][r];
        }
        xv = xnew;
        rows.push({ i: it, x: xv.slice(), err: errOf(xv) });
      }
    } else if (k === "integration") {
      var fi = cfg.f, ia = cfg.a, ib = cfg.b, rule = cfg.rule, nn = cfg.n0;
      for (var q = 0; q < steps; q++) {
        var est = rule === "simpson" ? simpson(fi, ia, ib, nn) : trap(fi, ia, ib, nn);
        var er = cfg.trueVal != null ? Math.abs(est - cfg.trueVal) : null;
        rows.push({ i: q, n: nn, h: (ib - ia) / nn, est: est, err: er });
        nn *= 2;
      }
    } else if (k === "ode") {
      var fo = cfg.f, ox = cfg.x0, oy = cfg.y0, oh = cfg.h, om = cfg.method;
      rows.push({ i: 0, x: ox, y: oy, err: cfg.trueFn ? Math.abs(oy - cfg.trueFn(ox)) : null });
      for (var oi = 0; oi < steps; oi++) {
        var kk1 = fo(ox, oy), oyn;
        if (om === "rk4") { var kk2 = fo(ox + oh / 2, oy + oh / 2 * kk1), kk3 = fo(ox + oh / 2, oy + oh / 2 * kk2), kk4 = fo(ox + oh, oy + oh * kk3); oyn = oy + oh / 6 * (kk1 + 2 * kk2 + 2 * kk3 + kk4); }
        else if (om === "heun") { oyn = oy + oh / 2 * (kk1 + fo(ox + oh, oy + oh * kk1)); }
        else { oyn = oy + oh * kk1; }
        ox = ox + oh; oy = oyn;
        rows.push({ i: oi + 1, x: ox, y: oy, err: cfg.trueFn ? Math.abs(oy - cfg.trueFn(ox)) : null });
      }
    } else if (k === "power") {
      var Ap = cfg.A, np = Ap.length, xp = cfg.x0.slice();
      rows.push({ i: 0, lam: null, x: xp.slice(), err: null });
      for (var ip = 1; ip <= steps; ip++) {
        var yp = [];
        for (var rp = 0; rp < np; rp++) { var sp = 0; for (var cp = 0; cp < np; cp++) sp += Ap[rp][cp] * xp[cp]; yp.push(sp); }
        var mxv = yp[0];
        for (var tp = 1; tp < np; tp++) if (Math.abs(yp[tp]) > Math.abs(mxv)) mxv = yp[tp];
        var xnp = yp.map(function (v) { return v / mxv; });
        var epw = cfg.trueLam != null ? Math.abs(mxv - cfg.trueLam) : null;
        rows.push({ i: ip, lam: mxv, x: xnp.slice(), err: epw });
        xp = xnp;
        if (epw != null && epw < 1e-12) break;
      }
    } else if (k === "diff") {
      var fdd = cfg.f, xd = cfg.x0, hd = cfg.h0, cen = cfg.mode === "central";
      for (var qd = 0; qd < steps; qd++) {
        var estd = cen ? (fdd(xd + hd) - fdd(xd - hd)) / (2 * hd) : (fdd(xd + hd) - fdd(xd)) / hd;
        rows.push({ i: qd, h: hd, est: estd, err: cfg.trueD != null ? Math.abs(estd - cfg.trueD) : null });
        hd /= 2;
      }
    } else if (k === "series") {
      var ft = cfg.term, sm = 0;
      for (var qs = 0; qs < steps; qs++) {
        var nn2 = cfg.n0 + qs, term = ft(nn2);
        sm += term;
        rows.push({ i: qs, n: nn2, term: term, sum: sm, err: cfg.trueVal != null ? Math.abs(sm - cfg.trueVal) : null });
      }
    } else if (k === "interp") {
      var pts = cfg.pts, xq = cfg.xq, m = pts.length, xs = [], cc = [];
      for (var pi = 0; pi < m; pi++) { xs.push(pts[pi][0]); cc.push(pts[pi][1]); }
      for (var jj = 1; jj < m; jj++) for (var ii = m - 1; ii >= jj; ii--) cc[ii] = (cc[ii] - cc[ii - 1]) / (xs[ii] - xs[ii - jj]);
      for (var kk = 0; kk < m; kk++) {
        var pk = 0, prod = 1;
        for (var t2 = 0; t2 <= kk; t2++) { pk += cc[t2] * prod; prod *= (xq - xs[t2]); }
        rows.push({ i: kk, ndd: cc[kk], est: pk, err: cfg.trueVal != null ? Math.abs(pk - cfg.trueVal) : null });
      }
    } else if (k === "lsq") {
      var ptsl = cfg.pts, sx = 0, sy = 0, sxy = 0, sxx = 0;
      for (var li = 0; li < ptsl.length; li++) {
        sx += ptsl[li][0]; sy += ptsl[li][1]; sxy += ptsl[li][0] * ptsl[li][1]; sxx += ptsl[li][0] * ptsl[li][0];
        var nl = li + 1, den = nl * sxx - sx * sx, a1l = null, a0l = null;
        if (nl >= 2 && Math.abs(den) > 1e-12) { a1l = (nl * sxy - sx * sy) / den; a0l = (sy - a1l * sx) / nl; }
        rows.push({ i: li, n: nl, sx: sx, sy: sy, a1: a1l, a0: a0l });
      }
    } else if (k === "gauss") {
      var Ag = cfg.A, bg = cfg.b, ng = bg.length;
      var aug = Ag.map(function (row, i) { return row.concat([bg[i]]); });
      rows.push({ i: 0, mat: aug.map(function (r) { return r.slice(); }), op: "초기 augmented [A | b]" });
      var gstep = 1;
      for (var gc = 0; gc < ng; gc++) {
        for (var gr = gc + 1; gr < ng; gr++) {
          var fac = aug[gr][gc] / aug[gc][gc];
          for (var gc2 = gc; gc2 <= ng; gc2++) aug[gr][gc2] -= fac * aug[gc][gc2];
          rows.push({ i: gstep, mat: aug.map(function (r) { return r.slice(); }), op: "R" + (gr + 1) + " ← R" + (gr + 1) + " − (" + fmt(fac, 3) + ")·R" + (gc + 1) + "  (열 " + (gc + 1) + " 소거)" });
          gstep++;
        }
      }
    }
    return rows;
  }
  function trap(f, a, b, n) { var h = (b - a) / n, s = (f(a) + f(b)) / 2; for (var i = 1; i < n; i++) s += f(a + i * h); return s * h; }
  function simpson(f, a, b, n) { if (n % 2) n++; var h = (b - a) / n, s = f(a) + f(b); for (var i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h); return s * h / 3; }

  // ════════ 렌더 (kind 별 plot + table) ════════
  function renderPlot(cfg, rows, step) {
    var k = cfg.kind;
    if (k === "matrix-iter" || k === "power" || k === "diff" || k === "series" || k === "gauss") return "";
    if (k === "interp") {
      var ip = cfg.pts, ixs = ip.map(function (p) { return p[0]; }), iys = ip.map(function (p) { return p[1]; });
      var ixmin = Math.min.apply(null, ixs.concat([cfg.xq])), ixmax = Math.max.apply(null, ixs.concat([cfg.xq]));
      var iymin = Math.min.apply(null, iys), iymax = Math.max.apply(null, iys), ipadx = (ixmax - ixmin) * 0.08 || 1, ipady = (iymax - iymin) * 0.2 || 1;
      var PI = plotBase(function () { return NaN; }, ixmin - ipadx, ixmax + ipadx, { yMin: iymin - ipady, yMax: iymax + ipady, curve: false });
      var kU = Math.max(1, Math.min(step, ip.length)), xs2 = ixs.slice(0, kU), cc2 = iys.slice(0, kU);
      for (var jj2 = 1; jj2 < kU; jj2++) for (var ii2 = kU - 1; ii2 >= jj2; ii2--) cc2[ii2] = (cc2[ii2] - cc2[ii2 - 1]) / (xs2[ii2] - xs2[ii2 - jj2]);
      var Pev = function (xx) { var pk2 = 0, pr2 = 1; for (var t3 = 0; t3 < kU; t3++) { pk2 += cc2[t3] * pr2; pr2 *= (xx - xs2[t3]); } return pk2; };
      var dd = "";
      for (var s4 = 0; s4 <= 120; s4++) { var xx3 = (ixmin - ipadx) + (s4 / 120) * ((ixmax + ipadx) - (ixmin - ipadx)), yy3 = Pev(xx3); if (isFinite(yy3)) dd += (dd ? "L" : "M") + PI.mx(xx3).toFixed(1) + "," + PI.my(yy3).toFixed(1) + " "; }
      if (dd) PI.svg.push('<path d="' + dd + '" fill="none" stroke="#1e40af" stroke-width="2.4"/>');
      if (cfg.xq != null) PI.svg.push('<line x1="' + PI.mx(cfg.xq) + '" y1="14" x2="' + PI.mx(cfg.xq) + '" y2="' + (PI.H - 30) + '" stroke="#16a34a" stroke-width="1" stroke-dasharray="3 3"/>');
      for (var ipp = 0; ipp < kU; ipp++) PI.svg.push('<circle cx="' + PI.mx(ip[ipp][0]) + '" cy="' + PI.my(ip[ipp][1]) + '" r="4.5" fill="#d97706" stroke="#fff" stroke-width="1.5"/>');
      return PI.close();
    }
    if (k === "lsq") {
      var lp = cfg.pts, lxs = lp.map(function (p) { return p[0]; }), lys = lp.map(function (p) { return p[1]; });
      var lxmin = Math.min.apply(null, lxs), lxmax = Math.max.apply(null, lxs), lymin = Math.min.apply(null, lys), lymax = Math.max.apply(null, lys);
      var lpadx = (lxmax - lxmin) * 0.08 || 1, lpady = (lymax - lymin) * 0.15 || 1;
      var PL = plotBase(function () { return NaN; }, lxmin - lpadx, lxmax + lpadx, { yMin: lymin - lpady, yMax: lymax + lpady, curve: false });
      var lcur = rows[Math.max(0, Math.min(step, rows.length) - 1)];
      if (lcur && lcur.a1 != null) {
        var ly1 = lcur.a0 + lcur.a1 * lxmin, ly2 = lcur.a0 + lcur.a1 * lxmax;
        PL.svg.push('<line x1="' + PL.mx(lxmin) + '" y1="' + PL.my(ly1) + '" x2="' + PL.mx(lxmax) + '" y2="' + PL.my(ly2) + '" stroke="#1e40af" stroke-width="2.4"/>');
      }
      for (var lpp = 0; lpp < step && lpp < lp.length; lpp++) PL.svg.push('<circle cx="' + PL.mx(lp[lpp][0]) + '" cy="' + PL.my(lp[lpp][1]) + '" r="4.5" fill="#d97706" stroke="#fff" stroke-width="1.5"/>');
      return PL.close();
    }
    if (k === "integration") {
      var P0 = plotBase(cfg.f, cfg.a, cfg.b, {}); var r0 = rows[Math.max(0, step - 1)]; var n = r0 ? r0.n : cfg.n0;
      var h = (cfg.b - cfg.a) / n;
      for (var i = 0; i < n && i < 400; i++) {
        var xL = cfg.a + i * h, xR = xL + h;
        P0.svg.push('<path d="M' + P0.mx(xL) + ',' + P0.my(0) + ' L' + P0.mx(xL) + ',' + P0.my(cfg.f(xL)) + ' L' + P0.mx(xR) + ',' + P0.my(cfg.f(xR)) + ' L' + P0.mx(xR) + ',' + P0.my(0) + ' Z" fill="#1e40af" fill-opacity="0.10" stroke="#1e40af" stroke-width="0.8"/>');
      }
      return P0.close();
    }
    if (k === "ode") {
      var oxs = rows.map(function (r) { return r.x; }), oys = rows.map(function (r) { return r.y; });
      var ox0 = oxs[0], oxN = oxs[oxs.length - 1];
      var oall = oys.slice();
      if (cfg.trueFn) for (var ot = 0; ot <= 60; ot++) { var oxx = ox0 + (ot / 60) * (oxN - ox0); var ov = cfg.trueFn(oxx); if (isFinite(ov)) oall.push(ov); }
      var olo = Math.min.apply(null, oall), ohi = Math.max.apply(null, oall);
      if (!isFinite(olo)) { olo = -1; ohi = 1; } if (olo === ohi) { olo -= 1; ohi += 1; }
      var omg = (ohi - olo) * 0.12;
      var PO = plotBase(function () { return NaN; }, ox0, oxN, { yMin: olo - omg, yMax: ohi + omg, curve: false });
      if (cfg.trueFn) { var td = ""; for (var t2 = 0; t2 <= 120; t2++) { var xx2 = ox0 + (t2 / 120) * (oxN - ox0); var yv2 = cfg.trueFn(xx2); if (isFinite(yv2)) td += (td ? "L" : "M") + PO.mx(xx2).toFixed(1) + "," + PO.my(yv2).toFixed(1) + " "; } PO.svg.push('<path d="' + td + '" fill="none" stroke="#94a3b8" stroke-width="1.6" stroke-dasharray="5 3"/>'); }
      var nd = "";
      for (var s2 = 0; s2 < step && s2 < rows.length; s2++) nd += (s2 ? "L" : "M") + PO.mx(rows[s2].x).toFixed(1) + "," + PO.my(rows[s2].y).toFixed(1) + " ";
      if (nd) PO.svg.push('<path d="' + nd + '" fill="none" stroke="#1e40af" stroke-width="2.4"/>');
      for (var s3 = 0; s3 < step && s3 < rows.length; s3++) PO.svg.push('<circle cx="' + PO.mx(rows[s3].x).toFixed(1) + '" cy="' + PO.my(rows[s3].y).toFixed(1) + '" r="3.5" fill="#1e40af"/>');
      return PO.close();
    }
    // root/fixed-point plots
    var fn = k === "fixed-point" ? cfg.g : cfg.f;
    var P = plotBase(k === "fixed-point" ? cfg.g : cfg.f, cfg.xmin, cfg.xmax, k === "fixed-point" ? { curve: false } : {});
    if (k === "fixed-point") {
      // y=x and y=g(x) + cobweb
      var d1 = "", d2 = "";
      for (var t = 0; t <= 200; t++) { var xx = cfg.xmin + (t / 200) * (cfg.xmax - cfg.xmin); d1 += (t ? "L" : "M") + P.mx(xx) + "," + P.my(xx) + " "; var gy = cfg.g(xx); if (isFinite(gy)) d2 += (t ? "L" : "M") + P.mx(xx) + "," + P.my(gy) + " "; }
      P.svg.push('<path d="' + d1 + '" fill="none" stroke="#94a3b8" stroke-width="1.4" stroke-dasharray="4 3"/>');
      P.svg.push('<path d="' + d2 + '" fill="none" stroke="#1e40af" stroke-width="2.4"/>');
      var cx = cfg.x0;
      for (var c = 0; c < step && c < rows.length; c++) {
        var g1 = rows[c].gxn;
        P.svg.push('<line x1="' + P.mx(cx) + '" y1="' + P.my(cx) + '" x2="' + P.mx(cx) + '" y2="' + P.my(g1) + '" stroke="#0891b2" stroke-width="1.3"/>');
        P.svg.push('<line x1="' + P.mx(cx) + '" y1="' + P.my(g1) + '" x2="' + P.mx(g1) + '" y2="' + P.my(g1) + '" stroke="#0891b2" stroke-width="1.3"/>');
        cx = g1;
      }
      return P.close();
    }
    if (k === "root-bracket") {
      var cur = rows[Math.min(step, rows.length) - 1];
      if (cur && step > 0) {
        P.svg.push('<rect x="' + P.mx(cur.a) + '" y="14" width="' + (P.mx(cur.b) - P.mx(cur.a)) + '" height="' + (P.H - 44) + '" fill="#1e40af" fill-opacity="0.08" stroke="#1e40af" stroke-dasharray="5 3" stroke-width="1.3"/>');
        P.svg.push('<line x1="' + P.mx(cur.c) + '" y1="14" x2="' + P.mx(cur.c) + '" y2="' + (P.H - 30) + '" stroke="#d97706" stroke-width="1.5" stroke-dasharray="4 3"/>');
        P.svg.push('<circle cx="' + P.mx(cur.c) + '" cy="' + P.my(cur.fc) + '" r="4.5" fill="#d97706" stroke="#fff" stroke-width="1.5"/>');
      }
      if (cfg.root != null) P.svg.push('<line x1="' + P.mx(cfg.root) + '" y1="14" x2="' + P.mx(cfg.root) + '" y2="' + (P.H - 30) + '" stroke="#16a34a" stroke-width="1" stroke-dasharray="2 4"/>');
      return P.close();
    }
    if (k === "root-tangent" || k === "root-secant") {
      for (var ti = 0; ti < step && ti < rows.length; ti++) {
        var R = rows[ti], op = (0.35 + 0.65 * (ti / Math.max(step - 1, 1))).toFixed(2);
        if (k === "root-tangent") {
          var xL2 = R.xn - (cfg.xmax - cfg.xmin) * 0.28, xR2 = R.xn + (cfg.xmax - cfg.xmin) * 0.16;
          var ty = function (t) { return R.fx + R.dfx * (t - R.xn); };
          P.svg.push('<line x1="' + P.mx(xL2) + '" y1="' + P.my(ty(xL2)) + '" x2="' + P.mx(xR2) + '" y2="' + P.my(ty(xR2)) + '" stroke="#0891b2" stroke-width="1.5" stroke-dasharray="5 3" opacity="' + op + '"/>');
          P.svg.push('<circle cx="' + P.mx(R.xn) + '" cy="' + P.my(R.fx) + '" r="4" fill="#1e40af" opacity="' + op + '"/>');
          P.svg.push('<circle cx="' + P.mx(R.xn1) + '" cy="' + P.my(0) + '" r="4" fill="#d97706" opacity="' + op + '"/>');
        } else {
          P.svg.push('<circle cx="' + P.mx(R.x1) + '" cy="' + P.my(R.f1) + '" r="4" fill="#1e40af" opacity="' + op + '"/>');
          P.svg.push('<circle cx="' + P.mx(R.xn1) + '" cy="' + P.my(0) + '" r="4" fill="#d97706" opacity="' + op + '"/>');
        }
      }
      if (cfg.root != null) P.svg.push('<line x1="' + P.mx(cfg.root) + '" y1="14" x2="' + P.mx(cfg.root) + '" y2="' + (P.H - 30) + '" stroke="#16a34a" stroke-width="1" stroke-dasharray="2 4"/>');
      return P.close();
    }
    return P.close();
  }

  function renderTable(cfg, rows, step) {
    var k = cfg.kind, head, body = "";
    var shown = rows.slice(0, step);
    if (k === "gauss") {
      var gcur = rows[Math.max(0, Math.min(step, rows.length) - 1)] || rows[0];
      var gm = gcur.mat, gn = gm.length;
      var grh = gm.map(function (mr) { return "<tr>" + mr.map(function (v, ci) { return '<td' + (ci === gn ? ' class="stp-k"' : "") + ">" + fmt(v, 3) + "</td>"; }).join("") + "</tr>"; }).join("");
      return '<div class="stp-note" style="margin:0 0 10px">' + esc(gcur.op) + '</div><div class="stp-tblwrap"><table class="stp-tbl"><tbody>' + grh + "</tbody></table></div>";
    }
    if (k === "root-bracket") {
      head = ["k", "a", "b", "c=(a+b)/2", "f(c)", "|b−a|"];
      shown.forEach(function (r) { body += tr([r.i, fmt(r.a, 5), fmt(r.b, 5), fmt(r.c, 6), fmt(r.fc, 3), fmt(r.w, 3)]); });
    } else if (k === "root-tangent") {
      head = ["n", "xₙ", "f(xₙ)", "f'(xₙ)", "xₙ₊₁"];
      shown.forEach(function (r) { body += tr([r.i, fmt(r.xn, 8), fmt(r.fx, 3), fmt(r.dfx, 4), fmt(r.xn1, 8)]); });
    } else if (k === "root-secant") {
      head = ["n", "xₙ₋₁", "xₙ", "f(xₙ)", "xₙ₊₁"];
      shown.forEach(function (r) { body += tr([r.i, fmt(r.x0, 6), fmt(r.x1, 6), fmt(r.f1, 3), fmt(r.xn1, 8)]); });
    } else if (k === "fixed-point") {
      head = ["n", "xₙ", "g(xₙ)", "|Δ|"];
      shown.forEach(function (r) { body += tr([r.i, fmt(r.xn, 8), fmt(r.gxn, 8), fmt(r.diff, 3)]); });
    } else if (k === "matrix-iter") {
      var n = cfg.b.length, cols = ["k"]; for (var c = 0; c < n; c++) cols.push("x" + (c + 1)); if (cfg.sol) cols.push("max err");
      head = cols;
      shown.forEach(function (r) { var cells = [r.i]; r.x.forEach(function (v) { cells.push(fmt(v, 6)); }); if (cfg.sol) cells.push(r.err == null ? "" : r.err.toExponential(2)); body += tr(cells); });
    } else if (k === "integration") {
      head = ["단계", "n", "h", "적분 근사", cfg.trueVal != null ? "오차" : "Δ"];
      shown.forEach(function (r, idx) { var last = idx > 0 ? shown[idx - 1].est : null; body += tr([r.i + 1, r.n, fmt(r.h, 4), fmt(r.est, 8), r.err != null ? r.err.toExponential(2) : (last != null ? Math.abs(r.est - last).toExponential(2) : "—")]); });
    } else if (k === "ode") {
      head = cfg.trueFn ? ["n", "xₙ", "yₙ (근사)", "정확해", "오차"] : ["n", "xₙ", "yₙ"];
      shown.forEach(function (r) { var c = [r.i, fmt(r.x, 4), fmt(r.y, 6)]; if (cfg.trueFn) { c.push(fmt(cfg.trueFn(r.x), 6)); c.push(r.err != null ? r.err.toExponential(2) : "—"); } body += tr(c); });
    } else if (k === "power") {
      var npw = cfg.x0.length, chp = ["k", "λ (최대성분)"]; for (var zc = 0; zc < npw; zc++) chp.push("x" + (zc + 1)); if (cfg.trueLam != null) chp.push("오차");
      head = chp;
      shown.forEach(function (r) { var cells = [r.i, r.lam == null ? "—" : fmt(r.lam, 5)]; for (var z = 0; z < npw; z++) cells.push(fmt(r.x[z], 4)); if (cfg.trueLam != null) cells.push(r.err == null ? "—" : r.err.toExponential(2)); body += tr(cells); });
    } else if (k === "diff") {
      head = ["단계", "h", "근사 f′", cfg.trueD != null ? "오차" : "Δ"];
      shown.forEach(function (r, idx) { var last = idx > 0 ? shown[idx - 1].est : null; body += tr([r.i + 1, fmt(r.h, 5), fmt(r.est, 8), r.err != null ? r.err.toExponential(2) : (last != null ? Math.abs(r.est - last).toExponential(2) : "—")]); });
    } else if (k === "series") {
      head = ["n", "항", "부분합", cfg.trueVal != null ? "오차(잘린 꼬리)" : "Δ"];
      shown.forEach(function (r, idx) { var last = idx > 0 ? shown[idx - 1].sum : null; body += tr([r.n, fmt(r.term, 6), fmt(r.sum, 8), r.err != null ? r.err.toExponential(2) : (last != null ? Math.abs(r.sum - last).toExponential(2) : "—")]); });
    } else if (k === "interp") {
      head = ["점 수", "새 분할차분", "P(x_q)", cfg.trueVal != null ? "오차" : "Δ"];
      shown.forEach(function (r, idx) { var last = idx > 0 ? shown[idx - 1].est : null; body += tr([r.i + 1, fmt(r.ndd, 5), fmt(r.est, 6), r.err != null ? r.err.toExponential(2) : (last != null ? Math.abs(r.est - last).toExponential(2) : "—")]); });
    } else if (k === "lsq") {
      head = ["점 수", "Σx", "Σy", "기울기 a₁", "절편 a₀"];
      shown.forEach(function (r) { body += tr([r.n, fmt(r.sx, 3), fmt(r.sy, 3), r.a1 == null ? "—" : fmt(r.a1, 4), r.a0 == null ? "—" : fmt(r.a0, 4)]); });
    }
    var ths = head.map(function (h) { return "<th>" + esc(h) + "</th>"; }).join("");
    return '<div class="stp-tblwrap"><table class="stp-tbl"><thead><tr>' + ths + "</tr></thead><tbody>" + (body || '<tr><td colspan="' + head.length + '" class="stp-empty">"다음 반복" 을 눌러 시작하세요</td></tr>') + "</tbody></table></div>";
  }
  function tr(cells) { return "<tr>" + cells.map(function (c, i) { return '<td' + (i === 0 ? ' class="stp-k"' : "") + ">" + esc(c) + "</td>"; }).join("") + "</tr>"; }

  function statusLine(cfg, rows, step) {
    if (step === 0) return "";
    var r = rows[Math.min(step, rows.length) - 1];
    if (cfg.kind === "ode") return "x=" + fmt(r.x, 3) + ", y≈" + fmt(r.y, 5) + (r.err != null ? " · 오차 " + r.err.toExponential(2) : "");
    if (cfg.kind === "power") return r.lam == null ? "" : ((r.err != null && r.err < 1e-4) ? "✓ 수렴 — 지배 고유값 λ ≈ " + fmt(r.lam, 6) : "λ ≈ " + fmt(r.lam, 6) + (r.err != null ? " · 오차 " + r.err.toExponential(2) : ""));
    if (cfg.kind === "diff") return "h=" + fmt(r.h, 5) + " · 근사 f′ ≈ " + fmt(r.est, 6) + (r.err != null ? ((r.err < 1e-6 ? " · ✓ 오차 " : " · 오차 ") + r.err.toExponential(2)) : "");
    if (cfg.kind === "series") return "부분합 ≈ " + fmt(r.sum, 8) + (r.err != null ? ((r.err < 1e-6 ? " · ✓ 오차 " : " · 오차 ") + r.err.toExponential(2)) : "");
    if (cfg.kind === "interp") return "점 " + (r.i + 1) + "개 · P(" + fmt(cfg.xq, 3) + ") ≈ " + fmt(r.est, 6) + (r.err != null ? ((r.err < 1e-9 ? " · ✓ 정확 오차 " : " · 오차 ") + r.err.toExponential(2)) : "");
    if (cfg.kind === "lsq") return r.a1 == null ? "점 " + r.n + "개 · 직선 미정(≥2점 필요)" : "점 " + r.n + "개 · 적합 직선 y = " + fmt(r.a0, 4) + " + " + fmt(r.a1, 4) + "x";
    if (cfg.kind === "gauss") return step >= rows.length - 1 ? "✓ 상삼각 완성 — 이제 후진대입으로 해를 얻는다" : "전진 소거 중 (" + step + " / " + (rows.length - 1) + ")";
    if (cfg.kind === "matrix-iter") return r.err == null ? "" : (r.err < 1e-4 ? "✓ 수렴 — 정확한 해에 도달" : "max error = " + r.err.toExponential(2) + " · 정답에 접근 중");
    if (cfg.kind === "integration") return r.err != null ? (r.err < 1e-6 ? "✓ 충분히 수렴 (오차 " + r.err.toExponential(2) + ")" : "오차 " + r.err.toExponential(2) + " · n 을 2배로 세분하면 오차 급감") : "n=" + r.n + " · 근사 " + fmt(r.est, 8);
    var approx = cfg.kind === "root-bracket" ? r.c : (cfg.kind === "fixed-point" ? r.gxn : r.xn1);
    var e = cfg.root != null ? Math.abs(approx - cfg.root) : null;
    if (e != null) return e < 1e-6 ? "✓ 수렴 — 근 ≈ " + fmt(approx, 8) + " (오차 " + e.toExponential(2) + ")" : "근사 근 ≈ " + fmt(approx, 8) + " · 오차 " + e.toExponential(2);
    return "근사 근 ≈ " + fmt(approx, 8);
  }

  // ── 파싱 + 초기화 ──
  function parseCfg(el) {
    var kind = el.getAttribute("data-kind") || "root-tangent";
    var cfg = { kind: kind, steps: parseInt(el.getAttribute("data-steps") || "10", 10) };
    if (kind === "matrix-iter") {
      try { cfg.A = JSON.parse(el.getAttribute("data-a")); cfg.b = JSON.parse(el.getAttribute("data-b")); cfg.x0 = JSON.parse(el.getAttribute("data-x0") || "null") || cfg.b.map(function () { return 0; }); } catch (e) { cfg.A = [[1]]; cfg.b = [0]; cfg.x0 = [0]; }
      cfg.mode = el.getAttribute("data-mode") || "jacobi";
      try { cfg.sol = JSON.parse(el.getAttribute("data-sol") || "null"); } catch (e) { cfg.sol = null; }
      cfg.steps = cfg.steps || 12;
    } else if (kind === "integration") {
      cfg.f = compileFn(el.getAttribute("data-fn")); cfg.a = num(el.getAttribute("data-a"), 0); cfg.b = num(el.getAttribute("data-b"), 1);
      cfg.rule = el.getAttribute("data-rule") || "trap"; cfg.n0 = parseInt(el.getAttribute("data-n0") || "2", 10);
      var tv = el.getAttribute("data-true"); cfg.trueVal = tv != null ? num(tv, null) : null; cfg.steps = cfg.steps || 7;
    } else if (kind === "ode") {
      cfg.f = compileFn(el.getAttribute("data-fn"), ["x", "y"]);
      cfg.x0 = num(el.getAttribute("data-x0"), 0); cfg.y0 = num(el.getAttribute("data-y0"), 1);
      cfg.h = num(el.getAttribute("data-h"), 0.1); cfg.method = el.getAttribute("data-method") || "euler";
      var xend = el.getAttribute("data-xend");
      cfg.steps = xend != null ? Math.max(1, Math.round((num(xend, 1) - cfg.x0) / cfg.h)) : parseInt(el.getAttribute("data-steps") || "10", 10);
      var otf = el.getAttribute("data-true"); cfg.trueFn = otf ? compileFn(otf, ["x"]) : null;
    } else if (kind === "power") {
      try { cfg.A = JSON.parse(el.getAttribute("data-a")); cfg.x0 = JSON.parse(el.getAttribute("data-x0") || "null") || cfg.A.map(function () { return 1; }); } catch (e) { cfg.A = [[1]]; cfg.x0 = [1]; }
      var tl = el.getAttribute("data-true"); cfg.trueLam = tl != null ? num(tl, null) : null; cfg.steps = cfg.steps || 10;
    } else if (kind === "diff") {
      cfg.f = compileFn(el.getAttribute("data-fn")); cfg.x0 = num(el.getAttribute("data-x0"), 1); cfg.h0 = num(el.getAttribute("data-h0"), 0.5);
      cfg.mode = el.getAttribute("data-mode") || "central"; var td = el.getAttribute("data-true"); cfg.trueD = td != null ? num(td, null) : null; cfg.steps = cfg.steps || 8;
    } else if (kind === "series") {
      cfg.term = compileFn(el.getAttribute("data-term"), ["n"]); cfg.n0 = parseInt(el.getAttribute("data-n0") || "0", 10);
      var tv2 = el.getAttribute("data-true"); cfg.trueVal = tv2 != null ? num(tv2, null) : null; cfg.steps = cfg.steps || 10;
    } else if (kind === "interp") {
      try { cfg.pts = JSON.parse(el.getAttribute("data-pts")); } catch (e) { cfg.pts = [[0, 0], [1, 1]]; }
      cfg.xq = num(el.getAttribute("data-xq"), 0); var tv3 = el.getAttribute("data-true"); cfg.trueVal = tv3 != null ? num(tv3, null) : null; cfg.steps = cfg.pts.length;
    } else if (kind === "lsq") {
      try { cfg.pts = JSON.parse(el.getAttribute("data-pts")); } catch (e) { cfg.pts = [[0, 0], [1, 1]]; }
      cfg.steps = cfg.pts.length;
    } else if (kind === "gauss") {
      try { cfg.A = JSON.parse(el.getAttribute("data-a")); cfg.b = JSON.parse(el.getAttribute("data-b")); } catch (e) { cfg.A = [[1]]; cfg.b = [0]; }
      cfg.steps = cfg.b.length * (cfg.b.length - 1) / 2;
    } else {
      cfg.f = compileFn(el.getAttribute("data-fn"));
      cfg.xmin = num(el.getAttribute("data-xmin"), 0); cfg.xmax = num(el.getAttribute("data-xmax"), 2);
      cfg.root = el.getAttribute("data-root") != null ? num(el.getAttribute("data-root"), null) : null;
      if (kind === "root-bracket") { cfg.a = num(el.getAttribute("data-a"), cfg.xmin); cfg.b = num(el.getAttribute("data-b"), cfg.xmax); cfg.steps = cfg.steps || 12; }
      if (kind === "root-tangent") { cfg.df = compileFn(el.getAttribute("data-dfn")); cfg.x0 = num(el.getAttribute("data-x0"), (cfg.xmin + cfg.xmax) / 2); cfg.steps = cfg.steps || 8; }
      if (kind === "root-secant") { cfg.x0 = num(el.getAttribute("data-x0"), cfg.xmin); cfg.x1 = num(el.getAttribute("data-x1"), cfg.xmax); cfg.steps = cfg.steps || 10; }
      if (kind === "fixed-point") { cfg.g = compileFn(el.getAttribute("data-gfn")); cfg.x0 = num(el.getAttribute("data-x0"), (cfg.xmin + cfg.xmax) / 2); cfg.steps = cfg.steps || 12; }
    }
    return cfg;
  }

  function init(el) {
    if (el.getAttribute("data-init")) return; el.setAttribute("data-init", "1");
    var cfg = parseCfg(el);
    var rows = iterate(cfg);
    var maxStep = rows.length;
    var step = 0, timer = null;
    var title = el.getAttribute("data-title") || "반복 시연";
    var note = el.getAttribute("data-note") || "";
    el.innerHTML =
      '<div class="stp-head">' + esc(title) + "</div>" +
      (note ? '<div class="stp-note">' + note + "</div>" : "") +
      '<div class="stp-body"><div class="stp-viz"></div><div class="stp-side"></div></div>' +
      '<div class="stp-ctrl">' +
      '<button type="button" class="stp-btn stp-next">다음 반복 →</button>' +
      '<button type="button" class="stp-btn stp-play">자동 재생</button>' +
      '<button type="button" class="stp-btn stp-reset">초기화</button>' +
      '<input type="range" class="stp-range" min="0" max="' + maxStep + '" value="0"/>' +
      '<span class="stp-count">0 / ' + maxStep + "</span></div>" +
      '<div class="stp-status"></div>';
    var viz = el.querySelector(".stp-viz"), side = el.querySelector(".stp-side"), status = el.querySelector(".stp-status");
    var range = el.querySelector(".stp-range"), count = el.querySelector(".stp-count");
    var nextB = el.querySelector(".stp-next"), playB = el.querySelector(".stp-play"), resetB = el.querySelector(".stp-reset");

    function render() {
      var plot = renderPlot(cfg, rows, step);
      viz.innerHTML = plot; viz.style.display = plot ? "block" : "none";
      side.innerHTML = renderTable(cfg, rows, step);
      status.innerHTML = statusLine(cfg, rows, step);
      status.className = "stp-status" + (step > 0 && /✓/.test(status.textContent) ? " ok" : "");
      range.value = step; count.textContent = step + " / " + maxStep;
      nextB.disabled = step >= maxStep;
    }
    function go(s) { step = Math.max(0, Math.min(maxStep, s)); render(); }
    nextB.addEventListener("click", function () { go(step + 1); });
    resetB.addEventListener("click", function () { stop(); go(0); });
    range.addEventListener("input", function () { stop(); go(parseInt(range.value, 10)); });
    function stop() { if (timer) { clearInterval(timer); timer = null; playB.textContent = "자동 재생"; } }
    playB.addEventListener("click", function () {
      if (timer) { stop(); return; }
      if (step >= maxStep) go(0);
      playB.textContent = "일시정지";
      timer = setInterval(function () { if (step >= maxStep) { stop(); return; } go(step + 1); }, 700);
    });
    render();
  }

  function initAll() { Array.prototype.forEach.call(document.querySelectorAll(".stepper"), init); }
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initAll);
    else initAll();
  }
  if (typeof module !== "undefined" && module.exports) module.exports = { compileFn: compileFn, iterate: iterate, trap: trap, simpson: simpson };
})();
