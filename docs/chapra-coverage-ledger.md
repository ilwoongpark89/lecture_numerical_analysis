# Chapra 그림 커버리지 Ledger (SoT · 세션리밋 넘어 추적)

> 목표: chapra.pdf canonical **teaching 그림·그래프·표** 전수를 native 로 커버. "챕터당 ≥1" 아님 = "모든 canonical 개별 커버".
> 상태: ✅ 커버(요소 명시) / ⬜ TODO / ➖ N/A(pseudocode·스크린샷·물리 case study·고급/범위밖).
> 갱신 규칙: 그림 추가/검증 시 이 파일 즉시 갱신. `grep '⬜' ledger` = 남은 작업. 완결 = ⬜ 0.
> 검증: 각 ✅ 는 프로덕션 렌더 + (수치 있으면) node 재검산 완료분만.

## w1 — 오차와 근사 (Ch1 모델링 + Ch4 Taylor)
- ✅ 1.3 종단속도 해석해 — w1-1 (parachutist Euler vs tanh stepper)
- ✅ 1.4 유한차분 도함수 근사 — w1-1 (funcplot 현→접선)
- ✅ 1.5 수치 vs 해석해 비교 — w1-1 (ode stepper)
- ✅ 4.1 Taylor 0/1/2차 근사 — w3-3 (겹침 funcplot)
- ✅ 4.4 x^m 비선형 — w1-4 (funcplot m=1~4)
- ✅ 4.8/4.9 반올림-절단 U자·오차vs h — w3-4·w12 (errorh)
- ➖ 1.1 문제해결 흐름 / 1.2 자유물체도 / 1.6 유량평형 (스키매틱)

## w2 — MATLAB (Ch: 도구, chapra 그래프 대상 아님)
- ✅ plot 시각화 — w2-4 (funcplot) / 행렬 인덱싱 — w2-2 (matrixgrid)
- ➖ Ch3.4/3.13/3.14 등 코드 스크린샷

## w3 — 부동소수점·오차 (Ch3)
- ✅ 3.5 이진 vs 십진 자릿값 — w3-1 (표 10101101₂=173)
- ✅ 3.9/3.10 수 체계 눈금·양자화오차 — w3 (수직선 nafig)
- ✅ 3.7 부동소수점 저장 개념 — 3-1 원리(prose+표) *[그림화 검토]*
- ⬜ 3.8 최소 양수 부동소수점 (지수 하한 개념도)
- ✅ 4.5 log-log R1 vs h — errorh 로 커버

## w4 — 근찾기·이분법 (Ch5)
- ✅ 5.1 근의 그래프적 접근 — w4-1 (funcplot roots)
- ✅ 5.4/5.16 sin10x+cos3x 다중근·성긴간격 놓침 — w4-1
- ✅ 5.6 이분법 depiction — w4-2 (root-bracket stepper)
- ✅ 5.7 이분법 오차 true vs est — w4-2 (표)
- ✅ 5.12 가위치법 닮은삼각형 — w5 (funcplot)
- ✅ 5.13 이분법 vs 가위치법 오차 — w4-3 (convergence)
- ⬜ 5.2 짝수 근 브래킷 (부호 판정)
- ✅ 5.3 예외(중근 접촉=부호변화 없음) — w4-1 (funcplot (x-1.5)²)
- ⬜ 5.8 세 브래킷 경우

## w5 — 개방법 (Ch6·7)
- ✅ 6.2 두 그래프 관점(f=0 vs g=x, e^-x) — w5-4 (funcplot)
- ✅ 6.3 cobweb 수렴/발산 — w5 (fixed-point stepper ×2)
- ✅ 6.5 Newton-Raphson — w4-3/w5 (root-tangent stepper)
- ✅ 6.6 Newton 발산 — w4-3 (atan funcplot)
- ✅ 6.7 할선법 — w5-1 (root-secant + 할선 그리기)
- ✅ 6.13 다중근 접촉 — w5-2 (funcplot)
- ✅ 수렴차수 비교 — w5-3 (convergence)
- ⬜ 6.8 가위치법 vs 할선법(어느 끝 고정)
- ⬜ 6.11 세 점 두 포물선(Muller/역2차) — *고급, 검토*

## w6 — 가우스 소거·LU (Ch9·10)
- ✅ 9.1 연립=교점 — w6-1 (funcplot)
- ✅ 9.2 특이/악조건(해없음/무한/거의평행) — w6-4 (funcplot 3패널)
- ✅ 9.3 가우스 전진소거 2단계 — w6-1 (deriv 행렬 스냅샷)
- ✅ 10.1 LU 단계 — w6-3 (L,U matrixgrid)
- ✅ 10.6 벡터 노름 — w6-4 (vectors norm)
- ✅ 조건수 악조건 평행선 — w6 (funcplot)

## w7 — 반복 선형해법 (Ch11)
- ✅ 11.4 Jacobi vs GS 차이 — w7-1 (대비 callout)
- ✅ Jacobi/GS 반복 시연 — w7-1·7-2 (matrix-iter stepper)
- ✅ SOR ρ(ω) — w7-4 (funcplot)
- ✅ 수렴 — w7-3 (convergence)
- ⬜ 11.5 cobweb GS 수렴/발산 (2D) — *검토*

