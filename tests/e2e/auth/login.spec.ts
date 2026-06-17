import { test, expect } from '@playwright/test';
import { LoginPage } from '../../support/page-objects/LoginPage.js';
import { DashboardPage } from '../../support/page-objects/DashboardPage.js';

/**
 * Login feature — P0/P1 coverage (TEA Workflow 6: Automate).
 *
 * Selector policy: role / label / placeholder only (via Page Objects).
 * Network-first: assertions wait on URL + element visibility, never timers.
 * Each test is self-contained: it navigates to a fresh login page.
 */

const ADMIN_USER = process.env.ADMIN_USER || 'Admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  // @smoke P0 — Critical path / system entry point.
  test('valid credentials land on the dashboard @smoke', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await loginPage.login(ADMIN_USER, ADMIN_PASSWORD);

    await page.waitForURL(/\/dashboard\/index/);
    await expect(
      dashboardPage.welcomeMessage,
      'Dashboard heading should be visible after a successful login',
    ).toBeVisible();
  });

  // P0 — Security gate: bad credentials must be rejected.
  test('invalid credentials show "Invalid credentials" error', async () => {
    await loginPage.login('WrongUser', 'WrongPass123');

    await expect(
      loginPage.errorMessage,
      'An error alert should appear for invalid credentials',
    ).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Invalid credentials');
  });

  // P0 — Input validation: empty username must be blocked client-side.
  test('empty username triggers required-field validation', async () => {
    await loginPage.usernameInput.fill('');
    await loginPage.passwordInput.fill(ADMIN_PASSWORD);
    await loginPage.loginButton.click();

    await expect(
      loginPage.requiredFieldErrors.first(),
      'A "Required" validation message should be shown for the empty username',
    ).toBeVisible();
  });

  // P0 — Input validation: empty password must be blocked client-side.
  test('empty password triggers required-field validation', async () => {
    await loginPage.usernameInput.fill(ADMIN_USER);
    await loginPage.passwordInput.fill('');
    await loginPage.loginButton.click();

    await expect(
      loginPage.requiredFieldErrors.first(),
      'A "Required" validation message should be shown for the empty password',
    ).toBeVisible();
  });

  // P1 — Common failure mode: correct user, wrong password.
  test('correct user with wrong password shows error', async () => {
    await loginPage.login(ADMIN_USER, 'definitely-wrong-password');

    await expect(
      loginPage.errorMessage,
      'An error alert should appear when the password is wrong',
    ).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Invalid credentials');
  });

  // P1 — Recovery path: Forgot Password navigates to the reset request page.
  test('Forgot Password link navigates to the reset request page', async ({ page }) => {
    await loginPage.clickForgotPassword();

    await page.waitForURL(/requestPasswordResetCode/);
    await expect(page).toHaveURL(/requestPasswordResetCode/);
  });
});
