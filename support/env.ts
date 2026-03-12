import 'dotenv/config';

/**
 * Centralized environment variables loader.
 * All env variable access should go through this file.
 */
export const env = {
  // URLs
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',

  // Valid credentials
  validEmail: process.env.VALID_EMAIL || '',
  validPassword: process.env.VALID_PASSWORD || '',

  // Invalid credentials
  invalidEmail: process.env.INVALID_EMAIL || 'wrong@example.com',
  invalidPassword: process.env.INVALID_PASSWORD || 'wrongpassword',

  // Timeouts
  defaultTimeout: Number(process.env.DEFAULT_TIMEOUT) || 30000,

  // CI flag
  isCI: !!process.env.CI,
};

/**
 * Validate that required environment variables are set.
 * Call this at the start of a test suite if needed.
 */
export function validateEnv() {
  const required: (keyof typeof env)[] = ['validEmail', 'validPassword'];
  const missing = required.filter((key) => !env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
        `Make sure the .env file is configured. See .env.example as a reference.`
    );
  }
}
