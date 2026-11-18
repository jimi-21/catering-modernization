import { z } from "zod";
import { INQUIRY_NEEDS } from "@/lib/inquiry-options";
import { CONTENT_KINDS, CONTENT_STATUSES, CONTENT_TEMPLATES } from "@/lib/content";

export const loginSchema = z.object({
  email: z.string().trim().email("请输入有效的邮箱地址").max(160),
  password: z.string().min(8, "密码至少需要 8 个字符").max(128),
});

export const contentSchema = z.object({
  id: z.string().optional(),
  kind: z.enum(CONTENT_KINDS),
  template: z.enum(CONTENT_TEMPLATES),
  status: z.enum(CONTENT_STATUSES),
  title: z.string().trim().min(2, "标题至少需要 2 个字符").max(100),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "仅使用小写字母、数字和连字符")
    .max(100),
  excerpt: z.string().trim().min(10, "摘要至少需要 10 个字符").max(240),
  body: z.string().trim().min(20, "正文至少需要 20 个字符").max(50000),
  category: z.string().trim().min(2, "请填写栏目").max(40),
  coverImage: z.string().trim().max(300).optional(),
  coverAlt: z.string().trim().max(160).optional(),
  seoTitle: z.string().trim().max(100).optional(),
  seoDescription: z.string().trim().max(200).optional(),
});

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "请填写联系人姓名").max(50),
  company: z.string().trim().max(100).optional(),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{7,20}$/, "请填写有效的联系电话")
    .refine((value) => /\d/.test(value), "联系电话至少包含一个数字"),
  need: z.enum(INQUIRY_NEEDS, "请选择有效的咨询方向"),
  message: z.string().trim().max(1000, "补充说明不能超过 1000 字").optional(),
  website: z.string().max(200).optional(),
});

export function firstError(error: z.ZodError) {
  return error.issues[0]?.message ?? "提交内容有误，请检查后重试。";
}
