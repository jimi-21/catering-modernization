import { describe, expect, it } from "vitest";
import { createSessionToken, verifySessionToken } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/password";

describe("admin authentication", () => {
  it("hashes passwords with a unique salt and verifies the original", async () => {
    const first = await hashPassword("a-secure-password");
    const second = await hashPassword("a-secure-password");
    expect(first).not.toBe(second);
    expect(await verifyPassword("a-secure-password", first)).toBe(true);
    expect(await verifyPassword("wrong-password", first)).toBe(false);
  });

  it("verifies a signed session and rejects tampering", () => {
    const session = {
      email: "admin@example.test",
      name: "Admin",
      exp: Math.floor(Date.now() / 1000) + 60,
    };
    const token = createSessionToken(session);
    expect(verifySessionToken(token)).toEqual(session);
    expect(verifySessionToken(`${token}x`)).toBeNull();
    expect(verifySessionToken(undefined)).toBeNull();
  });

  it("rejects expired sessions", () => {
    const token = createSessionToken({ email: "admin@example.test", name: "Admin", exp: 1 });
    expect(verifySessionToken(token)).toBeNull();
  });
});
