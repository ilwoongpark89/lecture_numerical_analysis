// 학번/비밀번호 정책 SoT (client·server 공용, 의존성 0). 값 변경 시 전 사용처 자동 파생.
export const SID_RE = /^[A-Za-z0-9-]{4,32}$/;
export const SID_MAX = 32;
export const PW_MIN = 6;
export const PW_MAX = 100;
