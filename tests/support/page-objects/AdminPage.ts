import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Page Object for the OrangeHRM Admin → System Users page.
 *
 * URL: /web/index.php/admin/viewSystemUsers
 *
 * Selector policy (TEA standard): role-, label- and placeholder-based locators
 * only. No CSS / XPath. Search uses a network-first wait on the System Users API
 * so assertions never race the results grid.
 */
export class AdminPage {
  readonly page: Page;

  readonly pageHeading: Locator;
  readonly addButton: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly usernameFilter: Locator;
  readonly recordsFound: Locator;
  readonly noRecords: Locator;
  readonly resultsTable: Locator;

  /** Matches the System Users list API call (used for network-first waits). */
  private static readonly USERS_API = /\/api\/v2\/admin\/users(\?|$)/;

  constructor(page: Page) {
    this.page = page;

    this.pageHeading = page.getByRole('heading', { name: 'System Users' });
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });

    // The Username filter has no accessible name (OrangeHRM does not associate
    // its labels with inputs). Textbox order on this page is:
    //   0 = sidebar menu "Search"  ·  1 = Username filter  ·  2 = Employee Name.
    // So the Username filter is the second textbox, and the Employee Name field
    // (placeholder "Type for hints...") is excluded by construction.
    this.usernameFilter = page.getByRole('textbox').nth(1);

    // Results summary, e.g. "(53) Records Found".
    // "No Records Found" renders in two elements; scope to the first to avoid a
    // strict-mode multi-match. The records summary is the count-bearing element.
    this.recordsFound = page.getByText(/\(\d+\) Record(s)? Found/);
    this.noRecords = page.getByText('No Records Found').first();

    this.resultsTable = page.getByRole('table');
  }

  /** Navigate directly to the System Users page and wait for it to render. */
  async goto(): Promise<void> {
    await this.page.goto('/web/index.php/admin/viewSystemUsers');
    await expect(this.pageHeading).toBeVisible();
    await expect(this.resultsTable).toBeVisible();
  }

  /**
   * Filter by username and submit. Network-first: wait for the System Users API
   * response triggered by the search before returning.
   */
  async searchByUsername(username: string): Promise<void> {
    await this.usernameFilter.fill(username);
    await Promise.all([
      this.page.waitForResponse(
        (res) => AdminPage.USERS_API.test(res.url()) && res.request().method() === 'GET',
      ),
      this.searchButton.click(),
    ]);
  }

  /** Reset the search filters. Network-first: wait for the reloaded list. */
  async resetFilters(): Promise<void> {
    await Promise.all([
      this.page.waitForResponse(
        (res) => AdminPage.USERS_API.test(res.url()) && res.request().method() === 'GET',
      ),
      this.resetButton.click(),
    ]);
  }

  /** Click "Add" and wait for the Add User form URL. */
  async clickAdd(): Promise<void> {
    await this.addButton.click();
    await this.page.waitForURL(/admin\/saveSystemUser/);
  }

  /** Parse the "(N) Records Found" summary into a number. Returns 0 if none. */
  async getRecordsCount(): Promise<number> {
    if (await this.noRecords.isVisible()) {
      return 0;
    }
    const text = (await this.recordsFound.textContent())?.trim() ?? '';
    const match = text.match(/\((\d+)\)/);
    return match?.[1] ? Number(match[1]) : 0;
  }

  /**
   * A results-grid match by visible text, scoped to the table. Uses `.first()`
   * because a value (e.g. "Admin") can appear in more than one column.
   */
  cell(text: string): Locator {
    return this.resultsTable.getByText(text, { exact: true }).first();
  }

  /**
   * A results-grid column header by its visible name (role-based). Page-scoped
   * because OrangeHRM renders the header row outside the role="table" element.
   */
  columnHeader(name: string): Locator {
    return this.page.getByRole('columnheader', { name });
  }
}
