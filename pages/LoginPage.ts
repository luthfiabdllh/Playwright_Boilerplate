import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Login page.
 * Encapsulates all UI interactions and elements on the login page.
 */
export class LoginPage {
  readonly page: Page;

  // Locators
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;

  constructor(page: Page) {
    this.page = page;

    // Use semantic locators (role, label, testid) instead of CSS/XPath
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: /login|sign in/i });
    this.errorMessage = page.getByTestId('login-error');
    this.emailError = page.getByTestId('email-error');
    this.passwordError = page.getByTestId('password-error');
  }

  /**
   * Navigate to the login page
   */
  async goto() {
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Fill the email field
   */
  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  /**
   * Fill the password field
   */
  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  /**
   * Click the login button
   */
  async clickLoginButton() {
    await this.loginButton.click();
  }

  /**
   * Perform a full login action
   */
  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }

  /**
   * Assert that the user is redirected to the dashboard after login
   */
  async expectRedirectToDashboard() {
    await expect(this.page).toHaveURL(/dashboard|home/i);
  }

  /**
   * Assert that the login error message is visible
   */
  async expectErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
  }

  /**
   * Assert that required field validation messages are visible
   */
  async expectValidationErrors() {
    await expect(this.emailError.or(this.passwordError)).toBeVisible();
  }
}
