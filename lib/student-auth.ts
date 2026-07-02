import { scryptSync, randomBytes, createHmac, timingSafeEqual } from "crypto";

// scrypt 파라미터 (서버 전용 해시). 평문 비번은 저장하지 않는다.
const KEYLEN = 64;
const PARAMS = { N: 16384, r: 8, p: 1 } as const;

export function newSalt(): string {
  return randomBytes(16).toString("hex");
}

function hashWith(pw: string, saltHex: string): string {
  return scryptSync(pw, Buffer.from(saltHex, "hex"), KEYLEN, PARAMS).toString("hex");
}

/** 저장/검증용 해시 "<saltHex>:<hashHex>". 등록 시 newSalt(), 로그인 시 저장된 salt 재사용. */
export function buildHash(pw: string, saltHex: string): string {
  return saltHex + ":" + hashWith(pw, saltHex);
}

// ── 서명 세션 ──────────────────────────────────────────────────────────────
// /api/track 가 신뢰하는 식별원본. "<sid>.<hmac>" — 서버 비밀키로 서명 → 위조 불가.
// 평문 na_sid(클라 표시용)와 달리 SESSION_COOKIE(httpOnly)에 담겨 자동 전송된다.
const SESSION_SECRET = process.env.NA_ADMIN_TOKEN ?? ""; // 서버 전용 비밀 (Vercel env, admin_secret 와 동일)

export function signSession(sid: string): string {
  const mac = createHmac("sha256", SESSION_SECRET).update(sid).digest("hex");
  return sid + "." + mac;
}

/** 서명 검증 후 sid 반환 (위조/변조 시 null). */
export function verifySession(token: string | undefined | null): string | null {
  if (!token || !SESSION_SECRET) return null;
  const i = token.lastIndexOf(".");
  if (i < 1) return null;
  const sid = token.slice(0, i);
  const mac = token.slice(i + 1);
  const expect = createHmac("sha256", SESSION_SECRET).update(sid).digest("hex");
  let a: Buffer, b: Buffer;
  try {
    a = Buffer.from(mac, "hex");
    b = Buffer.from(expect, "hex");
  } catch {
    return null;
  }
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return sid;
}
