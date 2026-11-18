import { createHash } from "node:crypto";
import { z } from "zod";
import { slugify } from "@/lib/utils";

export type LegacyRecord = {
  id: number;
  title: string;
  slug?: string;
  category: string;
  body: string;
  createdAt: string;
  legacyUrl: string;
};

export type MigrationDecision = {
  legacyId: number | null;
  title: string;
  action: "IMPORT" | "SKIP_DUPLICATE" | "SKIP_OUT_OF_SCOPE" | "SKIP_INVALID" | "SKIP_CONFLICT";
  reason: string;
  target?: string;
};

const legacyRecordSchema = z.object({
  id: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
  title: z.string().trim().min(2).max(100),
  slug: z.string().trim().max(100).optional(),
  category: z.string().trim().min(1).max(80),
  body: z.string().trim().min(20).max(50000),
  createdAt: z.string().refine((value) => !Number.isNaN(Date.parse(value)), "非法发布日期"),
  legacyUrl: z
    .string()
    .regex(/^\/(?!\/)/)
    .max(1000),
});

const outOfScopePattern = /养生|健康|中医|美容|减肥|保健|疾病|食疗/;

function normalize(value: string) {
  return value.toLowerCase().replace(/[\s\p{P}\p{S}]+/gu, "");
}

function plainText(markdown: string) {
  return markdown
    .replace(/[#>*_`\-\[\]()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function processLegacyRecords(records: unknown[]) {
  const seenTitles = new Set<string>();
  const seenBodies = new Set<string>();
  const seenSlugs = new Set<string>();
  const seenLegacyUrls = new Set<string>();
  const decisions: MigrationDecision[] = [];
  const entries: {
    kind: string;
    template: string;
    status: string;
    title: string;
    slug: string;
    excerpt: string;
    body: string;
    category: string;
    coverImage: string;
    coverAlt: string;
    seoTitle: string;
    seoDescription: string;
    publishedAt: Date;
  }[] = [];
  const redirects: { from: string; to: string }[] = [];
  let renamed = 0;

  for (const input of records) {
    const parsed = legacyRecordSchema.safeParse(input);
    if (!parsed.success) {
      const candidate = input as Partial<LegacyRecord> | null;
      decisions.push({
        legacyId: typeof candidate?.id === "number" ? candidate.id : null,
        title: typeof candidate?.title === "string" ? candidate.title : "无法读取的记录",
        action: "SKIP_INVALID",
        reason: parsed.error.issues[0]?.message ?? "记录结构不符合迁移要求。",
      });
      continue;
    }
    const record: LegacyRecord = parsed.data;

    if (seenLegacyUrls.has(record.legacyUrl)) {
      decisions.push({
        legacyId: record.id,
        title: record.title,
        action: "SKIP_CONFLICT",
        reason: "旧 URL 与另一条记录重复，需人工确认权威目标。",
      });
      continue;
    }
    seenLegacyUrls.add(record.legacyUrl);

    if (outOfScopePattern.test(`${record.category}${record.title}`)) {
      decisions.push({
        legacyId: record.id,
        title: record.title,
        action: "SKIP_OUT_OF_SCOPE",
        reason: "与餐饮管理业务无关，迁移时剔除。",
      });
      continue;
    }

    const normalizedTitle = normalize(record.title);
    const bodyHash = createHash("sha256").update(normalize(record.body)).digest("hex");
    if (seenTitles.has(normalizedTitle) || seenBodies.has(bodyHash)) {
      decisions.push({
        legacyId: record.id,
        title: record.title,
        action: "SKIP_DUPLICATE",
        reason: "规范化标题或正文摘要与已处理记录重复。",
      });
      continue;
    }
    seenTitles.add(normalizedTitle);
    seenBodies.add(bodyHash);

    const kind = /案例|项目/.test(record.category) ? "CASE" : "ARTICLE";
    const text = plainText(record.body);
    if (Array.from(text).length < 10) {
      decisions.push({
        legacyId: record.id,
        title: record.title,
        action: "SKIP_INVALID",
        reason: "正文清理标记后不足 10 个字符，无法生成有效摘要。",
      });
      continue;
    }
    const baseSlug = slugify(record.slug || record.title) || `legacy-${record.id}`;
    let slug = baseSlug;
    let suffix = record.id;
    while (seenSlugs.has(slug)) {
      const suffixText = String(suffix);
      slug = `${baseSlug.slice(0, 100 - suffixText.length - 1)}-${suffixText}`;
      suffix += 1;
    }
    if (slug !== baseSlug) renamed += 1;
    seenSlugs.add(slug);
    const target = kind === "CASE" ? `/cases/${slug}` : `/insights/${slug}`;
    const excerpt = Array.from(text).slice(0, 110).join("");
    entries.push({
      kind,
      template: kind === "CASE" ? "FEATURE" : "STANDARD",
      status: "PUBLISHED",
      title: record.title,
      slug,
      excerpt,
      body: record.body,
      category: kind === "CASE" ? "迁移案例" : "运营方法",
      coverImage: kind === "CASE" ? "/images/dining-space.webp" : "/images/meal-balanced.webp",
      coverAlt: kind === "CASE" ? "食堂用餐环境" : "均衡搭配的餐食",
      seoTitle: record.title,
      seoDescription: excerpt,
      publishedAt: new Date(record.createdAt),
    });
    redirects.push({ from: record.legacyUrl, to: target });
    decisions.push({
      legacyId: record.id,
      title: record.title,
      action: "IMPORT",
      reason: slug === baseSlug ? "业务相关内容，通过重复检查。" : "原 URL 别名冲突，已追加旧 ID。",
      target,
    });
  }

  return {
    entries,
    redirects,
    decisions,
    summary: {
      total: records.length,
      imported: entries.length,
      duplicates: decisions.filter((item) => item.action === "SKIP_DUPLICATE").length,
      outOfScope: decisions.filter((item) => item.action === "SKIP_OUT_OF_SCOPE").length,
      invalid: decisions.filter((item) => item.action === "SKIP_INVALID").length,
      conflicts: decisions.filter((item) => item.action === "SKIP_CONFLICT").length,
      renamed,
    },
  };
}
