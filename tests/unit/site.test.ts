import { afterEach, describe, expect, it, vi } from "vitest";
import { getSiteUrl } from "@/lib/site";

afterEach(() => vi.unstubAllEnvs());

describe("site URL", () => {
  it("removes trailing slashes before generating canonical URLs", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com///");
    expect(getSiteUrl()).toBe("https://example.com");
  });

  it("provides a local default", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", undefined);
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });
});
