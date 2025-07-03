import { Page, expect } from '@playwright/test';

export class LoginPage {
  private readonly baseUrl: string;

  constructor(private page: Page) {
    // Default to development URL if environment variable is not set
    this.baseUrl = process.env.VITE_FRONTEND_URL || 'https://dev.hjulverkstan.org';
    // Ensure baseUrl ends with a slash for proper URL joining
    if (!this.baseUrl.endsWith('/')) {
      this.baseUrl += '/';
    }
  }

  // Locators
  private readonly heading = this.page.getByRole('heading', { name: 'Login to Hjulverkstan Portal' });
  private readonly usernameInput = this.page.getByRole('textbox', { name: 'username' });
  private readonly passwordInput = this.page.getByRole('textbox', { name: 'password' });
  private readonly loginButton = this.page.getByRole('button', { name: 'Login' });
  private readonly submitButton = this.page.locator('#submit');
  private readonly errorNotification = this.page.locator('[role="status"]', { hasText: 'Failed to log in' }).first();

  // Actions
  async goto() {
    // Remove any leading slash from the path to avoid double slashes
    const path = 'sv/portal'.replace(/^\/+/, '');
    const fullUrl = `${this.baseUrl}${path}`;
    await this.page.goto(fullUrl);
    await this.verifyPageLoaded();
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async verifyPageLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.page.getByRole('heading')).toContainText('Login to Hjulverkstan Portal');
  }

  async verifyLoginFormVisible() {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
    await expect(this.submitButton).toContainText('Login');
  }

  async verifyLoginError() {
    await expect(this.errorNotification).toBeVisible();
    await expect(this.errorNotification).toContainText('Failed to log in the user');
  }

  async getErrorMessage(): Promise<string> {
    await this.errorNotification.waitFor({ state: 'visible' });
    return await this.errorNotification.textContent() || '';
  }
}
