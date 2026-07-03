-- ============================================================================
-- Numerical Analysis lecture — 학습 추적 + 학번 인증 + 교수 분석 스키마 (단일 파일)
-- ----------------------------------------------------------------------------
-- 적용: Supabase Dashboard → SQL Editor → 이 파일 전체 붙여넣기 → Run (1회, 멱등)
-- 보안 모델:
--   · anon 키 = na_lecture_events INSERT(append-only telemetry) 만 가능.
--   · 학생 인증/체류/대화/교수 열람 = token-gated SECURITY DEFINER RPC 로만.
--   · 평문 비밀번호 저장 0 (서버 Node scrypt+salt 해시). na_student_auth 는 RLS 전면 잠금.
-- ⚠ 아래 'ef97d7ab8391aa47f18682ddfc6ad816c40eb90be8cfcd8c' 를 .env.local / Vercel 의 NA_ADMIN_TOKEN 실제 값과
--    동일하게 바꾼 뒤 실행하세요. (na_admin_export/RPC 는 anon 실행 가능 → 토큰 = 전체 PII 열람 키)
-- ============================================================================

-- ── 1. 이벤트 테이블 (접속 enter / 답안 answer) ──────────────────────────────
create table if not exists public.na_lecture_events (
  id          bigint generated always as identity primary key,
  student_id  text        not null,                 -- 학번
  week        int         not null,
  kind        text        not null,                 -- 'enter' | 'answer'  (check 는 아래)
  slide       int,                                   -- 섹션/화면 인덱스
  chapter     text,                                  -- 1-1 / 4-2 ...
  section     text,                                  -- 학습 / 점검 / 연습
  question    text,                                  -- 문항 라벨
  prompt      text,                                  -- 문항 본문(요약)
  answer      text,                                  -- 학생 답
  is_correct  boolean,                               -- 정답 여부
  user_agent  text,
  created_at  timestamptz not null default now()
);
create index if not exists na_lecture_events_student_idx on public.na_lecture_events (student_id, created_at);
create index if not exists na_lecture_events_week_idx    on public.na_lecture_events (week, created_at);
create index if not exists na_lecture_events_kind_idx    on public.na_lecture_events (kind);

do $$ declare cn text; begin
  select conname into cn from pg_constraint
   where conrelid = 'public.na_lecture_events'::regclass and contype = 'c'
     and pg_get_constraintdef(oid) like '%kind%';
  if cn is not null then execute 'alter table public.na_lecture_events drop constraint ' || quote_ident(cn); end if;
end $$;
alter table public.na_lecture_events add constraint lecture_events_kind_check check (kind in ('enter', 'answer'));

alter table public.na_lecture_events enable row level security;
drop policy if exists lecture_events_anon_insert on public.na_lecture_events;
create policy lecture_events_anon_insert on public.na_lecture_events for insert to anon
  with check (
    char_length(student_id) between 1 and 32
    and week between 1 and 16
    and kind in ('enter', 'answer')
    and char_length(coalesce(answer, ''))     <= 2000
    and char_length(coalesce(chapter, ''))    <= 32
    and char_length(coalesce(section, ''))    <= 32
    and char_length(coalesce(question, ''))   <= 64
    and char_length(coalesce(prompt, ''))     <= 500
    and char_length(coalesce(user_agent, '')) <= 300
  );

-- ── 2. 교수 토큰 (anon 비공개) ───────────────────────────────────────────────
create table if not exists public.na_admin_secret ( token text primary key );
alter table public.na_admin_secret enable row level security;   -- 정책 없음 → anon 읽기 불가
insert into public.na_admin_secret(token) values ('ef97d7ab8391aa47f18682ddfc6ad816c40eb90be8cfcd8c') on conflict (token) do nothing;

-- ── 3. 교수 raw 열람 RPC (토큰 일치 시 전체 이벤트) ──────────────────────────
create or replace function public.na_admin_export(p_token text)
returns setof public.na_lecture_events language plpgsql security definer set search_path = public as $$
begin
  if p_token is null or not exists (select 1 from na_admin_secret s where s.token = p_token) then
    raise exception 'unauthorized'; end if;
  return query select * from public.na_lecture_events order by created_at;
end; $$;
revoke all on function public.na_admin_export(text) from public, anon;
grant execute on function public.na_admin_export(text) to anon;

