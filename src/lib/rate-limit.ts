type RateLimitOptions = {
  windowMs: number;
  maxAttempts: number;
  maxEntries?: number;
};

export function createRateLimiter({ windowMs, maxAttempts, maxEntries = 5000 }: RateLimitOptions) {
  const attempts = new Map<string, { count: number; resetAt: number }>();

  function prune(now: number) {
    for (const [key, value] of attempts) {
      if (value.resetAt <= now) attempts.delete(key);
    }
    while (attempts.size >= maxEntries) {
      const oldest = attempts.keys().next().value;
      if (!oldest) break;
      attempts.delete(oldest);
    }
  }

  return {
    isLimited(key: string) {
      const now = Date.now();
      const current = attempts.get(key);
      if (!current) return false;
      if (current.resetAt <= now) {
        attempts.delete(key);
        return false;
      }
      return current.count >= maxAttempts;
    },
    record(key: string) {
      const now = Date.now();
      prune(now);
      const current = attempts.get(key);
      if (!current || current.resetAt <= now) {
        attempts.set(key, { count: 1, resetAt: now + windowMs });
        return;
      }
      current.count += 1;
    },
    clear(key: string) {
      attempts.delete(key);
    },
    size() {
      return attempts.size;
    },
  };
}
