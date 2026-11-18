"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { isInquiryLimited, recordInquirySubmission } from "@/lib/inquiry-rate-limit";
import { firstError, inquirySchema } from "@/lib/validation";

export type InquiryState = { success?: boolean; error?: string };

export async function submitInquiry(
  _previousState: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const parsed = inquirySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstError(parsed.error) };
  if (parsed.data.website) return { success: true };

  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",").at(-1)?.trim() ?? "local";
  if (isInquiryLimited(ip)) return { error: "提交较为频繁，请稍后再试。" };

  try {
    await db.inquiry.create({
      data: {
        name: parsed.data.name,
        company: parsed.data.company,
        phone: parsed.data.phone,
        need: parsed.data.need,
        message: parsed.data.message,
      },
    });
    recordInquirySubmission(ip);
    revalidatePath("/admin/inquiries");
    return { success: true };
  } catch (error) {
    console.error("Unable to store inquiry.", error);
    return { error: "暂时无法提交，请稍后重试。" };
  }
}
