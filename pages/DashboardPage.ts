import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Dashboard page.
 */
export class DashboardPage {
  readonly page: Page;

  // Locators
  readonly heading: Locator;
  readonly userMenu: Locator;
  readonly logoutButton: Locator;
  readonly sidebar: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole('heading', { level: 1 });
    this.userMenu = page.getByTestId('user-menu');
    this.logoutButton = page.getByRole('button', { name: /logout|sign out/i });
    this.sidebar = page.getByRole('navigation', { name: 'sidebar' });
  }

  /**
   * Navigate to the dashboard page
   */
  async goto() {
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Assert that the dashboard page is visible
   */
  async expectDashboardVisible() {
    await expect(this.page).toHaveURL(/dashboard/i);
    await expect(this.sidebar).toBeVisible();
  }

  /**
   * Open the user menu (avatar/name)
   */
  async openUserMenu() {
    await this.userMenu.click();
  }

  /**
   * Log out of the application
   */
  async logout() {
    await this.openUserMenu();
    await this.logoutButton.click();
  }
}
