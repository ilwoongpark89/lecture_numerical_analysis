import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** anon 키 기반 클라이언트. 쓰기는 RLS(INSERT-only)로, 교수 열람은 token RPC 로. */
export function supabase(): SupabaseClient {
  if (!url || !anon) {
    throw new Error("Supabase env (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY) 미설정 — SETUP.md 참고");
  }
  return createClient(url, anon, { auth: { persistSession: false } });
}

/**
 * service_role 키 기반 서버 전용 클라이언트 (RLS 우회). SUPABASE_SERVICE_ROLE_KEY 설정 시에만.
 * 미설정이면 null → 호출부는 token RPC 로 fallback.
 */
export function supabaseAdmin(): SupabaseClient | null {
  if (!url || !service) return null;
  return createClient(url, service, { auth: { persistSession: false } });
}

// 쿠키 이름 SoT 는 lib/cookies.ts (client·server 공용). 기존 import 경로 유지 위해 re-export.
export { STUDENT_COOKIE, SESSION_COOKIE, ADMIN_COOKIE, PROF_SID } from "./cookies";
