import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('Smoke Tests for Hjulverkstan Portal', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.goto();
  });

  test('should display login form with required fields', async () => {
    await loginPage.verifyLoginFormVisible();
  });

  test('should show error message with invalid credentials', async () => {
    await loginPage.login('invalid', 'invalid');
    await loginPage.verifyLoginError();
    
    // Verify the full error message is shown after login attempt
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Try again soon or contact your local developer');
  });

  test('should login successfully with valid credentials', async () => {
    await loginPage.login('admin', 'password');
    await dashboardPage.verifyPageLoaded();
  });

  test('should be able to logout', async ({ page }) => {
    // Login first
    await loginPage.login('admin', 'password');
    await dashboardPage.verifyPageLoaded();
    
    // Then logout
    await dashboardPage.logout();
    
    // Verify we're back at login
    await loginPage.verifyPageLoaded();
  });
});