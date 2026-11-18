import { createRateLimiter } from "@/lib/rate-limit";

const limiter = createRateLimiter({ windowMs: 15 * 60 * 1000, maxAttempts: 10 });

export function isInquiryLimited(key: string) {
  return limiter.isLimited(key);
}

export function recordInquirySubmission(key: string) {
  limiter.record(key);
}
