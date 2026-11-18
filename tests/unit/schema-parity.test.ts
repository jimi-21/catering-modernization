import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("database schema parity", () => {
  it("keeps SQLite and PostgreSQL models identical except for provider", async () => {
    const normalize = (source: string) =>
      source.replace(/provider\s*=\s*"(?:sqlite|postgresql)"/, 'provider = "database"');
    const [sqlite, postgresql] = await Promise.all([
      readFile(path.join(process.cwd(), "prisma/schema.prisma"), "utf8"),
      readFile(path.join(process.cwd(), "prisma/schema.postgresql.prisma"), "utf8"),
    ]);
    expect(normalize(sqlite)).toBe(normalize(postgresql));
  });
});
