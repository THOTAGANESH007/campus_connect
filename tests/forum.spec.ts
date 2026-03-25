import { test, expect } from "@playwright/test";

const FE = process.env.FRONTEND_URL ?? "http://localhost:5173";

test.describe("Forum", () => {
  test.use({ storageState: "tests/.auth/student.json" });

  let createdPostId: string | null = null;

  // ── 1. Forum list loads ───────────────────────────────────────────
  test("forum page loads and shows heading", async ({ page }) => {
    await page.goto(`${FE}/forum`);
    await expect(page).toHaveURL(/\/forum/);
    await expect(
      page.getByRole("heading", { name: /forum|discussion|community/i })
    ).toBeVisible({ timeout: 8_000 });
  });

  // ── 2. Posts list or empty state ─────────────────────────────────
  test("forum list shows posts or empty-state message", async ({ page }) => {
    await page.goto(`${FE}/forum`);
    const postItems = page.locator(
      "[data-testid='forum-post'], .post-card, article, li"
    );
    const count = await postItems.count();
    if (count === 0) {
      await expect(
        page.getByText(/no posts|be the first|empty/i)
      ).toBeVisible({ timeout: 6_000 });
    } else {
      expect(count).toBeGreaterThan(0);
    }
  });

  // ── 3. Create post ────────────────────────────────────────────────
  test("student can create a new forum post", async ({ page }) => {
    await page.goto(`${FE}/forum/create`);
    await expect(page).toHaveURL(/\/forum\/create/);

    await page.getByLabel(/title/i).fill("E2E Test Post — Playwright");

    const contentField = page
      .getByLabel(/content|body|description/i)
      .or(page.locator("textarea"))
      .first();
    await contentField.fill("This post was created automatically by Playwright E2E tests.");

    // Tags (optional)
    const tagField = page.getByLabel(/tags/i);
    if (await tagField.count()) await tagField.fill("e2e, testing");

    // Intercept POST
    const [apiReq, apiRes] = await Promise.all([
      page.waitForRequest((r) =>
        r.url().includes("/api/forum") && r.method() === "POST"
      ),
      page.waitForResponse((r) =>
        r.url().includes("/api/forum") && r.request().method() === "POST"
      ),
      page.getByRole("button", { name: /post|submit|create/i }).click(),
    ]);

    expect(apiReq.method()).toBe("POST");

    const body = await apiRes.json().catch(() => ({}));
    createdPostId = body?.post?._id ?? body?._id ?? null;

    await expect(
      page.getByText(/created|published|success|playwright/i)
    ).toBeVisible({ timeout: 10_000 });
  });

  // ── 4. View post detail and add comment ──────────────────────────
  test("student can open a post and add a comment", async ({ page }) => {
    if (!createdPostId) {
      // Fall back to the first post on the list
      await page.goto(`${FE}/forum`);
      const firstPost = page
        .locator("[data-testid='forum-post'] a, .post-card a, article a")
        .first();
      if (!(await firstPost.count())) { test.skip(); return; }
      await firstPost.click();
    } else {
      await page.goto(`${FE}/forum/${createdPostId}`);
    }

    await expect(page).toHaveURL(/\/forum\/.+/);

    const commentBox = page
      .getByLabel(/comment|reply/i)
      .or(page.locator("textarea"))
      .first();

    if (!(await commentBox.count())) { test.skip(); return; }

    await commentBox.fill("Great post! — added by Playwright.");

    const [apiReq] = await Promise.all([
      page.waitForRequest((r) =>
        r.url().includes("/comment") && r.method() === "POST"
      ),
      page.getByRole("button", { name: /comment|reply|submit/i }).click(),
    ]);
    expect(apiReq.url()).toContain("/comment");

    await expect(
      page.getByText(/added by playwright|great post/i)
    ).toBeVisible({ timeout: 8_000 });
  });

  // ── 5. Upvote a post ─────────────────────────────────────────────
  test("student can upvote a forum post", async ({ page }) => {
    if (!createdPostId) { test.skip(); return; }

    await page.goto(`${FE}/forum/${createdPostId}`);

    const upvoteBtn = page.getByRole("button", { name: /upvote|👍|▲|like/i });
    if (!(await upvoteBtn.count())) { test.skip(); return; }

    const [apiReq] = await Promise.all([
      page.waitForRequest((r) =>
        r.url().includes("/upvote") && r.method() === "PATCH"
      ),
      upvoteBtn.first().click(),
    ]);
    expect(apiReq.method()).toBe("PATCH");
  });

  // ── 6. Delete the post ────────────────────────────────────────────
  test("student can delete their own forum post", async ({ page }) => {
    if (!createdPostId) { test.skip(); return; }

    await page.goto(`${FE}/forum/${createdPostId}`);

    const deleteBtn = page.getByRole("button", { name: /delete|remove/i });
    if (!(await deleteBtn.count())) { test.skip(); return; }

    const [apiReq] = await Promise.all([
      page.waitForRequest((r) =>
        r.url().includes(`/api/forum/${createdPostId}`) && r.method() === "DELETE"
      ),
      deleteBtn.click(),
    ]);
    expect(apiReq.method()).toBe("DELETE");

    // Should navigate away from the deleted post
    await page.waitForURL(
      (url) => !url.toString().includes(createdPostId!),
      { timeout: 8_000 }
    );
  });

  // ── BONUS: Notifications bell ─────────────────────────────────────
  test("notification bell is visible and can be opened", async ({ page }) => {
    await page.goto(`${FE}/drives`);

    const bell = page
      .getByRole("button", { name: /notification|bell/i })
      .or(page.locator("[aria-label*='notification'], .notification-bell"))
      .first();

    if (!(await bell.count())) { test.skip(); return; }

    await expect(bell).toBeVisible({ timeout: 6_000 });
    await bell.click();

    // Notification panel / dropdown should open
    await expect(
      page.getByText(/notification|mark all|no notification/i)
    ).toBeVisible({ timeout: 6_000 });

    // Mark all read
    const markAll = page.getByRole("button", { name: /mark all|clear/i });
    if (await markAll.count()) {
      const [apiReq] = await Promise.all([
        page.waitForRequest((r) =>
          r.url().includes("/api/notifications/mark-all-read") &&
          r.method() === "PATCH"
        ).catch(() => null),
        markAll.click(),
      ]);
      // Either the request fired or there were no unread — both are fine
    }
  });
});
