import { test, expect } from '../../fixtures/auth.fixture.js';
import { DashboardPage } from '../../support/page-objects/DashboardPage.js';

/**
 * Dashboard feature — P0/P1 coverage (TEA Workflow 6: Automate).
 *
 * Uses the `authenticatedPage` fixture (already logged in, isolated per worker).
 * Network-first: assertions wait on URL + element visibility, never timers.
 */

test.describe('Dashboard', () => {
  // @smoke P0 — Core post-login state: dashboard loads with the correct title.
  test('dashboard loads with the correct title after login @smoke', async ({
    authenticatedPage,
  }) => {
    const dashboardPage = new DashboardPage(authenticatedPage);

    await expect(authenticatedPage).toHaveURL(/\/dashboard\/index/);
    await expect(authenticatedPage).toHaveTitle(/OrangeHRM/);
    await expect(
      dashboardPage.welcomeMessage,
      'The "Dashboard" heading should be visible',
    ).toBeVisible();
    expect(await dashboardPage.getWelcomeText()).toBe('Dashboard');
  });

  // P1 — Feature discoverability: the full primary navigation is present.
  // List verified against the live site (probe-live, 2026-06): 12 modules.
  test('primary navigation menu items are visible', async ({ authenticatedPage }) => {
    const dashboardPage = new DashboardPage(authenticatedPage);

    const expectedItems = [
      'Admin',
      'PIM',
      'Leave',
      'Time',
      'Recruitment',
      'My Info',
      'Performance',
      'Dashboard',
      'Directory',
      'Maintenance',
      'Claim',
      'Buzz',
    ];

    for (const item of expectedItems) {
      await expect(
        dashboardPage.navItem(item),
        `Navigation item "${item}" should be visible in the side menu`,
      ).toBeVisible();
    }
  });
});
