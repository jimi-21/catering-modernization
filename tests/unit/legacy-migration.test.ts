import { describe, expect, it } from "vitest";
import { processLegacyRecords, type LegacyRecord } from "@/lib/legacy-migration";

const base: LegacyRecord = {
  id: 1,
  title: "食堂运营清单",
  slug: "canteen-checklist",
  category: "食堂运营",
  body: "一份足够长的食堂运营正文，用于验证旧内容迁移后的摘要与目标链接。",
  createdAt: "2021-01-01T00:00:00.000Z",
  legacyUrl: "/plus/view.php?aid=1",
};

describe("legacy migration", () => {
  it("imports relevant content and creates a permanent redirect target", () => {
    const result = processLegacyRecords([base]);
    expect(result.summary).toEqual({
      total: 1,
      imported: 1,
      duplicates: 0,
      outOfScope: 0,
      invalid: 0,
      conflicts: 0,
      renamed: 0,
    });
    expect(result.entries[0].slug).toBe("canteen-checklist");
    expect(result.redirects).toEqual([{ from: base.legacyUrl, to: "/insights/canteen-checklist" }]);
  });

  it("removes duplicate titles or bodies without generating another redirect", () => {
    const result = processLegacyRecords([
      base,
      { ...base, id: 2, slug: "duplicate", legacyUrl: "/plus/view.php?aid=2" },
    ]);
    expect(result.summary.imported).toBe(1);
    expect(result.summary.duplicates).toBe(1);
    expect(result.decisions[1].action).toBe("SKIP_DUPLICATE");
    expect(result.redirects).toHaveLength(1);
  });

  it("filters unrelated wellness content", () => {
    const result = processLegacyRecords([{ ...base, title: "春季养生食谱", category: "健康养生" }]);
    expect(result.entries).toHaveLength(0);
    expect(result.decisions[0].action).toBe("SKIP_OUT_OF_SCOPE");
  });

  it("uses a stable fallback slug for Chinese-only titles", () => {
    const result = processLegacyRecords([{ ...base, slug: undefined }]);
    expect(result.entries[0].slug).toBe("legacy-1");
  });

  it("skips malformed dates and bodies without stopping the batch", () => {
    const result = processLegacyRecords([
      { ...base, createdAt: "not-a-date" },
      { ...base, id: 2, body: "短", legacyUrl: "/plus/view.php?aid=2" },
      {
        ...base,
        id: 3,
        title: "另一份有效的运营清单",
        slug: "valid-entry",
        legacyUrl: "/plus/view.php?aid=3",
      },
    ]);
    expect(result.summary.invalid).toBe(2);
    expect(result.summary.imported).toBe(1);
    expect(result.entries[0].slug).toBe("valid-entry");
  });

  it("resolves slug collisions without overwriting the first entry", () => {
    const result = processLegacyRecords([
      base,
      {
        ...base,
        id: 2,
        title: "另一篇不同的食堂运营文章",
        body: "这篇正文与第一篇明显不同，用于验证相同 URL 别名发生冲突时的安全处理。",
        legacyUrl: "/plus/view.php?aid=2",
      },
      {
        ...base,
        id: 2,
        title: "第三篇不同内容的运营文章",
        body: "第三篇正文与其他记录完全不同，用于验证重复旧 ID 也不会产生重复别名。",
        legacyUrl: "/plus/view.php?aid=3",
      },
    ]);
    expect(result.entries.map((entry) => entry.slug)).toEqual([
      "canteen-checklist",
      "canteen-checklist-2",
      "canteen-checklist-3",
    ]);
    expect(result.summary.renamed).toBe(2);
  });

  it("rejects ambiguous duplicate legacy URLs", () => {
    const result = processLegacyRecords([
      base,
      {
        ...base,
        id: 2,
        title: "另一篇不同的食堂运营文章",
        body: "这篇正文与第一篇明显不同，用于验证重复旧链接发生冲突时的安全处理。",
      },
    ]);
    expect(result.summary.conflicts).toBe(1);
    expect(result.decisions[1].action).toBe("SKIP_CONFLICT");
    expect(result.redirects).toHaveLength(1);
  });
});
