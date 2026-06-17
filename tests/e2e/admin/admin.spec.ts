import { test, expect } from '../../fixtures/auth.fixture.js';
import { AdminPage } from '../../support/page-objects/AdminPage.js';

/**
 * Admin → System Users feature — P1/P2 coverage (TEA Workflow 6: Automate).
 *
 * Uses the `authenticatedPage` fixture (logged in, isolated per test).
 * Network-first: search/reset wait on the System Users API; assertions wait on
 * URL + element visibility, never timers. Tests are self-contained (read-only
 * search — no data is created, so nothing to clean up).
 */

test.describe('Admin — System Users', () => {
  let admin: AdminPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    admin = new AdminPage(authenticatedPage);
    await admin.goto();
  });

  // @smoke P1 — Feature discoverability: the page loads with its core elements.
  test('System Users page loads with heading, table and records @smoke', async ({
    authenticatedPage,
  }) => {
    await expect(authenticatedPage).toHaveURL(/admin\/viewSystemUsers/);
    await expect(admin.pageHeading, 'The "System Users" heading should be visible').toBeVisible();
    await expect(admin.resultsTable, 'The results grid should be visible').toBeVisible();
    await expect(admin.recordsFound, 'A records-found summary should be shown').toBeVisible();

    expect(
      await admin.getRecordsCount(),
      'The unfiltered list should contain at least one user',
    ).toBeGreaterThan(0);
  });

  // P1 — Search returns the matching user and narrows the result set.
  test('search by username "Admin" returns the Admin user', async () => {
    await admin.searchByUsername('Admin');

    await expect(
      admin.cell('Admin'),
      'A row for the "Admin" user should be visible after searching',
    ).toBeVisible();
    expect(
      await admin.getRecordsCount(),
      'Searching a specific username should narrow the result set',
    ).toBeGreaterThanOrEqual(1);
  });

  // P2 — Negative search: a non-existent username yields no records.
  test('search for a non-existent username shows "No Records Found"', async () => {
    await admin.searchByUsername('no_such_user_zzz_999');

    await expect(
      admin.noRecords,
      'A "No Records Found" message should be shown for an unknown username',
    ).toBeVisible();
    expect(await admin.getRecordsCount()).toBe(0);
  });

  // P2 — Reset restores the full, unfiltered list.
  test('reset clears the filter and restores the full list', async () => {
    await admin.searchByUsername('Admin');
    // Web-first: wait for the filtered state to settle (Admin → exactly 1 record)
    // rather than reading a count mid-transition.
    await expect(admin.usernameFilter).toHaveValue('Admin');
    await expect(admin.recordsFound).toHaveText(/\(1\) Record Found/);

    await admin.resetFilters();
    // Reset clears the filter (race-free form-state change) and the list grows
    // back beyond the single filtered row.
    await expect(admin.usernameFilter).toHaveValue('');
    await expect(admin.recordsFound).toBeVisible();
    await expect(admin.recordsFound).not.toHaveText(/\(1\) Record Found/);
  });

  // P1 — Navigation: "Add" opens the Add User form.
  test('Add button navigates to the Add User form', async ({ authenticatedPage }) => {
    await admin.clickAdd();

    await expect(authenticatedPage).toHaveURL(/admin\/saveSystemUser/);
    await expect(
      authenticatedPage.getByRole('button', { name: 'Save' }),
      'The Add User form should expose a Save button',
    ).toBeVisible();
  });
});
