import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Get the current directory in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

// Get the base URL from environment variables
const baseURL = process.env.VITE_FRONTEND_URL;

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 2, // Will retry failed tests 2 times
  workers: process.env.CI ? 4 : undefined,
  reporter: [
    ['html', { 
      outputFolder: 'playwright-report',
      open: 'never',
      host: '0.0.0.0',
      port: 9323,
    }],
    ['list'],
    ['junit', { outputFile: 'test-results/junit/results.xml' }]
  ],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10 * 1000,
    navigationTimeout: 30 * 1000,
  },
  projects: [
    {
      name: 'smoke',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
      testMatch: '**/*.test.ts',
    }
  ],
  outputDir: 'test-results/artifacts',
  preserveOutput: 'failures-only',
});
