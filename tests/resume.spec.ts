import { test, expect } from "@playwright/test";
import path from "path";

const FE = process.env.FRONTEND_URL ?? "http://localhost:5173";

// Path to a minimal valid PDF placed in tests/fixtures/
const SAMPLE_PDF = path.join(__dirname, "fixtures", "sample_resume.pdf");

// ── Mocked AI response ────────────────────────────────────────────────
const MOCK_ANALYSIS = {
  score: 82,
  skills: ["JavaScript", "React", "Node.js", "MongoDB"],
  suggestions: [
    "Add quantified achievements to each role.",
    "Include a professional summary at the top.",
    "List relevant certifications.",
    "Tailor keywords to the target job description.",
  ],
  recommendedRoles: ["Frontend Developer", "Full Stack Engineer", "React Developer"],
  summary: "Experienced full-stack developer with strong JavaScript focus.",
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
test.describe("Resume Analyzer", () => {
  test.use({ storageState: "tests/.auth/student.json" });

  // Intercept Gemini-backed analysis with deterministic mock
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/resume/analyze", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_ANALYSIS),
      });
    });
  });

  // ── 1. Page loads ────────────────────────────────────────────────
  test("resume-analyzer page is accessible", async ({ page }) => {
    await page.goto(`${FE}/resume-analyzer`);
    await expect(page).toHaveURL(/\/resume-analyzer/);
    await expect(
      page.getByRole("heading", { name: /resume|analyze/i })
    ).toBeVisible({ timeout: 8_000 });
  });

  // ── 2. Drag-drop zone / upload button is visible ─────────────────
  test("upload drop-zone is visible", async ({ page }) => {
    await page.goto(`${FE}/resume-analyzer`);
    // The drop zone contains a file input or upload label
    const dropzone = page
      .locator("input[type='file'], [aria-label*='upload'], [aria-label*='drop']")
      .first();
    // At least one upload trigger must be in the DOM
    await expect(dropzone).toBeAttached({ timeout: 6_000 });
  });

  // ── 3. Upload PDF and see results ─────────────────────────────────
  test("uploading a PDF shows analysis results", async ({ page }) => {
    await page.goto(`${FE}/resume-analyzer`);

    // Set the file on the hidden input
    await page.setInputFiles("input[type='file']", SAMPLE_PDF);

    // Click analyse button
    await page.getByRole("button", { name: /analyz/i }).click();

    // Score visible (the number 82 should appear)
    await expect(page.getByText("82")).toBeVisible({ timeout: 12_000 });

    // At least one skill tag rendered
    await expect(page.getByText("JavaScript")).toBeVisible();

    // At least one suggestion
    await expect(
      page.getByText(/quantified|summary|certification/i)
    ).toBeVisible();

    // At least one recommended role
    await expect(
      page.getByText(/Frontend Developer|Full Stack/i)
    ).toBeVisible();
  });

  // ── 4. Edge case: non-PDF file rejected ───────────────────────────
  test("non-PDF file shows an error message", async ({ page }) => {
    await page.goto(`${FE}/resume-analyzer`);

    // Create a tiny .txt buffer in-memory and use as a fake bad file
    await page.setInputFiles("input[type='file']", {
      name: "not_a_resume.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("This is not a PDF"),
    });

    await expect(
      page.getByText(/only pdf|pdf.*accept|invalid file|not accepted/i)
    ).toBeVisible({ timeout: 6_000 });
  });

  // ── 5. Edge case: API error is handled gracefully ─────────────────
  test("API error shows a user-friendly message", async ({ page }) => {
    // Override the mock for this specific test
    await page.unroute("**/api/resume/analyze");
    await page.route("**/api/resume/analyze", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Internal Server Error" }),
      });
    });

    await page.goto(`${FE}/resume-analyzer`);
    await page.setInputFiles("input[type='file']", SAMPLE_PDF);
    await page.getByRole("button", { name: /analyz/i }).click();

    await expect(
      page.getByText(/failed|error|try again|something went wrong/i)
    ).toBeVisible({ timeout: 10_000 });
  });

  // ── 6. "Analyze Another" resets the page ─────────────────────────
  test("analyze-another button resets to upload state", async ({ page }) => {
    await page.goto(`${FE}/resume-analyzer`);
    await page.setInputFiles("input[type='file']", SAMPLE_PDF);
    await page.getByRole("button", { name: /analyz/i }).click();

    // Wait for results to appear
    await expect(page.getByText("82")).toBeVisible({ timeout: 12_000 });

    // Click reset
    await page.getByRole("button", { name: /another|reset|analyz again/i }).click();

    // Drop zone should be visible again
    await expect(
      page.locator("input[type='file']").first()
    ).toBeAttached({ timeout: 6_000 });
  });
});
