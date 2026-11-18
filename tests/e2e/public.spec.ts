import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("public pages render without horizontal overflow", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("把一日三餐");
  await expect(
    page.getByRole("heading", { name: "制造产业园：让高峰期供餐更有秩序" }),
  ).toBeVisible();
  await expect(page.locator("footer")).toContainText("独立开发演示");
  const routes = [
    "/",
    "/services",
    "/services/canteen-operation",
    "/cases",
    "/insights",
    "/about",
    "/contact",
  ];
  const checkOverflow = async () => {
    for (const route of routes) {
      await page.goto(route);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1),
        `${route} overflows at ${await page.evaluate(() => innerWidth)}px`,
      ).toBe(false);
    }
  };
  await checkOverflow();
  if (testInfo.project.name === "mobile") {
    await page.setViewportSize({ width: 320, height: 740 });
    await checkOverflow();
  }
});

test("navigation exposes the current page and works on mobile", async ({ page }, testInfo) => {
  await page.goto("/services");
  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "打开导航菜单" }).click();
    const menu = page.locator("#site-menu");
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: "服务能力" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await menu.getByRole("link", { name: "项目案例" }).click();
  } else {
    await page
      .getByRole("navigation", { name: "主导航" })
      .getByRole("link", { name: "项目案例" })
      .click();
  }
  await expect(page).toHaveURL(/\/cases$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("把方案放进真实问题里检验");
});

test("contact form is immediately reachable and page title stays concise", async ({
  page,
}, testInfo) => {
  await page.goto("/contact");
  if (testInfo.project.name === "mobile") {
    await expect(page.getByRole("textbox", { name: "联系人" })).toBeInViewport();
  } else {
    await expect(page.getByRole("textbox", { name: "联系人" })).toBeVisible();
  }
  await expect(page).toHaveTitle("获取团餐与食堂运营方案｜衡膳");
});

test("server-side contact errors preserve entered values", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("联系人").fill("表单保留测试");
  await page.getByLabel("联系电话").fill("13800000000");
  await page.getByLabel("补充说明").fill("这段留言在校验失败后不应该被清空。");
  await page.locator("#contact-need").evaluate((select) => {
    const element = select as HTMLSelectElement;
    element.add(new Option("伪造方向", "invalid-need"));
    element.value = "invalid-need";
  });
  await page.getByRole("button", { name: "提交咨询需求" }).click();
  await expect(page.getByText("请选择有效的咨询方向")).toBeVisible();
  await expect(page.getByLabel("联系人")).toHaveValue("表单保留测试");
  await expect(page.getByLabel("补充说明")).toHaveValue("这段留言在校验失败后不应该被清空。");
});

test("article search returns relevant content and handles empty results", async ({ page }) => {
  await page.goto("/insights");
  await page.getByRole("searchbox", { name: "搜索文章" }).fill("菜单");
  await page.getByRole("button", { name: "搜索", exact: true }).click();
  await expect(page).toHaveURL(/q=/);
  await expect(
    page.getByRole("heading", { name: "周期菜单如何兼顾营养、口味与成本" }),
  ).toBeVisible();
  await page.getByRole("searchbox", { name: "搜索文章" }).fill("definitely-not-found");
  await page.getByRole("button", { name: "搜索", exact: true }).click();
  await expect(page.getByText("没有找到相关内容")).toBeVisible();
});

test("anonymous and tampered sessions cannot access private routes", async ({ request }) => {
  for (const route of ["/admin", "/admin/content", "/admin/inquiries"]) {
    const response = await request.get(route, { maxRedirects: 0 });
    expect(response.status()).toBe(307);
    expect(response.headers().location).toContain("/admin/login");
  }
  const tampered = await request.get("/admin", {
    headers: { cookie: "hengshan_admin=tampered-token" },
    maxRedirects: 0,
  });
  expect(tampered.status()).toBe(307);
});

test("hostile input stays escaped and private files cannot be traversed", async ({ request }) => {
  const payload = "<script>alert('xss')</script>";
  const search = await request.get(`/insights?q=${encodeURIComponent(payload)}`);
  expect(search.status()).toBe(200);
  expect(await search.text()).not.toContain(payload);
  expect((await request.get("/media/..%2F..%2Fpackage.json")).status()).toBe(404);
});

test("legacy URLs return a real 301 including query mapping", async ({ request }) => {
  const article = await request.get("/plus/view.php?aid=101", { maxRedirects: 0 });
  expect(article.status()).toBe(301);
  expect(article.headers().location).toBe("/insights/canteen-opening-week");
  const unknown = await request.get("/plus/view.php?aid=999", { maxRedirects: 0 });
  expect(unknown.status()).toBe(404);
});

test("SEO endpoints and security headers are present", async ({ request }) => {
  const home = await request.get("/");
  expect(home.headers()["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(home.headers()["x-content-type-options"]).toBe("nosniff");
  expect(await home.text()).toContain("/images/og-cover.jpg");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const sitemapXml = await sitemap.text();
  expect(sitemapXml).toContain("/insights/cycle-menu-planning");
  const homeEntry = sitemapXml.split("<url>")[1];
  expect(homeEntry).toBeDefined();
  if (homeEntry) expect(homeEntry).not.toContain("<lastmod>");
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Disallow: /admin");
});

test("interactive pages do not emit CSP violations", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && message.text().includes("Content Security Policy")) {
      errors.push(message.text());
    }
  });
  for (const route of ["/", "/services", "/services/canteen-operation", "/about", "/contact"]) {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
  }
  expect(errors).toEqual([]);
});

test("public pages and login pass automated WCAG AA checks", async ({ page }) => {
  for (const route of [
    "/",
    "/services",
    "/cases",
    "/insights",
    "/about",
    "/contact",
    "/admin/login",
  ]) {
    await page.goto(route);
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
});
