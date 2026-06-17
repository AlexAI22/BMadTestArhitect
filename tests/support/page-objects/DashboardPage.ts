import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Page Object for the OrangeHRM dashboard (post-login landing page).
 *
 * URL: /web/index.php/dashboard/index
 *
 * Selector policy (TEA standard): role-, label- and placeholder-based locators
 * only. No CSS / XPath.
 */
export class DashboardPage {
  readonly page: Page;

  readonly welcomeMessage: Locator;
  readonly userDropdownButton: Locator;
  readonly logoutMenuItem: Locator;
  readonly quickLaunchPanel: Locator;
  readonly mainMenu: Locator;

  constructor(page: Page) {
    this.page = page;

    // "Dashboard" heading rendered in the top bar once the page is loaded.
    this.welcomeMessage = page.getByRole('heading', { name: 'Dashboard' });

    // User profile dropdown trigger in the top-right corner. Targeted via the
    // profile picture's accessible role (no CSS) — clicking it opens the menu.
    this.userDropdownButton = page.getByRole('banner').getByRole('img', {
      name: 'profile picture',
    });

    this.logoutMenuItem = page.getByRole('menuitem', { name: 'Logout' });

    // "Quick Launch" widget on the dashboard body.
    this.quickLaunchPanel = page.getByText('Quick Launch');

    // Left-hand navigation rail.
    this.mainMenu = page.getByRole('navigation');
  }

  /** True once the dashboard heading is rendered. */
  async isLoaded(): Promise<boolean> {
    await this.page.waitForURL(/\/dashboard\/index/);
    return this.welcomeMessage.isVisible();
  }

  /** Returns the dashboard heading text (e.g. "Dashboard"). */
  async getWelcomeText(): Promise<string> {
    await expect(this.welcomeMessage).toBeVisible();
    return (await this.welcomeMessage.textContent())?.trim() ?? '';
  }

  /** Returns a navigation menu item locator by its visible name. */
  navItem(name: string): Locator {
    return this.mainMenu.getByRole('link', { name });
  }

  /**
   * Open the user dropdown and click Logout. Network-first: the caller asserts
   * on the resulting login URL rather than waiting on a timer.
   */
  async logout(): Promise<void> {
    await this.userDropdownButton.click();
    await expect(this.logoutMenuItem).toBeVisible();
    await this.logoutMenuItem.click();
    await this.page.waitForURL(/\/auth\/login/);
  }
}