-- ── 4. 학번 인증 (TOFU: 첫 등록 = 본인 소유, 이후 비번 검증) ──────────────────
create table if not exists public.na_student_auth (
  student_id    text primary key,
  pw_hash       text not null,                       -- "<saltHex>:<hashHex>" (Node scrypt)
  created_at    timestamptz not null default now(),
  last_login_at timestamptz
);
alter table public.na_student_auth enable row level security;   -- 정책 0 = anon 전면 차단
revoke all on public.na_student_auth from anon, authenticated;

create or replace function public.na_student_is_claimed(p_token text, p_id text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if p_token is null or not exists (select 1 from na_admin_secret s where s.token = p_token) then
    raise exception 'unauthorized'; end if;
  return exists (select 1 from na_student_auth where student_id = p_id);
end; $$;

create or replace function public.na_student_register(p_token text, p_id text, p_hash text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if p_token is null or not exists (select 1 from na_admin_secret s where s.token = p_token) then
    raise exception 'unauthorized'; end if;
  insert into na_student_auth(student_id, pw_hash) values (p_id, p_hash);
  return true;
exception when unique_violation then
  return false;
end; $$;

create or replace function public.na_student_get_salt(p_token text, p_id text)
returns text language plpgsql security definer set search_path = public as $$
begin
  if p_token is null or not exists (select 1 from na_admin_secret s where s.token = p_token) then
    raise exception 'unauthorized'; end if;
  return (select split_part(pw_hash, ':', 1) from na_student_auth where student_id = p_id);
end; $$;

-- 반환 text: 'ok' | 'bad' | 'no_user'  (하드락 DoS 폐기 — 무차별은 na_auth_throttle 로 조임)
drop function if exists public.na_student_verify(text, text, text);
create function public.na_student_verify(p_token text, p_id text, p_full text)
returns text language plpgsql security definer set search_path = public as $$
declare stored text;
begin
  if p_token is null or not exists (select 1 from na_admin_secret s where s.token = p_token) then
    raise exception 'unauthorized'; end if;
  select pw_hash into stored from na_student_auth where student_id = p_id;
  if stored is null then return 'no_user'; end if;
  if stored = p_full then
    update na_student_auth set last_login_at = now() where student_id = p_id;
    return 'ok';
  end if;
  return 'bad';
end; $$;

create or replace function public.na_student_reset(p_token text, p_id text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if p_token is null or not exists (select 1 from na_admin_secret s where s.token = p_token) then
    raise exception 'unauthorized'; end if;
  delete from na_student_auth where student_id = p_id;
  return true;
end; $$;

-- ── 5. durable IP 스로틀 (서버리스 인스턴스 분산 무관, 전역 강제) ─────────────
create table if not exists public.na_auth_throttle (
  ip           text primary key,
  cnt          int not null default 0,
  window_start timestamptz not null default now()
);
alter table public.na_auth_throttle enable row level security;
revoke all on public.na_auth_throttle from anon, authenticated;

create or replace function public.na_auth_throttle_hit(p_token text, p_ip text, p_max int, p_window_sec int)
returns boolean language plpgsql security definer set search_path = public as $$
declare c int;
begin
  if p_token is null or not exists (select 1 from na_admin_secret s where s.token = p_token) then
    raise exception 'unauthorized'; end if;
  insert into na_auth_throttle (ip, cnt, window_start) values (p_ip, 1, now())
  on conflict (ip) do update set
    cnt = case when na_auth_throttle.window_start < now() - make_interval(secs => p_window_sec)
               then 1 else na_auth_throttle.cnt + 1 end,
    window_start = case when na_auth_throttle.window_start < now() - make_interval(secs => p_window_sec)
               then now() else na_auth_throttle.window_start end
  returning cnt into c;
  return c > p_max;
end; $$;

-- ── 6. 단계별 체류시간(dwell) 누적 ───────────────────────────────────────────
create table if not exists public.na_student_step_dwell (
  student_id text        not null,
  week       int         not null,
  chapter    text        not null,
  stage      text        not null,
  total_ms   bigint      not null default 0,
  updated_at timestamptz not null default now(),
  primary key (student_id, chapter, stage)
);
create index if not exists na_step_dwell_student_idx on public.na_student_step_dwell (student_id);
alter table public.na_student_step_dwell enable row level security;
revoke all on public.na_student_step_dwell from anon, authenticated;

create or replace function public.na_record_dwell(p_token text, p_id text, p_week int, p_chapter text, p_stage text, p_ms int)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_token is null or not exists (select 1 from na_admin_secret s where s.token = p_token) then
    raise exception 'unauthorized'; end if;
  if p_ms is null or p_ms <= 0 or p_chapter is null or p_stage is null then return; end if;
  insert into na_student_step_dwell (student_id, week, chapter, stage, total_ms, updated_at)
    values (p_id, coalesce(p_week, 0), left(p_chapter, 32), left(p_stage, 24), least(p_ms, 600000), now())
  on conflict (student_id, chapter, stage) do update set
    total_ms   = least(na_student_step_dwell.total_ms + least(p_ms, 600000), 86400000),
    updated_at = now();
end; $$;

-- ── 7. 챕터 대화(note) 전용 테이블 + 삽입 RPC ────────────────────────────────
create table if not exists public.na_student_notes (
  id         bigint generated always as identity primary key,
  student_id text not null,
  week       int,
  chapter    text,
  body       text not null,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists na_student_notes_student_idx on public.na_student_notes (student_id, created_at);
alter table public.na_student_notes enable row level security;
revoke all on public.na_student_notes from anon, authenticated;

create or replace function public.na_record_note(p_token text, p_id text, p_week int, p_chapter text, p_body text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if p_token is null or not exists (select 1 from na_admin_secret s where s.token = p_token) then
    raise exception 'unauthorized'; end if;
  if p_body is null or char_length(btrim(p_body)) = 0 then return false; end if;
  insert into na_student_notes(student_id, week, chapter, body)
    values (p_id, p_week, left(p_chapter, 32), left(p_body, 2000));
  return true;
end; $$;

-- ── 8. 교수 분석 집계 RPC ────────────────────────────────────────────────────
-- ① 로스터: 학생별 요약 (e2e-*/__prof__ 제외)
create or replace function public.na_admin_roster(p_token text)
returns table (student_id text, study_min int, chapters int, correct int, graded int, notes int, last_active timestamptz)
language plpgsql security definer set search_path = public as $$
begin
  if p_token is null or not exists (select 1 from na_admin_secret s where s.token = p_token) then
    raise exception 'unauthorized'; end if;
  return query
  with ids as (
    select sa.student_id from na_student_auth sa
    union select sd.student_id from na_student_step_dwell sd
    union select le.student_id from na_lecture_events le
    union select sn.student_id from na_student_notes sn
  ),
  d as (select sd.student_id, sum(sd.total_ms) ms, count(distinct sd.chapter) ch, max(sd.updated_at) la
        from na_student_step_dwell sd group by sd.student_id),
  a as (select le.student_id, count(*) filter (where le.is_correct) cor, count(*) grd, max(le.created_at) la
        from na_lecture_events le where le.kind = 'answer' group by le.student_id),
  n as (select sn.student_id, count(*) nt, max(sn.created_at) la from na_student_notes sn group by sn.student_id)
  select i.student_id, coalesce(round(d.ms / 60000.0), 0)::int, coalesce(d.ch, 0)::int,
         coalesce(a.cor, 0)::int, coalesce(a.grd, 0)::int, coalesce(n.nt, 0)::int, greatest(d.la, a.la, n.la)
  from ids i
  left join d on d.student_id = i.student_id
  left join a on a.student_id = i.student_id
  left join n on n.student_id = i.student_id
  where i.student_id <> '__prof__' and i.student_id not like 'e2e-%'
  order by greatest(d.la, a.la, n.la) desc nulls last;
end; $$;

-- ② 학생 상세: (챕터,단계)별 체류ms + (점검/연습) 답안·정오
create or replace function public.na_admin_student_detail(p_token text, p_id text)
returns table (week int, chapter text, stage text, dwell_ms bigint, answer text, is_correct boolean)
language plpgsql security definer set search_path = public as $$
begin
  if p_token is null or not exists (select 1 from na_admin_secret s where s.token = p_token) then
    raise exception 'unauthorized'; end if;
  return query
  with steps as (
    select sd.week, sd.chapter, sd.stage from na_student_step_dwell sd where sd.student_id = p_id
    union
    select le.week, le.chapter, le.section from na_lecture_events le where le.student_id = p_id and le.kind = 'answer'
  )
  select s.week, s.chapter, s.stage, coalesce(dd.total_ms, 0)::bigint, aa.answer, aa.is_correct
  from steps s
  left join na_student_step_dwell dd on dd.student_id = p_id and dd.chapter = s.chapter and dd.stage = s.stage
  left join lateral (
    select le.answer, le.is_correct from na_lecture_events le
    where le.student_id = p_id and le.kind = 'answer' and le.chapter = s.chapter and le.section = s.stage
    order by le.created_at desc limit 1
  ) aa on true
  order by s.week, s.chapter, s.stage;
end; $$;

-- ③ 대화 inbox (학생별 스레드 목록)
create or replace function public.na_admin_note_inbox(p_token text)
returns table (student_id text, total int, unread int, last_body text, last_at timestamptz)
language plpgsql security definer set search_path = public as $$
begin
  if p_token is null or not exists (select 1 from na_admin_secret s where s.token = p_token) then
    raise exception 'unauthorized'; end if;
  return query
  select n.student_id, count(*)::int, count(*) filter (where n.read_at is null)::int,
         (array_agg(n.body order by n.created_at desc))[1], max(n.created_at)
  from na_student_notes n where n.student_id <> '__prof__' and n.student_id not like 'e2e-%'
  group by n.student_id order by max(n.created_at) desc;
end; $$;

-- ④ 학생 스레드
create or replace function public.na_admin_student_notes(p_token text, p_id text)
returns table (chapter text, body text, created_at timestamptz)
language plpgsql security definer set search_path = public as $$
begin
  if p_token is null or not exists (select 1 from na_admin_secret s where s.token = p_token) then
    raise exception 'unauthorized'; end if;
  return query select n.chapter, n.body, n.created_at from na_student_notes n
    where n.student_id = p_id order by n.created_at;
end; $$;

-- ⑤ 읽음 처리
create or replace function public.na_admin_mark_notes_read(p_token text, p_id text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_token is null or not exists (select 1 from na_admin_secret s where s.token = p_token) then
    raise exception 'unauthorized'; end if;
  update na_student_notes set read_at = now() where student_id = p_id and read_at is null;
end; $$;

-- ── 9. 권한: RLS 잠금 테이블은 token RPC 로만. 전 RPC anon 실행 허용(토큰 자체가 게이트). ──
do $$ begin
  revoke all on function public.na_student_is_claimed(text, text) from public;
  revoke all on function public.na_student_register(text, text, text) from public;
  revoke all on function public.na_student_get_salt(text, text) from public;
  revoke all on function public.na_student_verify(text, text, text) from public;
  revoke all on function public.na_student_reset(text, text) from public;
  revoke all on function public.na_auth_throttle_hit(text, text, int, int) from public;
  revoke all on function public.na_record_dwell(text, text, int, text, text, int) from public;
  revoke all on function public.na_record_note(text, text, int, text, text) from public;
  revoke all on function public.na_admin_roster(text) from public;
  revoke all on function public.na_admin_student_detail(text, text) from public;
  revoke all on function public.na_admin_note_inbox(text) from public;
  revoke all on function public.na_admin_student_notes(text, text) from public;
  revoke all on function public.na_admin_mark_notes_read(text, text) from public;

  grant execute on function public.na_student_is_claimed(text, text) to anon;
  grant execute on function public.na_student_register(text, text, text) to anon;
  grant execute on function public.na_student_get_salt(text, text) to anon;
  grant execute on function public.na_student_verify(text, text, text) to anon;
  grant execute on function public.na_student_reset(text, text) to anon;
  grant execute on function public.na_auth_throttle_hit(text, text, int, int) to anon;
  grant execute on function public.na_record_dwell(text, text, int, text, text, int) to anon;
  grant execute on function public.na_record_note(text, text, int, text, text) to anon;
  grant execute on function public.na_admin_roster(text) to anon;
  grant execute on function public.na_admin_student_detail(text, text) to anon;
  grant execute on function public.na_admin_note_inbox(text) to anon;
  grant execute on function public.na_admin_student_notes(text, text) to anon;
  grant execute on function public.na_admin_mark_notes_read(text, text) to anon;
end $$;

-- 완료. 이후 학생이 /enter 에서 학번 등록 → 강의 열람 시 학습 기록이 여기에 쌓입니다.
