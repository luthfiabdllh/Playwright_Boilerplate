import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { LoginPage } from '../../pages/LoginPage';
import { env } from '../../support/env';
import { FakerHelper } from '../../support/faker.helper';

const { Given, When, Then } = createBdd(test);

// ─── Given ─────────────────────────────────────────────────────

Given('the user opens the login page', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
});

// ─── When ──────────────────────────────────────────────────────

When(
  'the user enters {string} email and {string} password',
  async ({ page }, emailType: string, passwordType: string) => {
    const loginPage = new LoginPage(page);

    const emailMap: Record<string, string> = {
      valid: env.validEmail,
      invalid: env.invalidEmail,
      random: FakerHelper.email(),
    };

    const passwordMap: Record<string, string> = {
      valid: env.validPassword,
      invalid: env.invalidPassword,
      random: FakerHelper.password(),
    };

    // Fallback: if not a keyword, use the value directly
    const email = emailMap[emailType] ?? emailType;
    const password = passwordMap[passwordType] ?? passwordType;

    await loginPage.fillEmail(email);
    await loginPage.fillPassword(password);
  }
);

When('the user clicks the Login button', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.clickLoginButton();
});

When('the user clicks the Login button without filling the form', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.clickLoginButton();
});

// ─── Then ──────────────────────────────────────────────────────

Then('the user is redirected to the dashboard', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.expectRedirectToDashboard();
});

Then('the user sees a login error message', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await expect(loginPage.errorMessage).toBeVisible();
});

Then('the user sees required field validation messages', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.expectValidationErrors();
});