## w9 — 곡선적합·회귀 (Ch17)
- ✅ 17.1 오차 데이터+적합 — w9 (scatter)
- ✅ 17.3 잔차 수직거리 — w9-1 (svg)
- ✅ 17.4 R² 분해(St vs Sr) — w9-2 (scatter 쌍)
- ✅ 17.5 작은 vs 큰 잔차 — w9 (scatter 대비)
- ✅ 17.8 직선 부적합→포물선 — w9-1 (2차 funcplot)
- ✅ 17.9 지수/거듭제곱/포화 3형 — w9-3 (funcplot)
- ✅ 17.10 변환 전후 — w9-3 (scatter 쌍)
- ✅ 17.11 2차 다항 적합 — w9-1 (funcplot)
- ⬜ 17.2 부적합 최적기준(잔차합·절대값) — *검토*
- ⬜ 17.14 다중회귀 평면(3D)

## w10 — 보간 (Ch18)
- ✅ 18.1 1/2/3차 보간 다항식 — w10 (funcplot)
- ✅ 18.2 선형보간 닮은삼각형 — w10 (funcplot)
- ✅ 18.3/18.4 ln2 구간폭·2차vs선형 — w10-2
- ✅ 18.5 분할차분 재귀 — w10-2 (표+stepper)
- ✅ 18.10 Lagrange 기저 — w10-1 (funcplot L1L2L3)
- ✅ 18.12 고차 진동(Runge) — w10-3 (interp stepper 발산)
- ✅ 18.13 외삽 발산 — w10-3
- ✅ 18.14 스플라인 우월 — w10-4
- ✅ 18.16 1/2/3차 스플라인 — w10-4
- ➖ 18.19 2D bilinear (고급)

## w11 — 수치적분 (Ch21·22)
- ✅ 21.1 적분=넓이 — w11 (nodes)
- ✅ 21.3 닫힌 vs 열린 — w11 (nodes 쌍)
- ✅ 21.4/21.7 사다리꼴·다구간 — w11-1 (integration stepper)
- ✅ 21.10/21.11 Simpson 포물선·다구간 — w11-3 (funcplot)
- ✅ 21.14 불균등 간격 — w11-3 (nodes)
- ✅ 22.7 상수·1차 무오차 — w11-1 (nodes 쌍)
- ✅ 22.8 Gauss 절점 균형 — w11-4 (funcplot)
- ✅ 22.2 오차 vs 소구간수 — w11-3 (convergence 사다리꼴/Simpson)
- ➖ 21.16/21.17 이중적분 / 22.10 정규분포 (고급)

## w12 — 수치미분 (Ch23)
- ✅ 23.1 전방/후방/중앙 공식 — w12-1 (표)
- ✅ 세 할선 비교 — w12-1 (svg forward/backward/central)
- ✅ 23.7 잡음 증폭 — w12-3 (funcplot)
- ✅ 고차정확도 반감 — w12-2 (convergence)
- ✅ Richardson U자 — w12-3 (errorh)
- ⬜ 23.4 온도vs깊이 실측 예 / 23.6 거리vs시간 (응용, 선택)

## w13 — ODE (Ch25·26)
- ✅ 25.1 one-step 골격 / 25.2 Euler 접선 — w13-1
- ✅ 25.3/25.4 true vs Euler·두 스텝 — w13-1
- ✅ 25.5 스텝 vs 전역오차 log-log — w13-1
- ✅ 25.9 Heun 예측-수정 / 25.11 Euler vs Heun — w13-2
- ✅ 25.12 중점법 / 25.15 RK4 4기울기 — w13-2·3
- ✅ 방향장 — w13-1 (slopefield)
- ✅ 26.2 stiff 명시 vs 음함수 — w13-1
- ✅ 25.16 오차 vs 차수(Euler/RK2/RK4) — w13-3 (convergence)
- ➖ 25.20/25.23 적응스텝 / 26.3-26.10 다단계(Adams·Milne) 고급

## w14 — PDE (Ch29·30)
- ✅ 29.2 온도 기울기 열흐름 — w14 (funcplot/matrixgrid)
- ✅ 29.3 타원형 격자 — w14 (matrixgrid)
- ✅ 29.5 평형 온도장 — w14 (heatmap)
- ✅ 29.6 열유속 화살표 — w14 (matrixgrid)
- ✅ 30.2 포물형 시공간 격자 — w14
- ✅ 30.3 FTCS 계산분자 / 30.8 BTCS / 30.9 Crank-Nicolson — w14
- ✅ 30.5 불안정 λ — w14-2 (발산표 λ=1.0)
- ✅ 스텐실·확산 히트맵쌍·파동 — w14 (기존)
- ⬜ 29.4 Dirichlet 경계 판 (라벨 명확도) — *검토*
- ➖ 30.10/30.11 ADI (고급)

## w15 — 고유값 (Ch27)
- ✅ 고유벡터 방향 — w15-1 (vectors)
- ✅ 거듭제곱 수렴 — w15-2 (power stepper + 고유기저 원리)
- ✅ QR 대각 — w15-4 (matrixgrid)
- ✅ 특성방정식 — w15-1 (원리)
- ✅ 진동 모드 = 고유벡터 — w15-1 (funcplot sin nπx)
- ✅ 27.3 shooting 법 — w13-4 (funcplot 미달/적중/초과)
- ⬜ 27.6 진동 모드 물리도(두 질량-스프링) — *funcplot 모드로 부분 커버*

---
## 남은 ⬜ 요약 (다음 loop 대상)
w3: 3.8 · w4: 5.2, 5.8 · w5: 6.8 · w7: 11.5 · w9: 17.2, 17.14 · w12: 23.4/23.6 · w14: 29.4 · w15: 27.6
= 약 11개 (대부분 보조/응용 — 핵심 canonical 은 ✅ 완료). *고급/case study 는 ➖ 의도적 제외.*
