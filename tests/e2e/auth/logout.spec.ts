import { test, expect } from '../../fixtures/auth.fixture.js';
import { DashboardPage } from '../../support/page-objects/DashboardPage.js';

/**
 * Logout feature — P0 coverage (TEA Workflow 6: Automate).
 *
 * Uses the `authenticatedPage` fixture so the test starts already logged in
 * and isolated per worker. Network-first: logout() waits for the login URL.
 */

test.describe('Logout', () => {
  // @smoke P0 — Session security: logging out must return to the login page.
  test('logout redirects to the login page @smoke', async ({ authenticatedPage }) => {
    const dashboardPage = new DashboardPage(authenticatedPage);

    await dashboardPage.logout();

    await expect(authenticatedPage).toHaveURL(/\/auth\/login/);
    const loginButton = authenticatedPage.getByRole('button', { name: 'Login' });
    await expect(
      loginButton,
      'The Login button should be visible again after logout',
    ).toBeVisible();
  });
});
