"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getContentPath } from "@/lib/content";
import { db } from "@/lib/db";
import { removeUploadedCover, saveUploadedCover } from "@/lib/upload";
import { contentSchema, firstError } from "@/lib/validation";

export type ContentFormState = { error?: string };

export async function saveContent(
  _previousState: ContentFormState,
  formData: FormData,
): Promise<ContentFormState> {
  await requireAdmin();
  const parsed = contentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstError(parsed.error) };

  let uploaded: string | null = null;
  let savedPath = "";
  let destination = "/admin/content?saved=1";

  try {
    const { id, ...values } = parsed.data;
    const existing = id
      ? await db.content.findUnique({
          where: { id },
          select: { publishedAt: true, coverImage: true, kind: true, slug: true },
        })
      : null;
    if (id && !existing) return { error: "这条内容已不存在，请返回列表后重试。" };
    if (existing && (existing.slug !== values.slug || existing.kind !== values.kind)) {
      return { error: "内容类型和 URL 别名创建后不可修改。" };
    }

    uploaded = await saveUploadedCover(formData.get("coverUpload") as File | null);
    const removeCover = formData.get("removeCover") === "on";
    const data = {
      ...values,
      seoTitle: values.seoTitle || null,
      seoDescription: values.seoDescription || null,
      coverAlt: values.coverAlt || null,
      coverImage: uploaded ?? (removeCover ? null : (existing?.coverImage ?? null)),
    };
    const publishedAt =
      existing?.publishedAt ?? (values.status === "PUBLISHED" ? new Date() : null);
    const saved = id
      ? await db.content.update({ where: { id }, data: { ...data, publishedAt } })
      : await db.content.create({ data: { ...data, publishedAt } });

    savedPath = getContentPath(saved);
    if (existing?.coverImage && existing.coverImage !== saved.coverImage) {
      await removeUploadedCover(existing.coverImage);
    }
    destination = values.status === "PUBLISHED" ? savedPath : destination;
  } catch (error) {
    if (uploaded) await removeUploadedCover(uploaded);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "这个 URL 别名已被使用，请更换。" };
    }
    if (error instanceof Error && error.message.includes("图片")) {
      return { error: error.message };
    }
    if (error instanceof Error && error.message.includes("封面")) {
      return { error: error.message };
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return { error: "这条内容刚被另一位管理员删除，请返回列表确认。" };
    }
    throw error;
  }

  revalidatePath("/", "layout");
  revalidatePath(savedPath);
  redirect(destination);
}

export async function deleteContent(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const content = await db.content.findUnique({ where: { id } });
  if (!content) redirect("/admin/content?deleted=1");
  await db.content.deleteMany({ where: { id } });
  await removeUploadedCover(content.coverImage);
  revalidatePath("/", "layout");
  revalidatePath(getContentPath(content));
  redirect("/admin/content?deleted=1");
}
