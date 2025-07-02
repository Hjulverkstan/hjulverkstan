import { Page, ConsoleMessage, TestType } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

// Constants
export const TEST_TIMEOUT = 30 * 1000; // 30 seconds
export const NAVIGATION_TIMEOUT = 15 * 1000; // 15 seconds
export const ELEMENT_TIMEOUT = 10 * 1000; // 10 seconds

// Get the current directory in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ignoredErrors = [
  /401 \(Unauthorized\)/,
  /400 \(Bad Request\)/
];

// Types§
export type TestFixtures = {
  page: Page;
  consoleErrors: string[];
};

/**
 * Helper function to wait for all network requests to complete
 */
export async function waitForNetworkIdle(page: Page, timeout = 5000): Promise<void> {
  await Promise.all([
    page.waitForLoadState('networkidle'),
    page.waitForTimeout(timeout).catch(() => {}),
  ]);
}

/**
 * Helper function to check for console errors
 */
export function setupConsoleErrorCollector(page: Page): string[] {
  const errors: string[] = [];
  
  const handleConsole = (msg: ConsoleMessage) => {
    const text = `[${msg.type()}] ${msg.text()}`;
    
    // Skip ignored errors
    if (ignoredErrors.some(pattern => pattern.test(text))) {
      return;
    }
    
    // Only collect error messages
    if (msg.type() === 'error') {
      errors.push(text);
    }
  };
  
  page.on('console', handleConsole);
  return errors;
}

/**
 * Parse environment variable that can be either JSON array or comma-separated string
 */
export function parseEnvArray(envVar: string | undefined): string[] {
  if (!envVar) return [];
  try {
    return JSON.parse(envVar);
  } catch (e) {
    return envVar.split(',').map(item => item.trim().replace(/^['"]|['"]$/g, ''));
  }
}

/**
 * Take a screenshot with a timestamped filename
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
  try {
    await page.screenshot({ 
      path: `test-results/${name}-${new Date().toISOString().replace(/[:.]/g, '-')}.png`,
      fullPage: true 
    });
  } catch (error) {
    console.warn(`Failed to take screenshot: ${error}`);
  }
}

/**
 * Create a test fixture with common configurations
 */
export function createTestFixture(test: TestType<TestFixtures, TestFixtures>) {
  // Create a new test with retry configuration
  const testWithRetry = test;
  
  // Set retry configuration
  testWithRetry.describe.configure({ retries: 2 });
  
  return testWithRetry.extend<TestFixtures>({
    // Create page first
    page: async ({ }, use, testInfo) => {
      // Import chromium directly
      const { chromium } = await import('@playwright/test');
      const browser = await chromium.launch();
      const context = await browser.newContext();
      const page = await context.newPage();
      
      // Set default timeouts
      page.setDefaultNavigationTimeout(NAVIGATION_TIMEOUT);
      page.setDefaultTimeout(ELEMENT_TIMEOUT);
      
      // Clear storage
      await context.clearCookies();
      
      try {
        // Clear storage using Playwright's storage state
        await context.addInitScript(() => {
          window.sessionStorage?.clear();
          window.localStorage?.clear();
        });
        
        // Navigate to about:blank to ensure we're in a clean state
        await page.goto('about:blank');
      } catch (error) {
        console.warn('Could not clear storage:', error.message);
      }
      
      // Mark tests as slow to get more timeout
      test.slow();
      
      try {
        await use(page);
      } finally {
        await context.close();
        await browser.close();
      }
    },
    
    // Then create consoleErrors that uses the page
    consoleErrors: async ({ page }, use) => {
      const errors: string[] = [];
      
      const handleConsole = (msg: ConsoleMessage) => {
        const text = `[${msg.type()}] ${msg.text()}`;
        
        // Skip ignored errors
        if (ignoredErrors.some(pattern => pattern.test(text))) {
          return;
        }
        
        // Only collect error messages
        if (msg.type() === 'error') {
          console.log('Test console error:', text);
          errors.push(text);
        }
      };
      
      page.on('console', handleConsole);
      
      try {
        await use(errors);
      } finally {
        page.off('console', handleConsole);
      }
    },
  });
}

/**
 * Get the base URL from environment variables
 */
export function getBaseUrl(): string {
  const envPath = path.resolve(__dirname, '../../.env');
  dotenv.config({ path: envPath });
  return process.env.VITE_FRONTEND_URL || 'http://localhost:3000';
}
