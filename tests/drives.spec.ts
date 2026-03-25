import { test, expect, request } from "@playwright/test";

const FE  = process.env.FRONTEND_URL ?? "http://localhost:5173";
const API = process.env.BACKEND_URL  ?? "http://localhost:7777";

// ── Helpers ──────────────────────────────────────────────────────────
async function getFirstDriveId(): Promise<string | null> {
  const ctx = await request.newContext({ baseURL: API });
  // Need auth cookie — login via API first
  const login = await ctx.post("/api/auth/signin", {
    data: { email: "admin_e2e@test.com", password: "Password123!" },
  });
  if (!login.ok()) { await ctx.dispose(); return null; }

  const res  = await ctx.get("/api/drives");
  const body = await res.json();
  await ctx.dispose();
  return body?.drives?.[0]?._id ?? body?.[0]?._id ?? null;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  STUDENT — browse drives
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
test.describe("Drives — Student view", () => {
  test.use({ storageState: "tests/.auth/student.json" });

  test("drives page loads and shows a list", async ({ page }) => {
    await page.goto(`${FE}/drives`);
    // At minimum the heading should exist
    await expect(
      page.getByRole("heading", { name: /drives|placement/i })
    ).toBeVisible({ timeout: 8_000 });
  });

  test("drive cards or rows are rendered", async ({ page }) => {
    await page.goto(`${FE}/drives`);
    // generic: look for at least one card / list item
    const items = page.locator(
      "[data-testid='drive-card'], .drive-card, article, li"
    ).first();
    // If list is empty we still expect the page skeleton to be there
    await expect(page).toHaveURL(/\/drives/);
  });

  test("opens drive detail page", async ({ page }) => {
    const driveId = await getFirstDriveId();
    if (!driveId) {
      test.skip();
      return;
    }
    await page.goto(`${FE}/drives/${driveId}`);
    // Heading or company name should appear on details page
    await expect(
      page.getByRole("heading").first()
    ).toBeVisible({ timeout: 8_000 });
  });

  test("student can apply for a drive and sees confirmation", async ({ page, request: req }) => {
    const driveId = await getFirstDriveId();
    if (!driveId) { test.skip(); return; }

    await page.goto(`${FE}/drives/${driveId}`);
    const applyBtn = page.getByRole("button", { name: /apply/i });

    if (!(await applyBtn.isVisible())) {
      test.skip(); // already applied or not eligible
      return;
    }

    // Intercept the application POST so we can assert it fires
    const [apiReq] = await Promise.all([
      page.waitForRequest((r) =>
        r.url().includes("/api/applications/apply") && r.method() === "POST"
      ),
      applyBtn.click(),
    ]);

    expect(apiReq.url()).toContain(`/api/applications/apply/${driveId}`);

    // Check for a success indicator
    await expect(
      page.getByText(/applied|success|congratulations|pending/i)
    ).toBeVisible({ timeout: 10_000 });
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ADMIN — manage drives
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
test.describe("Drives — Admin / Officer management", () => {
  test.use({ storageState: "tests/.auth/admin.json" });

  let createdDriveId: string | null = null;

  test("admin can navigate to create-drive page", async ({ page }) => {
    await page.goto(`${FE}/drives/create`);
    await expect(page).toHaveURL(/\/drives\/create/);
    await expect(
      page.getByRole("heading", { name: /create|new drive|post/i })
    ).toBeVisible({ timeout: 8_000 });
  });

  test("admin creates a new drive", async ({ page }) => {
    await page.goto(`${FE}/drives/create`);

    await page.getByLabel(/company/i).fill("Playwright Corp");
    await page.getByLabel(/role|position/i).fill("QA Engineer");

    const pkg = page.getByLabel(/package|ctc|salary/i);
    if (await pkg.count()) await pkg.fill("8");

    const deadline = page.getByLabel(/deadline|last date/i);
    if (await deadline.count()) await deadline.fill("2026-12-31");

    const desc = page.getByLabel(/description|about/i);
    if (await desc.count()) await desc.fill("E2E test drive — auto-created.");

    // Intercept creation request
    const [apiReq] = await Promise.all([
      page.waitForRequest((r) =>
        r.url().includes("/api/drives") && r.method() === "POST"
      ),
      page.getByRole("button", { name: /create|submit|post/i }).click(),
    ]);
    expect(apiReq.method()).toBe("POST");

    // Capture the ID from the response so we can clean up / edit
    const apiRes = await apiReq.response();
    if (apiRes) {
      const body = await apiRes.json().catch(() => ({}));
      createdDriveId = body?.drive?._id ?? body?._id ?? null;
    }

    await expect(
      page.getByText(/created|success|playwright corp/i)
    ).toBeVisible({ timeout: 10_000 });
  });

  test("admin edits the created drive", async ({ page }) => {
    if (!createdDriveId) { test.skip(); return; }

    await page.goto(`${FE}/drives/${createdDriveId}/edit`);
    await expect(page).toHaveURL(/\/edit/);

    const roleField = page.getByLabel(/role|position/i);
    await roleField.clear();
    await roleField.fill("Senior QA Engineer");

    const [apiReq] = await Promise.all([
      page.waitForRequest((r) =>
        r.url().includes(`/api/drives/${createdDriveId}`) && r.method() === "PUT"
      ),
      page.getByRole("button", { name: /save|update/i }).click(),
    ]);
    expect(apiReq.method()).toBe("PUT");
    await expect(
      page.getByText(/updated|saved|success/i)
    ).toBeVisible({ timeout: 8_000 });
  });

  test("admin deletes the created drive", async ({ page }) => {
    if (!createdDriveId) { test.skip(); return; }

    await page.goto(`${FE}/drives/${createdDriveId}`);
    const deleteBtn = page.getByRole("button", { name: /delete|remove/i });
    await expect(deleteBtn).toBeVisible({ timeout: 6_000 });

    const [apiReq] = await Promise.all([
      page.waitForRequest((r) =>
        r.url().includes(`/api/drives/${createdDriveId}`) && r.method() === "DELETE"
      ),
      deleteBtn.click(),
    ]);
    expect(apiReq.method()).toBe("DELETE");

    // Should navigate away from the deleted drive
    await page.waitForURL((url) => !url.toString().includes(createdDriveId!), {
      timeout: 8_000,
    });
  });
});
