"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

/* ── Data ── */
const tabs = [
  { id: "basic", label: "기본 plot" },
  { id: "format", label: "그래프 꾸미기" },
  { id: "hold", label: "hold on/off" },
  { id: "subplot", label: "subplot" },
  { id: "others", label: "기타 플롯" },
  { id: "practice", label: "실전 예제" },
];

const lineStyles = [
  { code: "'-'", label: "실선", svg: "M4,12 L56,12" },
  { code: "'--'", label: "파선", svg: "M4,12 L56,12", dash: "8,4" },
  { code: "':'", label: "점선", svg: "M4,12 L56,12", dash: "2,4" },
  { code: "'-.'", label: "일점쇄선", svg: "M4,12 L56,12", dash: "8,4,2,4" },
];

const colors = [
  { code: "'r'", label: "Red", hex: "#ef4444" },
  { code: "'g'", label: "Green", hex: "#22c55e" },
  { code: "'b'", label: "Blue", hex: "#3b82f6" },
  { code: "'k'", label: "Black", hex: "#e2e8f0" },
  { code: "'c'", label: "Cyan", hex: "#06b6d4" },
  { code: "'m'", label: "Magenta", hex: "#d946ef" },
  { code: "'y'", label: "Yellow", hex: "#eab308" },
];

const markers = [
  { code: "'o'", label: "Circle", shape: "circle" },
  { code: "'s'", label: "Square", shape: "square" },
  { code: "'d'", label: "Diamond", shape: "diamond" },
  { code: "'^'", label: "Up Triangle", shape: "triUp" },
  { code: "'v'", label: "Down Triangle", shape: "triDown" },
  { code: "'*'", label: "Star", shape: "star" },
  { code: "'+'", label: "Plus", shape: "plus" },
];

const otherPlots = [
  { name: "bar(x, y)", label: "막대 그래프", desc: "범주별 데이터 비교에 적합" },
  { name: "scatter(x, y)", label: "산점도", desc: "두 변수의 상관관계 분석" },
  { name: "histogram(data)", label: "히스토그램", desc: "데이터 분포 확인" },
  { name: "semilogy(x, y)", label: "반로그 스케일", desc: "y축만 로그 스케일 (오차 수렴 분석)" },
  { name: "loglog(x, y)", label: "양로그 스케일", desc: "x, y 모두 로그 스케일 (차수 분석)" },
];

/* ── Helpers ── */
function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/50">
      {title && (
        <div className="bg-slate-800/80 px-4 py-2 text-xs text-slate-400 border-b border-slate-700/50 font-mono">
          {title}
        </div>
      )}
      <pre className="bg-slate-950/80 p-4 overflow-x-auto text-sm leading-relaxed font-mono text-gray-300">
        {children}
      </pre>
    </div>
  );
}

function MarkerSVG({ shape }: { shape: string }) {
  const c = "#34d399";
  const props = { fill: c, stroke: c, strokeWidth: 1.5 };
  switch (shape) {
    case "circle":
      return <circle cx="12" cy="12" r="5" {...props} fillOpacity={0.3} />;
    case "square":
      return <rect x="7" y="7" width="10" height="10" {...props} fillOpacity={0.3} />;
    case "diamond":
      return <polygon points="12,5 19,12 12,19 5,12" {...props} fillOpacity={0.3} />;
    case "triUp":
      return <polygon points="12,5 19,19 5,19" {...props} fillOpacity={0.3} />;
    case "triDown":
      return <polygon points="5,5 19,5 12,19" {...props} fillOpacity={0.3} />;
    case "star":
      return <text x="12" y="17" textAnchor="middle" fill={c} fontSize="16" fontWeight="bold">*</text>;
    case "plus":
      return (
        <g stroke={c} strokeWidth={2.5}>
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </g>
      );
    default:
      return null;
  }
}

