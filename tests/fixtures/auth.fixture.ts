import { test as base, expect, type Page } from '@playwright/test';
import { LoginPage } from '../support/page-objects/LoginPage.js';
import { DashboardPage } from '../support/page-objects/DashboardPage.js';

// `||` (not `??`): unset CI secrets render as empty strings, so fall back to the
// public demo credentials when the env var is empty.
const ADMIN_USER = process.env.ADMIN_USER || 'Admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

/**
 * Custom fixtures for the OrangeHRM TEA demo.
 *
 * `authenticatedPage` logs in as Admin inside its own isolated context and lands
 * the test on the dashboard. Each test receives a fresh, independently-valid
 * session — this is intentional: the OrangeHRM demo invalidates / expires server
 * sessions over the life of a run, so reusing one long-lived saved session
 * (storageState) across many tests is unreliable. Logging in per test keeps the
 * fixture self-contained, parallel-safe, and resilient on the shared demo host.
 *
 * Usage:
 *   import { test, expect } from '../../fixtures/auth.fixture';
 *   test('...', async ({ authenticatedPage }) => { ... });
 */

type AuthFixtures = {
  /** A page that is already logged in as Admin and sitting on the dashboard. */
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Network-first: wait for the dashboard URL + heading to confirm the session.
    await loginPage.goto();
    await loginPage.login(ADMIN_USER, ADMIN_PASSWORD);
    await page.waitForURL(/\/dashboard\/index/);
    await expect(dashboardPage.welcomeMessage).toBeVisible();

    await use(page);

    await context.close();
  },
});

export { expect };
