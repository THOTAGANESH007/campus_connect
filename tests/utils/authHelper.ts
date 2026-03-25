import { Page, request } from "@playwright/test";

const API = process.env.BACKEND_URL ?? "http://localhost:7777";
const FE  = process.env.FRONTEND_URL ?? "http://localhost:5173";

export const STUDENT = {
  name: "Test Student",
  email: "student_e2e@test.com",
  password: "Password123!",
  role: "STUDENT",
  rollNumber: "22CS001",
  branch: "CSE",
  year: 3,
};

export const ADMIN = {
  name: "Test Admin",
  email: "admin_e2e@test.com",
  password: "Password123!",
  role: "ADMIN",
};

/**
 * Login via the UI and wait for navigation.
 */
export async function loginViaUI(
  page: Page,
  email: string,
  password: string
) {
  await page.goto(`${FE}/signin`);
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /sign in|login/i }).click();
  // Wait until we leave the signin page
  await page.waitForURL((url) => !url.toString().includes("/signin"), {
    timeout: 10_000,
  });
}

/**
 * Register a user via the API (no UI needed).
 * Silently ignores 409 / duplicate errors.
 */
export async function registerViaAPI(user: typeof STUDENT | typeof ADMIN) {
  const ctx = await request.newContext();
  try {
    await ctx.post(`${API}/api/auth/signup`, { data: user });
  } catch {
    // likely already registered — fine
  } finally {
    await ctx.dispose();
  }
}

/**
 * Login via the API, then inject the cookie into the browser context.
 * This is faster than loginViaUI for fixture setup.
 */
export async function loginViaAPI(
  page: Page,
  email: string,
  password: string
) {
  const ctx = await request.newContext({ baseURL: API });
  const res  = await ctx.post("/api/auth/signin", {
    data: { email, password },
  });
  const cookies = res.headers()["set-cookie"];
  await ctx.dispose();

  if (cookies) {
    // Parse the jwt cookie and inject it into the browser context
    const cookieParts = cookies.split(";")[0].split("=");
    const name  = cookieParts[0].trim();
    const value = cookieParts.slice(1).join("=").trim();
    await page.context().addCookies([
      {
        name,
        value,
        domain: "localhost",
        path: "/",
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
      },
    ]);
  }
}
