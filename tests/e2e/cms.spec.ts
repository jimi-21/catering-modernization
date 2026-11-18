import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/admin/login");
  await page.getByRole("textbox", { name: "邮箱" }).fill("admin@hengshan.demo");
  await page.getByLabel("密码", { exact: true }).fill("Demo!2026");
  await page.getByRole("button", { name: "登录后台" }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

test("contact form stores an inquiry visible in the CMS", async ({ page }, testInfo) => {
  const name = `测试联系人-${testInfo.project.name}-${Date.now()}`;
  await page.goto("/contact");
  await page.getByLabel("联系人", { exact: false }).fill(name);
  await page.getByLabel("单位名称").fill("演示企业");
  await page.getByLabel("联系电话").fill("13800000000");
  await page.getByLabel("咨询方向").selectOption("食堂承包与运营");
  await page.getByLabel("补充说明").fill("约 300 人，两餐，希望了解交接流程。");
  await page.getByRole("button", { name: "提交咨询需求" }).click();
  await expect(page.getByText("需求已提交。")).toBeVisible();
  await expect(page.getByLabel("联系人")).toHaveValue("");
  await login(page);
  await page.goto("/admin/inquiries");
  const inquiry = page.locator("article").filter({ hasText: name });
  await expect(inquiry.getByRole("heading", { name })).toBeVisible();
  await inquiry.getByLabel("处理状态").selectOption("CONTACTED");
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.request().method() === "POST" && response.url().includes("/admin/inquiries"),
    ),
    inquiry.getByRole("button", { name: "更新状态" }).click(),
  ]);
  await expect(inquiry.getByLabel("处理状态")).toHaveValue("CONTACTED");
  await inquiry.getByRole("button", { name: `删除咨询 ${name}` }).click();
  await page.getByRole("dialog").getByRole("button", { name: "确认删除咨询" }).click();
  await expect(page.locator("article").filter({ hasText: name })).toHaveCount(0);
});

test("honeypot submissions return success without storing personal data", async ({
  page,
}, testInfo) => {
  const name = `机器人-${testInfo.project.name}-${Date.now()}`;
  await page.goto("/contact");
  await page.getByLabel("联系人").fill(name);
  await page.getByLabel("联系电话").fill("13800000000");
  await page.getByLabel("咨询方向").selectOption("其他合作");
  await page.locator("#contact-website").evaluate((input) => {
    (input as HTMLInputElement).value = "https://spam.invalid";
  });
  await page.getByRole("button", { name: "提交咨询需求" }).click();
  await expect(page.getByText("需求已提交。")).toBeVisible();
  await expect(page.getByLabel("联系人")).toHaveValue("");
  await login(page);
  await page.goto("/admin/inquiries");
  await expect(page.getByRole("heading", { name })).toHaveCount(0);
});

test("admin pages pass automated WCAG AA checks", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("联系人").fill("后台可访问性咨询");
  await page.getByLabel("联系电话").fill("13800000000");
  await page.getByLabel("咨询方向").selectOption("其他合作");
  await page.getByRole("button", { name: "提交咨询需求" }).click();
  await expect(page.getByText("需求已提交。")).toBeVisible();
  await login(page);
  await page.getByRole("link", { name: "新建内容" }).click();
  await expect(page).toHaveURL(/\/admin\/content\/new$/);
  for (const route of ["/admin", "/admin/content", "/admin/content/new", "/admin/inquiries"]) {
    await page.goto(route);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1),
      `${route} admin overflow`,
    ).toBe(false);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map((violation) => ({
        id: violation.id,
        nodes: violation.nodes.map((node) => ({
          target: node.target,
          summary: node.failureSummary,
        })),
      })),
    ).toEqual([]);
  }
  const inquiry = page.locator("article").filter({ hasText: "后台可访问性咨询" });
  await inquiry.getByRole("button", { name: "删除咨询 后台可访问性咨询" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const dialogResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(dialogResults.violations.map((violation) => violation.id)).toEqual([]);
  await dialog.getByRole("button", { name: "确认删除咨询" }).click();
  await expect(inquiry).toHaveCount(0);
});

