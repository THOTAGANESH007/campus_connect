import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,       // keep sequential so shared state is safe
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],

  use: {
    baseURL: process.env.FRONTEND_URL ?? "http://localhost:5173",
    headless: true,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry",
  },

  projects: [
    /* ── Setup: creates saved auth states ── */
    {
      name: "setup",
      testMatch: /global\.setup\.ts/,
    },

    /* ── Student tests ── */
    {
      name: "student",
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: "tests/.auth/student.json",
      },
      testIgnore: /global\.setup\.ts/,
    },

    /* ── Admin tests ── */
    {
      name: "admin",
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: "tests/.auth/admin.json",
      },
      testMatch: /drives\.spec\.ts|applications\.spec\.ts/,
    },
  ],
});
