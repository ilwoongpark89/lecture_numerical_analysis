# 수치해석 강의 사이트 — 셋업 (McGraw-Hill Connect 급 학습 추적)

열전달 사이트(mftel-ht)와 동일한 학습 플랫폼입니다. 학생은 **학번**으로 입장하고,
교수는 `/admin` 에서 학생별 **단계 커버리지·답안 정오·챕터 대화**를 열람합니다.

셋업은 **한 번**만 하면 됩니다. (열전달 때 하신 흐름과 동일)

---

## 1) Supabase 프로젝트 (무료)

1. https://supabase.com/dashboard → **New project** (Free, region `Northeast Asia (Seoul)` 권장).
   - 열전달과 데이터 분리를 위해 **새 프로젝트**를 만듭니다. (`numerical-analysis-lecture` 등)
2. 프로젝트 생성 후 **Project Settings → API** 에서 다음 두 값을 복사:
   - `Project URL`  → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2) 스키마 적용

1. 강한 랜덤 토큰을 하나 만듭니다 (예: 터미널에서 `openssl rand -hex 24`). 이 값이 `NA_ADMIN_TOKEN`.
2. `sql/schema.sql` 을 열어 맨 위 `__NA_ADMIN_TOKEN__` 를 그 토큰 값으로 **모두 치환**.
3. Supabase Dashboard → **SQL Editor** → 치환한 `sql/schema.sql` 전체 붙여넣기 → **Run**. (멱등 — 여러 번 실행해도 안전)

## 3) 환경변수

`.env.local.example` 를 `.env.local` 로 복사하고 값을 채웁니다. Vercel 에도 동일하게 등록:
Vercel → 프로젝트 → **Settings → Environment Variables**.

| 변수 | 설명 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public key |
| `NA_ADMIN_TOKEN` | 위 2)에서 만든 강한 토큰 (schema.sql 과 동일) — 서버 전용, 서명 세션 키 겸용 |
| `NA_ADMIN_PASSWORD` | 교수가 `/admin` 로그인에 입력할 비밀번호 (기억하기 쉬운 값) |
| `NEXT_PUBLIC_NA_CLASS_PASSWORD` | 학생 첫 입장 시 필요한 **반 인증코드** (수업에서 안내) |

> `NA_ADMIN_TOKEN` 은 전체 학생 기록 열람 키입니다. git 에 커밋하지 마세요 (`.env.local` 은 자동 무시).

## 4) 실행 / 배포

```bash
npm install
npm run dev      # http://localhost:3000
```

배포는 Vercel 이 GitHub `main` 을 자동 빌드합니다. (env 등록 후 재배포)

---

## 동작 요약

- **학생**: `/` → 주차 카드 클릭 → `/enter` 에서 학번 등록(첫 회 반코드+비번) → 강의 열람.
  강의 중 좌하단 **목차**, 우하단 **질문·메모**(교수만 열람), 하단 **진도바·이어보기**.
- **교수**: `/admin` (또는 `/enter` 에서 학번 `admin`) → 학생별 커버리지 히트맵 + 대화 인박스 + 구술시험 추천.
- **추적 원본**은 서명 세션(httpOnly)뿐 — 위조 쿠키로 남의 학번 기록을 조작할 수 없습니다.
