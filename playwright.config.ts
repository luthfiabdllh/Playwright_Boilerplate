import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables dari file .env
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Konfigurasi playwright-bdd
const testDir = defineBddConfig({
  // Lokasi file .feature (Gherkin)
  features: './features/**/*.feature',
  // Lokasi step definitions + fixtures (disertakan bersama steps di v8)
  steps: [
    './steps/**/*.steps.ts',
    './fixtures/index.ts',
  ],
});

export default defineConfig({
  // Direktori output hasil generate dari bddgen
  testDir,

  fullyParallel: false, // Set false agar BDD tidak race condition
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],

  use: {
    // Base URL dari environment variable
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // Screenshot saat test gagal
    screenshot: 'only-on-failure',

    // Video saat test gagal
    video: 'retain-on-failure',

    // Trace untuk debugging (aktif saat retry)
    trace: 'on-first-retry',

    // Timeout default
    actionTimeout: Number(process.env.DEFAULT_TIMEOUT) || 30_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Tambahkan browser lain jika diperlukan:
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