test("CMS supports draft creation, publishing, image upload and deletion", async ({
  page,
}, testInfo) => {
  const suffix = `${testInfo.project.name}-${Date.now()}`;
  const slug = `cms-e2e-${suffix}`;
  const title = `CMS 验收文章 ${suffix}`;
  await login(page);
  await page.goto("/admin/content/new");
  await page.getByRole("textbox", { name: "标题", exact: true }).fill(title);
  await page.getByLabel("URL 别名").fill(slug);
  await page
    .getByRole("textbox", { name: "摘要", exact: true })
    .fill("这是一条用于验证后台完整工作流的自动化测试摘要。");
  await page
    .getByLabel("正文（Markdown）")
    .fill(
      "# 验收正文\n\n这条内容先保存为草稿，再通过后台编辑发布，验证数据库与前台渲染闭环。\n\n| 项目 | 检查 | 负责人 | 结果 |\n| --- | --- | --- | --- |\n| 食材 | 验收 | 管理员 | 通过 |",
    );
  await page.getByRole("button", { name: "保存内容" }).click();
  await expect(page).toHaveURL(/\/admin\/content\?saved=1/);
  await page.goto("/admin");
  const draftRow = page.locator("li").filter({ hasText: title });
  await expect(draftRow.getByText("发布后预览")).toBeVisible();
  await expect(draftRow.getByRole("link", { name: "预览" })).toHaveCount(0);

  await page.goto("/admin/content");
  await page.getByRole("searchbox", { name: "搜索标题或别名" }).fill(slug);
  await page.getByRole("button", { name: "筛选" }).click();
  await expect(page).toHaveURL(/q=/);
  await expect(page.getByRole("link", { name: "编辑", exact: true })).toHaveCount(1);
  await page.getByRole("link", { name: "编辑", exact: true }).click();
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("textbox", { name: "标题", exact: true })).toHaveValue(title);
  await expect(page.getByLabel("URL 别名")).toHaveAttribute("readonly", "");
  await expect(page.locator("#kind")).toBeDisabled();
  await page.getByLabel("发布状态").selectOption("PUBLISHED");
  await page.getByLabel("上传新封面").setInputFiles({
    name: "broken.png",
    mimeType: "image/png",
    buffer: Buffer.from("not-a-real-image"),
  });
  await page.getByRole("button", { name: "保存内容" }).click();
  await expect(page.getByText("仅支持有效的 JPG、PNG 或 WebP 图片。")).toBeVisible();
  await expect(page.getByRole("textbox", { name: "标题", exact: true })).toHaveValue(title);
  await expect(page.getByLabel("发布状态")).toHaveValue("PUBLISHED");
  await page.getByLabel("上传新封面").setInputFiles("public/images/meal-balanced.webp");
  await page.getByLabel("图片替代文本").fill("自动化测试上传的餐食封面");
  await page.getByRole("button", { name: "保存内容" }).click();
  await expect(page).toHaveURL(new RegExp(`/insights/${slug}$`));
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
  await expect(page.locator("article h1")).toHaveCount(1);
  await expect(page.locator(".prose-content h2").first()).toHaveText("验收正文");
  await expect(page.locator(".prose-content table")).toBeVisible();
  await page.locator(".prose-content table").focus();
  await expect(page.locator(".prose-content table")).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  const originalPublishedAt = await page.locator("article > header time").getAttribute("dateTime");
  const firstImage = page.getByAltText("自动化测试上传的餐食封面");
  await expect(firstImage).toBeVisible();
  const firstSrc = await firstImage.getAttribute("src");
  const firstUploadPath =
    new URL(firstSrc!, "https://localhost").searchParams.get("url") ?? firstSrc!;
  expect((await page.request.get(firstUploadPath)).status()).toBe(200);

  await page.goto("/admin/content");
  await page.getByRole("searchbox", { name: "搜索标题或别名" }).fill(slug);
  await page.getByRole("button", { name: "筛选" }).click();
  await expect(page).toHaveURL(/q=/);
  await expect(page.getByRole("link", { name: "编辑", exact: true })).toHaveCount(1);
  await page.getByRole("link", { name: "编辑", exact: true }).click();
  await page.waitForLoadState("networkidle");
  await page.getByLabel("上传新封面").setInputFiles("public/images/hero-kitchen.webp");
  await page.getByRole("button", { name: "保存内容" }).click();
  await expect(page).toHaveURL(new RegExp(`/insights/${slug}$`));
  await expect(page.locator("article > header time")).toHaveAttribute(
    "dateTime",
    originalPublishedAt!,
  );
  const secondSrc = await page.getByAltText("自动化测试上传的餐食封面").getAttribute("src");
  const secondUploadPath =
    new URL(secondSrc!, "https://localhost").searchParams.get("url") ?? secondSrc!;
  expect(secondUploadPath).not.toBe(firstUploadPath);
  expect((await page.request.get(firstUploadPath)).status()).toBe(404);
  expect((await page.request.get(secondUploadPath)).status()).toBe(200);

  await page.goto("/admin/content");
  await page.getByRole("searchbox", { name: "搜索标题或别名" }).fill(slug);
  await page.getByRole("button", { name: "筛选" }).click();
  await expect(page).toHaveURL(/q=/);
  await expect(page.getByRole("link", { name: "编辑", exact: true })).toHaveCount(1);
  await page.getByRole("link", { name: "编辑", exact: true }).click();
  await page.waitForLoadState("networkidle");
  await page.getByLabel("发布状态").selectOption("DRAFT");
  await page.getByRole("button", { name: "保存内容" }).click();
  await expect(page).toHaveURL(/\/admin\/content\?saved=1/);
  await page.goto(`/admin/content?q=${slug}`);
  await page.getByRole("link", { name: "编辑", exact: true }).click();
  await page.waitForLoadState("networkidle");
  await page.getByLabel("发布状态").selectOption("PUBLISHED");
  await page.getByRole("button", { name: "保存内容" }).click();
  await expect(page).toHaveURL(new RegExp(`/insights/${slug}$`));
  await expect(page.locator("article > header time")).toHaveAttribute(
    "dateTime",
    originalPublishedAt!,
  );

  await page.goto(`/admin/content?q=${slug}`);
  await page.getByRole("link", { name: "编辑", exact: true }).click();
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "删除内容" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "确认永久删除" }).click();
  await expect(page).toHaveURL(/\/admin\/content\?deleted=1/);
  const response = await page.request.get(`/insights/${slug}`);
  expect(response.status()).toBe(404);
  expect((await page.request.get(secondUploadPath)).status()).toBe(404);
});
