import { defineConfig, devices } from "@playwright/test";

const externalBaseURL = process.env.E2E_BASE_URL;
const browserName = (process.env.PLAYWRIGHT_BROWSER ?? "chromium") as
  "chromium" | "firefox" | "webkit";
const desktopDevice =
  browserName === "chromium"
    ? devices["Desktop Chrome"]
    : { viewport: { width: 1280, height: 720 } };
const mobileDevice =
  browserName === "chromium"
    ? devices["Pixel 7"]
    : {
        viewport: { width: 412, height: 915 },
        deviceScaleFactor: 2,
        isMobile: browserName === "webkit",
        hasTouch: true,
      };

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  expect: { timeout: 10000 },
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: externalBaseURL ?? "http://127.0.0.1:3000",
    ignoreHTTPSErrors: Boolean(externalBaseURL),
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: {
      channel: browserName === "chromium" ? process.env.PLAYWRIGHT_CHANNEL : undefined,
    },
  },
  projects: [
    { name: "desktop", use: { ...desktopDevice, browserName } },
    { name: "mobile", use: { ...mobileDevice, browserName } },
  ],
  webServer: externalBaseURL
    ? undefined
    : {
        command: process.env.CI ? "npm run start" : "npm run build && npm run start",
        url: "http://127.0.0.1:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
        env: {
          DATABASE_URL: "file:./dev.db",
          AUTH_SECRET: "local-demo-secret-2026-hengshan-not-for-production",
          ADMIN_EMAIL: "admin@hengshan.demo",
          ADMIN_PASSWORD: "Demo!2026",
          NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3000",
        },
      },
});
