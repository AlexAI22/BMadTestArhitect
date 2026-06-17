import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Page Object for the OrangeHRM login screen.
 *
 * URL: /web/index.php/auth/login
 *
 * Selector policy (TEA standard): role-, label- and placeholder-based locators
 * only. No CSS / XPath. All interactions go through this object so specs stay
 * declarative and resilient to markup changes.
 */
export class LoginPage {
  readonly page: Page;

  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;

  // Per-field "Required" validation message shown beneath an empty input.
  readonly requiredFieldErrors: Locator;

  constructor(page: Page) {
    this.page = page;

    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });

    // Top-of-form alert, e.g. "Invalid credentials".
    this.errorMessage = page.getByRole('alert');

    this.forgotPasswordLink = page.getByText('Forgot your password?');

    this.requiredFieldErrors = page.getByText('Required');
  }

  /** Navigate to the login page and wait for the form to be interactive. */
  async goto(): Promise<void> {
    await this.page.goto('/web/index.php/auth/login');
    await expect(this.usernameInput).toBeVisible();
  }

  /**
   * Fill credentials and submit. Network-first: the caller asserts on the
   * resulting URL / dashboard state rather than waiting on a timer.
   */
  async login(user: string, pass: string): Promise<void> {
    await this.usernameInput.fill(user);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
  }

  /** Returns the visible top-of-form error text (e.g. "Invalid credentials"). */
  async getErrorMessage(): Promise<string> {
    await expect(this.errorMessage).toBeVisible();
    return (await this.errorMessage.textContent())?.trim() ?? '';
  }

  /** True when the top-of-form error alert is displayed. */
  async isErrorVisible(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }

  /** Click the "Forgot your password?" recovery link. */
  async clickForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }
}
