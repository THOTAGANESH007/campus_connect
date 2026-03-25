import { test, expect } from "@playwright/test";
import path from "path";

const FE          = process.env.FRONTEND_URL ?? "http://localhost:5173";
const SAMPLE_PDF  = path.join(__dirname, "fixtures", "sample_resume.pdf");

test.describe("Profile", () => {
  test.use({ storageState: "tests/.auth/student.json" });

  // ── 1. Profile page loads ─────────────────────────────────────────
  test("profile page is accessible and shows user info", async ({ page }) => {
    await page.goto(`${FE}/profile`);
    await expect(page).toHaveURL(/\/profile/);
    await expect(
      page.getByRole("heading", { name: /profile|my profile/i })
    ).toBeVisible({ timeout: 8_000 });
  });

  // ── 2. Update bio / skills ────────────────────────────────────────
  test("student can update profile fields and save", async ({ page }) => {
    await page.goto(`${FE}/profile`);

    // Fill bio if field exists
    const bioField = page.getByLabel(/bio|about/i);
    if (await bioField.count()) {
      await bioField.clear();
      await bioField.fill("E2E test bio — auto-generated.");
    }

    // Fill skills if field exists
    const skillsField = page.getByLabel(/skills/i);
    if (await skillsField.count()) {
      await skillsField.clear();
      await skillsField.fill("JavaScript, React, Playwright");
    }

    // Intercept the PUT
    const [apiReq] = await Promise.all([
      page.waitForRequest((r) =>
        r.url().includes("/api/profile/update") && r.method() === "PUT"
      ),
      page.getByRole("button", { name: /save|update/i }).click(),
    ]);
    expect(apiReq.method()).toBe("PUT");

    await expect(
      page.getByText(/saved|updated|success/i)
    ).toBeVisible({ timeout: 8_000 });
  });

  // ── 3. Resume upload ──────────────────────────────────────────────
  test("student can upload a resume PDF", async ({ page }) => {
    await page.goto(`${FE}/profile`);

    const resumeInput = page.locator("input[type='file']").first();
    await expect(resumeInput).toBeAttached({ timeout: 6_000 });

    await page.setInputFiles("input[type='file']", SAMPLE_PDF);

    // Intercept the upload PUT
    const [apiReq] = await Promise.all([
      page.waitForRequest((r) =>
        r.url().includes("/api/profile/upload-resume") && r.method() === "PUT"
      ),
      // Click the upload submit button if it exists
      page
        .getByRole("button", { name: /upload resume|save resume/i })
        .click()
        .catch(async () => {
          // If no explicit button, the form submits on file change
        }),
    ]);
    expect(apiReq.url()).toContain("/api/profile/upload-resume");
  });

  // ── 4. Data persists on reload ────────────────────────────────────
  test("saved profile data is still visible after reload", async ({ page }) => {
    await page.goto(`${FE}/profile`);

    const bioField = page.getByLabel(/bio|about/i);
    if (await bioField.count()) {
      await bioField.clear();
      await bioField.fill("Persistent bio check");
      await page.getByRole("button", { name: /save|update/i }).click();
      await page.waitForResponse((r) =>
        r.url().includes("/api/profile/update")
      );
    }

    await page.reload();
    await page.waitForURL(/\/profile/);

    const persistedBio = page.getByLabel(/bio|about/i);
    if (await persistedBio.count()) {
      const value = await persistedBio.inputValue();
      expect(value).toContain("Persistent bio");
    } else {
      // If no direct input field, just assert we're still on profile
      expect(page.url()).toContain("/profile");
    }
  });
});
