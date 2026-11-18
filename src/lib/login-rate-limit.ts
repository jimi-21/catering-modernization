import { createRateLimiter } from "@/lib/rate-limit";

const accountLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, maxAttempts: 8 });
const ipLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, maxAttempts: 64 });

export function isLoginLimited(key: string) {
  return accountLimiter.isLimited(key);
}

export function recordLoginFailure(key: string) {
  accountLimiter.record(key);
}

export function clearLoginFailures(key: string) {
  accountLimiter.clear(key);
}

export function isLoginIpLimited(ip: string) {
  return ipLimiter.isLimited(ip);
}

export function recordLoginIpFailure(ip: string) {
  ipLimiter.record(ip);
}

export function clearLoginIpFailures(ip: string) {
  ipLimiter.clear(ip);
}
