# 🎭 Netmonk — Playwright E2E Testing

Proyek ini berisi automated end-to-end tests untuk aplikasi **Netmonk Portal**, menggunakan stack modern:

- **[Playwright](https://playwright.dev/)** — framework utama E2E testing
- **[playwright-bdd](https://github.com/vitalets/playwright-bdd)** — BDD dengan Gherkin/Cucumber
- **[@faker-js/faker](https://fakerjs.dev/)** — generate data palsu (fake data) dinamis
- **[dotenv](https://github.com/motdotla/dotenv)** — manajemen environment variables

---

## 📁 Struktur Proyek

```
Netmonk/
├── features/               # Skenario BDD (Gherkin .feature files)
│   └── auth/
│       └── login.feature
├── pages/                  # Page Object Models (POM)
│   ├── LoginPage.ts
│   └── DashboardPage.ts
├── steps/                  # Step definitions (implementasi Gherkin)
│   └── auth/
│       └── login.steps.ts
├── fixtures/               # Custom Playwright fixtures
│   └── index.ts
├── support/                # Helper & utilities
│   ├── env.ts              # Centralized env variable loader
│   └── faker.helper.ts     # Faker.js utilities
├── .features-gen/          # [Auto-generated] Jangan diedit manual
├── .env                    # Environment variables lokal (tidak di-commit)
├── .env.example            # Template env untuk tim
├── playwright.config.ts    # Konfigurasi Playwright
└── tsconfig.json           # Konfigurasi TypeScript
```

---

## ⚙️ Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Install Playwright browsers

```bash
npx playwright install
```

### 3. Konfigurasi environment variables

Salin `.env.example` menjadi `.env`, lalu sesuaikan nilainya:

```bash
cp .env.example .env
```

```env
BASE_URL=http://localhost:3000
VALID_EMAIL=admin@netmonk.local
VALID_PASSWORD=Password123!
INVALID_EMAIL=wrong@example.com
INVALID_PASSWORD=wrongpassword
DEFAULT_TIMEOUT=30000
```

---

## 🚀 Menjalankan Test

| Command | Deskripsi |
|---|---|
| `npm test` | Generate + jalankan semua test (headless) |
| `npm run test:headed` | Jalankan dengan browser terlihat |
| `npm run test:ui` | Buka Playwright UI mode (visual, direkomendasikan untuk debugging) |
| `npm run test:debug` | Mode debug step-by-step |
| `npm run generate` | Hanya generate spec files dari `.feature` |
| `npm run report` | Buka laporan HTML hasil test terakhir |

---

## 🔄 Alur BDD

```
features/*.feature   →(bddgen)→  .features-gen/*.spec.js  →(playwright)→  steps/*.steps.ts
                                                                                   ↓
                                                                          pages/*.ts (POM)
                                                                                   ↓
                                                                 support/env.ts + faker.helper.ts
```

1. **Tulis skenario** di `features/` dalam format Gherkin
2. **Jalankan `npm run generate`** → playwright-bdd menghasilkan spec files di `.features-gen/`
3. **Step definitions** di `steps/` dieksekusi oleh Playwright
4. **POM** di `pages/` mengenkapsulasi semua interaksi UI

---

## ✍️ Menulis Test Baru

### 1. Buat file `.feature`

```gherkin
# features/dashboard/overview.feature

@dashboard
Feature: Dashboard Overview

  Background:
    Given the user is logged into the application

  @overview
  Scenario: View summary data
    When the user opens the dashboard page
    Then the user sees the network summary widget
```

### 2. Buat Page Object Model

```typescript
// pages/DashboardOverviewPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class DashboardOverviewPage {
  readonly networkWidget: Locator;

  constructor(page: Page) {
    this.networkWidget = page.getByTestId('network-summary-widget');
  }

  async expectWidgetVisible() {
    await expect(this.networkWidget).toBeVisible();
  }
}
```

### 3. Buat step definitions

```typescript
// steps/dashboard/overview.steps.ts
import { createBdd } from 'playwright-bdd';
import { test } from '../../fixtures';

const { Given, When, Then } = createBdd(test);

Given('the user is logged into the application', async ({ authenticatedPage }) => {
  // authenticatedPage is already auto-logged-in via fixture
});
```

### 4. Jalankan test

```bash
npm test
```

---

## 🛠️ Tips & Best Practices

### Locator Priority (gunakan urutan ini)
```typescript
page.getByRole(...)        // ✅ #1 — Accessible role
page.getByLabel(...)       // ✅ #2 — Form label
page.getByTestId(...)      // ✅ #3 — data-testid attribute
page.getByText(...)        // ✅ #4 — Teks terlihat
page.locator('.class')     // ❌ Hindari — fragile
```

### Menggunakan Faker
```typescript
import { FakerHelper } from '../../support/faker.helper';

const user = FakerHelper.user();          // { name, email, password, phone }
const email = FakerHelper.email();        // email acak
const number = FakerHelper.number(1, 99); // angka acak
```

### Menggunakan ENV
```typescript
import { env } from '../../support/env';

env.baseUrl        // BASE_URL dari .env
env.validEmail     // VALID_EMAIL
env.validPassword  // VALID_PASSWORD
```

### Fixture `authenticatedPage`
Gunakan untuk test yang perlu kondisi sudah login:
```typescript
Given('I am on the admin page', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/admin');
});
```

---

## 📊 Laporan Test

Setelah menjalankan test, buka laporan HTML:

```bash
npm run report
```

Laporan tersimpan di folder `playwright-report/` dan berisi:
- ✅ / ❌ Status setiap skenario
- 📸 Screenshot saat test gagal
- 🎥 Video recording saat test gagal
- 🔍 Trace viewer untuk debugging

---

## 🗂️ Konvensi Penamaan

| Tipe | Konvensi | Contoh |
|---|---|---|
| Feature file | `<modul>.feature` | `login.feature` |
| Page Object | `<Nama>Page.ts` | `LoginPage.ts` |
| Step definitions | `<nama>.steps.ts` | `login.steps.ts` |
| Tag BDD | `@<tag>` | `@auth`, `@login-sukses` |
