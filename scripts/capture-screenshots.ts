import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const baseUrl = process.env.SCREENSHOT_BASE_URL ?? "http://127.0.0.1:3000";
const output = fileURLToPath(new URL("../docs/screenshots/", import.meta.url));
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL });

try {
  const desktop = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  await desktop.goto(baseUrl);
  await desktop.waitForLoadState("networkidle");
  await desktop.screenshot({ path: path.join(output, "home-desktop.png") });

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  await mobile.goto(baseUrl);
  await mobile.waitForLoadState("networkidle");
  await mobile.screenshot({ path: path.join(output, "home-mobile.png") });

  await desktop.goto(`${baseUrl}/admin/login`);
  await desktop
    .getByRole("textbox", { name: "邮箱" })
    .fill(process.env.ADMIN_EMAIL ?? "admin@hengshan.demo");
  await desktop.getByLabel("密码", { exact: true }).fill(process.env.ADMIN_PASSWORD ?? "Demo!2026");
  await desktop.getByRole("button", { name: "登录后台" }).click();
  await desktop.waitForURL("**/admin");
  await desktop.waitForLoadState("networkidle");
  await desktop.screenshot({ path: path.join(output, "cms-desktop.png") });
  console.log(`Screenshots saved to ${output}`);
} finally {
  await browser.close();
}
