import { test as base } from 'playwright-bdd';
import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { env } from '../support/env';

/**
 * Type definitions for custom fixtures available in all tests.
 */
export type AppFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  authenticatedPage: Page;
};

/**
 * Extended test with all custom fixtures.
 * NOTE: In playwright-bdd v8, this must extend from 'playwright-bdd', not '@playwright/test'.
 *
 * Import this `test` in step definitions and spec files.
 */
export const test = base.extend<AppFixtures>({
  /**
   * Fixture: ready-to-use LoginPage instance
   */
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  /**
   * Fixture: ready-to-use DashboardPage instance
   */
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  /**
   * Fixture: an already-authenticated page (auto-login).
   * Use this fixture for tests that require a logged-in state.
   *
   * @example
   * Given('I am on the admin page', async ({ authenticatedPage }) => {
   *   await authenticatedPage.goto('/admin');
   * });
   */
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(env.validEmail, env.validPassword);
    await loginPage.expectRedirectToDashboard();
    await use(page);
  },
});

export { expect } from '@playwright/test';
