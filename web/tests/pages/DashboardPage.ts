import { Page, expect } from '@playwright/test';

export class DashboardPage {
  constructor(private page: Page) {}

  // Locators
  private readonly heading = this.page.getByRole('heading', { name: 'Hjulverkstan Shop' });
  private readonly addVehicleButton = this.page.getByRole('button', { name: 'Add vehicle' });
  private readonly userMenuButton = this.page.getByRole('button', { name: 'A', exact: true });
  private readonly logoutButton = this.page.getByRole('menuitem', { name: 'Log out' });
  private readonly userMenuLabel = this.page.getByLabel('A', { exact: true });

  // Actions
  async verifyPageLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.page.getByRole('heading')).toContainText('Hjulverkstan Shop');
    await expect(this.page.getByText('TypeStatusLocationTicketDetails')).toBeVisible();
    await expect(this.addVehicleButton).toBeVisible();
    await expect(this.userMenuButton).toBeVisible();
    await expect(this.page.locator('#app')).toContainText('Add vehicle');
  }

  async logout() {
    await this.userMenuButton.click();
    await expect(this.logoutButton).toBeVisible();
    await expect(this.userMenuLabel).toContainText('Log out');
    await this.logoutButton.click();
  }
}
