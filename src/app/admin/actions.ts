"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminSession, destroyAdminSession, requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  clearLoginFailures,
  clearLoginIpFailures,
  isLoginIpLimited,
  isLoginLimited,
  recordLoginFailure,
  recordLoginIpFailure,
} from "@/lib/login-rate-limit";
import { verifyPassword } from "@/lib/password";
import { firstError, loginSchema } from "@/lib/validation";

export type LoginState = { error?: string };

const DUMMY_PASSWORD_HASH =
  "scrypt$6f2ac9f14e7b4d238d5cb0a91364ef28$7403f3113c6a1e6c048e759c0b037dce88023316b418fdfbb35a26119d3a3373e15dfa72db1d0aee62454e20ecb750263cb94d0b579bc799dc9ecb6424b952b8";

export async function authenticate(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstError(parsed.error) };

  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",").at(-1)?.trim() ?? "local";
  const key = `${ip}:${parsed.data.email.toLowerCase()}`;
  if (isLoginLimited(key) || isLoginIpLimited(ip)) {
    return { error: "尝试次数过多，请 15 分钟后再试。" };
  }

  const user = await db.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  const valid = await verifyPassword(
    parsed.data.password,
    user?.passwordHash ?? DUMMY_PASSWORD_HASH,
  );
  if (!user || user.role !== "ADMIN" || !valid) {
    recordLoginFailure(key);
    recordLoginIpFailure(ip);
    return { error: "邮箱或密码不正确。" };
  }

  clearLoginFailures(key);
  clearLoginIpFailures(ip);
  await createAdminSession(user);
  redirect("/admin");
}

export async function signOut() {
  await requireAdmin();
  await destroyAdminSession();
  revalidatePath("/admin");
  redirect("/admin/login");
}
