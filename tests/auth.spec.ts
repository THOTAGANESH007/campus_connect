import { test, expect } from "@playwright/test";
import { STUDENT, ADMIN, registerViaAPI, loginViaUI } from "./utils/authHelper";

const FE = process.env.FRONTEND_URL ?? "http://localhost:5173";

test.describe("Auth — Sign Up", () => {
  test("registers a brand-new user and lands on a protected page", async ({ page }) => {
    const unique = `user_${Date.now()}@test.com`;
    await page.goto(`${FE}/signup`);

    await page.getByLabel(/name/i).fill("E2E User");
    await page.getByLabel(/email/i).fill(unique);
    await page.getByLabel(/^password$/i).fill("Password123!");
    // Role select — pick STUDENT if a dropdown exists
    const roleSelect = page.locator("select");
    if (await roleSelect.count()) await roleSelect.selectOption("STUDENT");

    await page.getByRole("button", { name: /sign up|register/i }).click();

    // Should leave signup page after success
    await page.waitForURL((url) => !url.toString().includes("/signup"), { timeout: 10_000 });
    expect(page.url()).not.toContain("/signup");
  });
});

test.describe("Auth — Sign In", () => {
  test.beforeAll(async () => {
    await registerViaAPI(STUDENT);
  });

  test("logs in with valid credentials and reaches protected area", async ({ page }) => {
    await loginViaUI(page, STUDENT.email, STUDENT.password);
    // After login we should be on a protected page (not signin)
    expect(page.url()).not.toContain("/signin");
  });

  test("shows error for wrong password", async ({ page }) => {
    await page.goto(`${FE}/signin`);
    await page.getByLabel(/email/i).fill(STUDENT.email);
    await page.getByLabel(/password/i).fill("WrongPassword!");
    await page.getByRole("button", { name: /sign in|login/i }).click();

    // Should stay on signin or show an error
    await expect(
      page.getByText(/invalid|incorrect|wrong|error|failed/i)
    ).toBeVisible({ timeout: 8_000 });
  });

  test("shows error for non-existent email", async ({ page }) => {
    await page.goto(`${FE}/signin`);
    await page.getByLabel(/email/i).fill("nobody@nowhere.com");
    await page.getByLabel(/password/i).fill("Password123!");
    await page.getByRole("button", { name: /sign in|login/i }).click();

    await expect(
      page.getByText(/invalid|not found|no account|error/i)
    ).toBeVisible({ timeout: 8_000 });
  });
});

test.describe("Auth — Logout", () => {
  test.use({ storageState: "tests/.auth/student.json" });

  test("logs out and redirects to public page", async ({ page }) => {
    await page.goto(`${FE}/drives`);
    // Click logout — button text may vary; look broadly
    await page.getByRole("button", { name: /log.?out|sign.?out/i }).click();

    await page.waitForURL(
      (url) =>
        url.toString().includes("/signin") ||
        url.toString().endsWith("/"),
      { timeout: 8_000 }
    );
    expect(
      page.url().includes("/signin") || page.url().endsWith("/")
    ).toBeTruthy();
  });
});

test.describe("Auth — Forgot Password", () => {
  test("shows OTP step after submitting registered email", async ({ page }) => {
    await page.goto(`${FE}/forgot-password`);
    await page.getByLabel(/email/i).fill(STUDENT.email);
    await page.getByRole("button", { name: /send|submit|next/i }).click();

    // Should either navigate to /verify-otp or show an OTP prompt
    await page.waitForURL(
      (url) =>
        url.toString().includes("/verify-otp") ||
        url.toString().includes("/forgot"),
      { timeout: 8_000 }
    );
    // OTP field or success message visible
    const indicator = page.getByText(/otp|sent|check|verify/i);
    await expect(indicator).toBeVisible({ timeout: 6_000 });
  });
});
