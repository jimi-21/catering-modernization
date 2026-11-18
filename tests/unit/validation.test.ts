import { describe, expect, it } from "vitest";
import { contentSchema, inquirySchema } from "@/lib/validation";
import { slugify } from "@/lib/utils";

describe("validation", () => {
  it("normalizes URL slugs", () => {
    expect(slugify("  Food Safety & Operations  ")).toBe("food-safety-operations");
    expect(slugify("食堂安全")).toBe("");
  });

  it("accepts a complete content entry", () => {
    const result = contentSchema.safeParse({
      kind: "ARTICLE",
      template: "STANDARD",
      status: "DRAFT",
      title: "食堂运营清单",
      slug: "canteen-checklist",
      excerpt: "这是一段符合长度要求的内容摘要。",
      body: "这是一段符合长度要求的正文，用于验证后台内容保存规则。",
      category: "运营方法",
    });
    expect(result.success).toBe(true);
  });

  it("rejects malformed slugs and invalid phone numbers", () => {
    expect(inquirySchema.safeParse({ name: "测试", phone: "abc", need: "食堂承包" }).success).toBe(
      false,
    );
    expect(contentSchema.safeParse({}).success).toBe(false);
    expect(
      inquirySchema.safeParse({ name: "测试", phone: "-------", need: "其他合作" }).success,
    ).toBe(false);
    expect(
      inquirySchema.safeParse({ name: "测试", phone: "13800000000", need: "伪造方向" }).success,
    ).toBe(false);
  });
});
