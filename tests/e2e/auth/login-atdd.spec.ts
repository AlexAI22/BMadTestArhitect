import { test, expect } from '@playwright/test';
import { LoginPage } from '../../support/page-objects/LoginPage.js';

/**
 * ATDD red-phase scaffolds (TEA Workflow 5).
 *
 * These tests encode acceptance criteria for behaviours that are NOT yet
 * validated against the live demo site. They are intentionally skipped
 * (test.skip) so the suite stays green while the assertions remain authored
 * and review-ready — the TDD "write the failing test first" phase.
 *
 * Activation: remove test.skip(...) once the underlying feature/assertion is
 * confirmed against the environment. Tracked in docs/atdd-implementation-checklist.md.
 *
 * Quality standards still apply: network-first, no hard waits, role-based
 * locators, full assertion logic (no placeholders).
 */

const ADMIN_USER = process.env.ADMIN_USER || 'Admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

test.describe('Login — ATDD (red phase)', () => {
  // ATDD: activate when feature is implemented
  // Acceptance criteria (P1): clicking "Forgot your password?" navigates to the
  // password-reset request page, which presents a Username field and a Reset
  // Password button, allowing a user to start account recovery.
  test.skip('forgot password flow leads to the reset page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.clickForgotPassword();

    // Network-first: wait for the reset URL, then assert the reset form is shown.
    await page.waitForURL(/requestPasswordResetCode/);
    await expect(page.getByPlaceholder('Username')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Reset Password' }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Cancel' }),
    ).toBeVisible();
  });

  // ATDD: activate when feature is implemented
  // Acceptance criteria (P1): after logout the OrangeHRM session cookie is no
  // longer present in the browser context, proving the server-side session was
  // invalidated and cannot be replayed.
  test.skip('session cookie is cleared after logout', async ({ page, context }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(ADMIN_USER, ADMIN_PASSWORD);
    await page.waitForURL(/\/dashboard\/index/);

    // Cookie exists while authenticated.
    const cookiesBefore = await context.cookies();
    expect(cookiesBefore.some((c) => c.name === 'orangehrm')).toBe(true);

    // Log out via the user dropdown (role-based, no CSS).
    await page.getByRole('banner').getByRole('img', { name: 'profile picture' }).click();
    await page.getByRole('menuitem', { name: 'Logout' }).click();
    await page.waitForURL(/\/auth\/login/);

    // The authenticated session cookie must be gone (or emptied).
    const cookiesAfter = await context.cookies();
    const sessionCookie = cookiesAfter.find((c) => c.name === 'orangehrm');
    expect(sessionCookie?.value ?? '').toBe('');
  });

  // ATDD: activate when feature is implemented
  // Acceptance criteria (P0): a protected route requested without an active
  // session must redirect the user back to the login page (redirect guard),
  // preventing unauthenticated access to the dashboard.
  test.skip('protected route without auth redirects to login', async ({ page, context }) => {
    // Ensure no session is present.
    await context.clearCookies();

    await page.goto('/web/index.php/dashboard/index');

    // Network-first: the guard should bounce us to the login URL + form.
    await page.waitForURL(/\/auth\/login/);
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });
});
