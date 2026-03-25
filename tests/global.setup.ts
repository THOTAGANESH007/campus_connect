/**
 * global.setup.ts
 *
 * Runs ONCE before all test suites.
 * 1. Registers the student and admin test accounts (idempotent).
 * 2. Logs each in and saves storageState (cookies) to disk so
 *    every subsequent spec can reuse a fully-authenticated context.
 */

import { test as setup, expect } from "@playwright/test";
import path from "path";
import {
  STUDENT,
  ADMIN,
  registerViaAPI,
  loginViaUI,
} from "./utils/authHelper";

const STUDENT_FILE = path.join(__dirname, ".auth/student.json");
const ADMIN_FILE   = path.join(__dirname, ".auth/admin.json");

setup("create student auth state", async ({ page }) => {
  await registerViaAPI(STUDENT);
  await loginViaUI(page, STUDENT.email, STUDENT.password);
  await page.context().storageState({ path: STUDENT_FILE });
});

setup("create admin auth state", async ({ page }) => {
  await registerViaAPI(ADMIN);
  await loginViaUI(page, ADMIN.email, ADMIN.password);
  await page.context().storageState({ path: ADMIN_FILE });
});
