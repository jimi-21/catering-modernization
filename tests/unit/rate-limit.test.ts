import { afterEach, describe, expect, it, vi } from "vitest";
import { createRateLimiter } from "@/lib/rate-limit";

afterEach(() => vi.useRealTimers());

describe("rate limiter", () => {
  it("blocks repeated attempts and resets after the window", () => {
    vi.useFakeTimers();
    const limiter = createRateLimiter({ windowMs: 1000, maxAttempts: 2 });
    limiter.record("user");
    expect(limiter.isLimited("user")).toBe(false);
    limiter.record("user");
    expect(limiter.isLimited("user")).toBe(true);
    vi.advanceTimersByTime(1001);
    expect(limiter.isLimited("user")).toBe(false);
  });

  it("keeps memory bounded under many unique keys", () => {
    const limiter = createRateLimiter({ windowMs: 60000, maxAttempts: 3, maxEntries: 10 });
    for (let index = 0; index < 100; index += 1) limiter.record(`key-${index}`);
    expect(limiter.size()).toBe(10);
  });

  it("can clear successful authentication attempts", () => {
    const limiter = createRateLimiter({ windowMs: 60000, maxAttempts: 1 });
    limiter.record("user");
    expect(limiter.isLimited("user")).toBe(true);
    limiter.clear("user");
    expect(limiter.isLimited("user")).toBe(false);
  });
});