/* ── SVG Charts ── */
function HoldOnChart() {
  // sin, cos, sin+cos on [0, 2pi]
  const N = 60;
  const pts = Array.from({ length: N }, (_, i) => {
    const x = (i / (N - 1)) * 2 * Math.PI;
    return { x, sinx: Math.sin(x), cosx: Math.cos(x), sum: Math.sin(x) + Math.cos(x) };
  });
  const mapX = (x: number) => 50 + (x / (2 * Math.PI)) * 320;
  const mapY = (y: number) => 120 - y * 70;
  const toPath = (vals: number[]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${mapX(p.x).toFixed(1)},${mapY(vals[i]).toFixed(1)}`).join(" ");

  return (
    <svg viewBox="0 0 420 240" className="w-full max-w-lg mx-auto">
      {/* grid */}
      {[-1, 0, 1].map((v) => (
        <line key={v} x1="50" y1={mapY(v)} x2="370" y2={mapY(v)} stroke="#334155" strokeWidth={0.5} />
      ))}
      <line x1="50" y1="30" x2="50" y2="210" stroke="#475569" strokeWidth={1} />
      <line x1="50" y1={mapY(0)} x2="370" y2={mapY(0)} stroke="#475569" strokeWidth={1} />
      {/* curves */}
      <path d={toPath(pts.map((p) => p.sinx))} fill="none" stroke="#3b82f6" strokeWidth={2} />
      <path d={toPath(pts.map((p) => p.cosx))} fill="none" stroke="#ef4444" strokeWidth={2} />
      <path d={toPath(pts.map((p) => p.sum))} fill="none" stroke="#a855f7" strokeWidth={2} strokeDasharray="6,3" />
      {/* labels */}
      <text x="375" y={mapY(Math.sin(2 * Math.PI)) + 4} fill="#3b82f6" fontSize="10">sin(x)</text>
      <text x="375" y={mapY(Math.cos(2 * Math.PI)) + 4} fill="#ef4444" fontSize="10">cos(x)</text>
      <text x="280" y={mapY(0) - 56} fill="#a855f7" fontSize="10">sin+cos</text>
      {/* axes labels */}
      <text x="210" y="232" textAnchor="middle" fill="#94a3b8" fontSize="10">x (0 ~ 2pi)</text>
      <text x="20" y="120" textAnchor="middle" fill="#94a3b8" fontSize="10" transform="rotate(-90,20,120)">y</text>
    </svg>
  );
}

function SubplotDiagram() {
  const panels = [
    { r: 0, c: 0, label: "subplot(2,2,1)", fn: "sin(x)" },
    { r: 0, c: 1, label: "subplot(2,2,2)", fn: "cos(x)" },
    { r: 1, c: 0, label: "subplot(2,2,3)", fn: "x^2" },
    { r: 1, c: 1, label: "subplot(2,2,4)", fn: "e^(-x)" },
  ];
  const colorsArr = ["#3b82f6", "#ef4444", "#22c55e", "#a855f7"];
  return (
    <svg viewBox="0 0 340 240" className="w-full max-w-md mx-auto">
      {panels.map((p, i) => {
        const x = 10 + p.c * 165;
        const y = 10 + p.r * 115;
        return (
          <g key={i}>
            <rect x={x} y={y} width="155" height="105" rx="6" fill="#0f172a" stroke={colorsArr[i]} strokeWidth={1.5} />
            <text x={x + 78} y={y + 18} textAnchor="middle" fill={colorsArr[i]} fontSize="9" fontFamily="monospace">
              {p.label}
            </text>
            <text x={x + 78} y={y + 62} textAnchor="middle" fill="#94a3b8" fontSize="14">
              {p.fn}
            </text>
            {/* mini curve hint */}
            <line x1={x + 20} y1={y + 85} x2={x + 135} y2={y + 85} stroke="#334155" strokeWidth={0.5} />
            <line x1={x + 20} y1={y + 35} x2={x + 20} y2={y + 85} stroke="#334155" strokeWidth={0.5} />
          </g>
        );
      })}
    </svg>
  );
}

function EulerChart() {
  // Euler method for dy/dx = -y, y(0)=1 => y=e^(-x)
  const h = 0.5;
  const steps = 8;
  const euler: { x: number; y: number }[] = [{ x: 0, y: 1 }];
  for (let i = 1; i <= steps; i++) {
    const prev = euler[i - 1];
    euler.push({ x: prev.x + h, y: prev.y + h * -prev.y });
  }
  const N = 60;
  const exact = Array.from({ length: N }, (_, i) => {
    const x = (i / (N - 1)) * 4;
    return { x, y: Math.exp(-x) };
  });
  const mapX = (x: number) => 55 + (x / 4) * 320;
  const mapY = (y: number) => 200 - y * 160;
  const exactPath = exact.map((p, i) => `${i === 0 ? "M" : "L"}${mapX(p.x).toFixed(1)},${mapY(p.y).toFixed(1)}`).join(" ");

  return (
    <svg viewBox="0 0 430 250" className="w-full max-w-lg mx-auto">
      {/* grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((v) => (
        <line key={v} x1="55" y1={mapY(v)} x2="375" y2={mapY(v)} stroke="#1e293b" strokeWidth={0.5} />
      ))}
      {[0, 1, 2, 3, 4].map((v) => (
        <g key={v}>
          <line x1={mapX(v)} y1="30" x2={mapX(v)} y2="210" stroke="#1e293b" strokeWidth={0.5} />
          <text x={mapX(v)} y="222" textAnchor="middle" fill="#64748b" fontSize="9">{v}</text>
        </g>
      ))}
      {/* axes */}
      <line x1="55" y1="30" x2="55" y2="210" stroke="#475569" strokeWidth={1} />
      <line x1="55" y1="200" x2="375" y2="200" stroke="#475569" strokeWidth={1} />
      {/* exact */}
      <path d={exactPath} fill="none" stroke="#06b6d4" strokeWidth={2} />
      {/* euler dots + lines */}
      {euler.map((p, i) => (
        <g key={i}>
          {i > 0 && (
            <line
              x1={mapX(euler[i - 1].x)} y1={mapY(euler[i - 1].y)}
              x2={mapX(p.x)} y2={mapY(p.y)}
              stroke="#f97316" strokeWidth={1.5} strokeDasharray="4,2"
            />
          )}
          <circle cx={mapX(p.x)} cy={mapY(p.y)} r="4" fill="#f97316" />
        </g>
      ))}
      {/* legend */}
      <line x1="260" y1="30" x2="280" y2="30" stroke="#06b6d4" strokeWidth={2} />
      <text x="284" y="34" fill="#06b6d4" fontSize="9">Exact: e^(-x)</text>
      <circle cx="270" cy="45" r="3.5" fill="#f97316" />
      <text x="284" y="49" fill="#f97316" fontSize="9">Euler (h=0.5)</text>
      {/* labels */}
      <text x="215" y="242" textAnchor="middle" fill="#94a3b8" fontSize="10">x</text>
      <text x="18" y="120" textAnchor="middle" fill="#94a3b8" fontSize="10" transform="rotate(-90,18,120)">y(x)</text>
    </svg>
  );
}

function OtherPlotIcon({ name }: { name: string }) {
  if (name.startsWith("bar")) {
    return (
      <svg viewBox="0 0 48 48" className="w-10 h-10">
        {[0, 1, 2, 3].map((i) => {
          const h = [24, 32, 18, 28][i];
          return <rect key={i} x={6 + i * 10} y={44 - h} width="8" height={h} rx="1" fill={["#3b82f6", "#06b6d4", "#22c55e", "#a855f7"][i]} fillOpacity={0.7} />;
        })}
      </svg>
    );
  }
  if (name.startsWith("scatter")) {
    return (
      <svg viewBox="0 0 48 48" className="w-10 h-10">
        {[[10, 30], [18, 14], [24, 26], [30, 10], [36, 20], [14, 20], [32, 34], [40, 16]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill="#34d399" fillOpacity={0.7} />
        ))}
      </svg>
    );
  }
  if (name.startsWith("histogram")) {
    return (
      <svg viewBox="0 0 48 48" className="w-10 h-10">
        {[8, 18, 30, 24, 12].map((h, i) => (
          <rect key={i} x={4 + i * 8.5} y={44 - h} width="7.5" height={h} fill="#f472b6" fillOpacity={0.6} stroke="#f472b6" strokeWidth={0.5} />
        ))}
      </svg>
    );
  }
  // log scale
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10">
      <line x1="6" y1="42" x2="42" y2="42" stroke="#475569" strokeWidth={1} />
      <line x1="6" y1="6" x2="6" y2="42" stroke="#475569" strokeWidth={1} />
      <path d="M8,38 Q16,36 22,28 T42,8" fill="none" stroke="#eab308" strokeWidth={2} />
    </svg>
  );
}

/* ── Main Component ── */
export default function MatlabPlotting() {
  const [activeTab, setActiveTab] = useState("basic");

  return (
    <section className="bg-slate-900 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium border border-emerald-500/20 mb-4">
            Section 4
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            시각화 &mdash; Plotting &amp; Visualization
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            MATLAB의 가장 강력한 기능 중 하나인 시각화를 배웁니다. 수치해석 결과를 직관적으로 이해하고 보고서에 활용하세요.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === t.id
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-slate-800/60 text-slate-400 border border-slate-700/40 hover:text-slate-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          {activeTab === "basic" && <BasicPlotTab />}
          {activeTab === "format" && <FormatTab />}
          {activeTab === "hold" && <HoldTab />}
          {activeTab === "subplot" && <SubplotTab />}
          {activeTab === "others" && <OthersTab />}
          {activeTab === "practice" && <PracticeTab />}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Tab: Basic Plot ── */
function BasicPlotTab() {
  return (
    <div className="space-y-8">
      {/* Basic usage */}
      <div className="bg-slate-800/40 rounded-2xl border border-slate-700/40 p-6">
        <h3 className="text-xl font-bold text-white mb-2">기본 plot 사용법</h3>
        <p className="text-slate-400 text-sm mb-4">
          <code className="text-cyan-400">plot(x, y)</code>는 MATLAB에서 가장 기본적인 2D 그래프 명령입니다. 세 번째 인수로 선 스타일, 색상, 마커를 조합하여 지정할 수 있습니다.
        </p>
        <CodeBlock title="basic_plot.m">{`x = 0:0.1:2*pi;
y = sin(x);

plot(x, y)            % 기본 파란 실선
plot(x, y, 'r--')     % 빨간 파선
plot(x, y, 'go-')     % 초록 원형마커 + 실선
plot(x, y, 'k*:')     % 검정 별마커 + 점선`}</CodeBlock>
      </div>

      {/* Line Styles */}
      <div className="bg-slate-800/40 rounded-2xl border border-slate-700/40 p-6">
        <h3 className="text-lg font-bold text-white mb-4">선 스타일 (Line Styles)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {lineStyles.map((ls) => (
            <div key={ls.code} className="bg-slate-900/60 rounded-xl p-3 text-center border border-slate-700/30">
              <svg viewBox="0 0 60 24" className="w-full h-6 mb-2">
                <line x1="4" y1="12" x2="56" y2="12" stroke="#34d399" strokeWidth={2.5} strokeDasharray={ls.dash || "none"} />
              </svg>
              <code className="text-emerald-400 text-sm">{ls.code}</code>
              <p className="text-slate-500 text-xs mt-1">{ls.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="bg-slate-800/40 rounded-2xl border border-slate-700/40 p-6">
        <h3 className="text-lg font-bold text-white mb-4">색상 코드 (Colors)</h3>
        <div className="grid grid-cols-3 sm:grid-cols-7 gap-3">
          {colors.map((c) => (
            <div key={c.code} className="bg-slate-900/60 rounded-xl p-3 text-center border border-slate-700/30">
              <div className="w-8 h-8 rounded-full mx-auto mb-2" style={{ backgroundColor: c.hex, opacity: 0.85 }} />
              <code className="text-sm" style={{ color: c.hex }}>{c.code}</code>
              <p className="text-slate-500 text-xs mt-1">{c.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Markers */}
      <div className="bg-slate-800/40 rounded-2xl border border-slate-700/40 p-6">
        <h3 className="text-lg font-bold text-white mb-4">마커 (Markers)</h3>
        <div className="grid grid-cols-3 sm:grid-cols-7 gap-3">
          {markers.map((m) => (
            <div key={m.code} className="bg-slate-900/60 rounded-xl p-3 text-center border border-slate-700/30">
              <svg viewBox="0 0 24 24" className="w-8 h-8 mx-auto mb-2">
                <MarkerSVG shape={m.shape} />
              </svg>
              <code className="text-emerald-400 text-sm">{m.code}</code>
              <p className="text-slate-500 text-xs mt-1">{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Combo example */}
      <div className="bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 rounded-2xl border border-emerald-500/20 p-6">
        <h3 className="text-lg font-bold text-emerald-300 mb-2">조합 예시</h3>
        <p className="text-slate-400 text-sm mb-3">색상 + 마커 + 선 스타일을 하나의 문자열로 조합합니다.</p>
        <div className="grid sm:grid-cols-3 gap-3 font-mono text-sm">
          {[
            { code: "'ro--'", desc: "빨간 원형마커 + 파선" },
            { code: "'bs-'", desc: "파란 사각마커 + 실선" },
            { code: "'g^:'", desc: "초록 삼각마커 + 점선" },
          ].map((ex) => (
            <div key={ex.code} className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/30">
              <code className="text-cyan-400">{ex.code}</code>
              <p className="text-slate-500 text-xs mt-1">{ex.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Tab: Format ── */
function FormatTab() {
  return (
    <div className="space-y-8">
      <div className="bg-slate-800/40 rounded-2xl border border-slate-700/40 p-6">
        <h3 className="text-xl font-bold text-white mb-2">그래프 꾸미기</h3>
        <p className="text-slate-400 text-sm mb-4">
          보고서나 논문에 사용할 수 있도록 축 레이블, 제목, 범례, 격자 등을 추가합니다.
        </p>

        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          {[
            { fn: "xlabel('Time (s)')", desc: "x축 레이블" },
            { fn: "ylabel('Amplitude')", desc: "y축 레이블" },
            { fn: "title('My Plot')", desc: "그래프 제목" },
            { fn: "legend('sin', 'cos')", desc: "범례 표시" },
            { fn: "grid on", desc: "격자 표시" },
            { fn: "axis([0 10 -1 1])", desc: "축 범위 지정" },
            { fn: "xlim([0 10])", desc: "x축 범위만 지정" },
            { fn: "set(gca,'FontSize',14)", desc: "폰트 크기 변경" },
          ].map((item) => (
            <div key={item.fn} className="flex items-start gap-3 bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
              <code className="text-cyan-400 text-sm whitespace-nowrap">{item.fn}</code>
              <span className="text-slate-500 text-sm">{item.desc}</span>
            </div>
          ))}
        </div>

        <CodeBlock title="formatted_plot.m">{`x = linspace(0, 2*pi, 100);
y1 = sin(x);
y2 = cos(x);

figure;                          % 새 Figure 창 열기
plot(x, y1, 'b-', 'LineWidth', 2);
hold on;
plot(x, y2, 'r--', 'LineWidth', 2);
hold off;

xlabel('x (rad)', 'FontSize', 12);   % x축 레이블
ylabel('f(x)', 'FontSize', 12);      % y축 레이블
title('Sine & Cosine', 'FontSize', 14); % 제목
legend('sin(x)', 'cos(x)', 'Location', 'best'); % 범례
grid on;                              % 격자 표시
axis([0 2*pi -1.2 1.2]);             % 축 범위 지정
set(gca, 'FontSize', 12);            % 축 폰트 크기`}</CodeBlock>
      </div>
    </div>
  );
}

/* ── Tab: Hold ── */
function HoldTab() {
  return (
    <div className="space-y-8">
      <div className="bg-slate-800/40 rounded-2xl border border-slate-700/40 p-6">
        <h3 className="text-xl font-bold text-white mb-2">hold on / hold off</h3>
        <p className="text-slate-400 text-sm mb-4">
          <code className="text-cyan-400">hold on</code>을 사용하면 기존 그래프 위에 새로운 그래프를 겹쳐 그릴 수 있습니다.
          <code className="text-cyan-400"> hold off</code>로 해제합니다.
        </p>

        <CodeBlock title="hold_example.m">{`x = linspace(0, 2*pi, 200);

figure;
plot(x, sin(x), 'b-', 'LineWidth', 2);     % 첫 번째 곡선
hold on;                                     % 겹치기 시작
plot(x, cos(x), 'r-', 'LineWidth', 2);     % 두 번째 곡선
plot(x, sin(x)+cos(x), 'm--', 'LineWidth', 1.5); % 세 번째
hold off;                                    % 겹치기 종료

legend('sin(x)', 'cos(x)', 'sin(x)+cos(x)', 'Location', 'best');
xlabel('x'); ylabel('y'); title('hold on 예제');
grid on;`}</CodeBlock>
      </div>

      {/* SVG Preview */}
      <div className="bg-slate-800/40 rounded-2xl border border-slate-700/40 p-6">
        <h3 className="text-lg font-bold text-white mb-4">결과 미리보기</h3>
        <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-700/30">
          <HoldOnChart />
        </div>
        <div className="flex flex-wrap gap-4 justify-center mt-4 text-sm">
          <span className="flex items-center gap-2"><span className="w-6 h-0.5 bg-blue-500 inline-block" /> <span className="text-slate-400">sin(x)</span></span>
          <span className="flex items-center gap-2"><span className="w-6 h-0.5 bg-red-500 inline-block" /> <span className="text-slate-400">cos(x)</span></span>
          <span className="flex items-center gap-2"><span className="w-6 h-0.5 bg-purple-500 inline-block border-dashed border-t" /> <span className="text-slate-400">sin(x)+cos(x)</span></span>
        </div>
      </div>
    </div>
  );
}

/* ── Tab: Subplot ── */
function SubplotTab() {
  return (
    <div className="space-y-8">
      <div className="bg-slate-800/40 rounded-2xl border border-slate-700/40 p-6">
        <h3 className="text-xl font-bold text-white mb-2">subplot &mdash; 다중 그래프</h3>
        <p className="text-slate-400 text-sm mb-4">
          <code className="text-cyan-400">subplot(m, n, p)</code>: m행 n열 격자의 p번째 위치에 그래프를 배치합니다.
        </p>

        <div className="grid lg:grid-cols-2 gap-6">
          <CodeBlock title="subplot_example.m">{`x = linspace(0, 2*pi, 100);

figure;

subplot(2,2,1);         % 1행 1열
plot(x, sin(x), 'b-', 'LineWidth', 1.5);
title('sin(x)'); grid on;

subplot(2,2,2);         % 1행 2열
plot(x, cos(x), 'r-', 'LineWidth', 1.5);
title('cos(x)'); grid on;

subplot(2,2,3);         % 2행 1열
plot(x, x.^2, 'g-', 'LineWidth', 1.5);
title('x^2'); grid on;

subplot(2,2,4);         % 2행 2열
plot(x, exp(-x), 'm-', 'LineWidth', 1.5);
title('e^{-x}'); grid on;`}</CodeBlock>

          <div className="flex flex-col items-center justify-center">
            <p className="text-slate-500 text-sm mb-3">레이아웃 다이어그램</p>
            <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-700/30">
              <SubplotDiagram />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Tab: Others ── */
function OthersTab() {
  return (
    <div className="space-y-8">
      <div className="bg-slate-800/40 rounded-2xl border border-slate-700/40 p-6">
        <h3 className="text-xl font-bold text-white mb-2">기타 유용한 플롯</h3>
        <p className="text-slate-400 text-sm mb-6">
          MATLAB은 다양한 종류의 그래프를 기본 제공합니다. 특히 <code className="text-cyan-400">semilogy</code>와 <code className="text-cyan-400">loglog</code>는 수치해석에서 오차 수렴 차수를 분석할 때 필수입니다.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherPlots.map((p) => (
            <div key={p.name} className="bg-slate-900/60 rounded-xl p-4 border border-slate-700/30 flex gap-4 items-start">
              <div className="flex-shrink-0">
                <OtherPlotIcon name={p.name} />
              </div>
              <div>
                <code className="text-emerald-400 text-sm">{p.name}</code>
                <p className="text-white text-sm font-medium mt-1">{p.label}</p>
                <p className="text-slate-500 text-xs mt-0.5">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800/40 rounded-2xl border border-slate-700/40 p-6">
        <h3 className="text-lg font-bold text-white mb-3">로그 스케일 예제</h3>
        <CodeBlock title="log_scale.m">{`h = [0.1, 0.05, 0.025, 0.0125];  % 스텝 크기
err = [0.032, 0.008, 0.002, 0.0005]; % 오차

figure;
loglog(h, err, 'ro-', 'LineWidth', 2, 'MarkerSize', 8);
xlabel('Step size h');
ylabel('Error');
title('Error vs Step Size (Log-Log)');
grid on;
% 기울기 = 2 이면 2차 수렴 (O(h^2))`}</CodeBlock>
      </div>
    </div>
  );
}

/* ── Tab: Practice ── */
function PracticeTab() {
  return (
    <div className="space-y-8">
      <div className="bg-slate-800/40 rounded-2xl border border-slate-700/40 p-6">
        <h3 className="text-xl font-bold text-white mb-2">실전 예제: Euler Method 시각화</h3>
        <p className="text-slate-400 text-sm mb-4">
          미분방정식 <code className="text-cyan-400">dy/dx = -y</code>, <code className="text-cyan-400">y(0) = 1</code>의
          해석해 <code className="text-cyan-400">y = e^(-x)</code>와 Euler 방법의 수치해를 비교합니다.
        </p>

        <CodeBlock title="euler_plot.m">{`% Euler Method로 dy/dx = -y 풀기
% 해석해: y = exp(-x)

h = 0.5;                    % 스텝 크기
x_end = 4;                  % 끝점
N = x_end / h;              % 총 스텝 수

x_euler = zeros(1, N+1);    % x 값 저장 배열
y_euler = zeros(1, N+1);    % y 값 저장 배열
y_euler(1) = 1;             % 초기 조건 y(0) = 1

% Euler 반복
for i = 1:N
    x_euler(i+1) = x_euler(i) + h;          % x 업데이트
    y_euler(i+1) = y_euler(i) + h*(-y_euler(i)); % y 업데이트
end

% 해석해 계산
x_exact = linspace(0, x_end, 200);
y_exact = exp(-x_exact);

% 그래프 그리기
figure;
plot(x_exact, y_exact, 'c-', 'LineWidth', 2);   % 해석해 (실선)
hold on;
plot(x_euler, y_euler, 'o--', ...                % 수치해 (원+파선)
     'Color', [1 0.5 0], ...
     'LineWidth', 1.5, ...
     'MarkerSize', 8, ...
     'MarkerFaceColor', [1 0.5 0]);
hold off;

xlabel('x', 'FontSize', 12);
ylabel('y(x)', 'FontSize', 12);
title('Euler Method vs Exact Solution', 'FontSize', 14);
legend('Exact: e^{-x}', sprintf('Euler (h=%.1f)', h), ...
       'Location', 'northeast');
grid on;
set(gca, 'FontSize', 12);`}</CodeBlock>
      </div>

      {/* SVG result preview */}
      <div className="bg-slate-800/40 rounded-2xl border border-slate-700/40 p-6">
        <h3 className="text-lg font-bold text-white mb-4">실행 결과 미리보기</h3>
        <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-700/30">
          <EulerChart />
        </div>
        <p className="text-slate-500 text-sm text-center mt-3">
          Euler 방법의 수치해(주황 점)가 해석해(청록 곡선)에서 약간 벗어나는 것을 확인할 수 있습니다.
          스텝 크기 h를 줄이면 정확도가 향상됩니다.
        </p>
      </div>
    </div>
  );
}
