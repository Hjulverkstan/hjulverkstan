// web/tests/US-0-Smoke.spec.ts
// Simulates a user ("Lasse") logging into the Hjulverkstan Portal
// and verifies what they see immediately after.

import { test, expect } from '@playwright/test';

test.describe('Portal login', () => {
  // Lasse sits down to open up the Portal, enters valid credentials, and
  // should successfully land inside the Portal with no error shown.
  test('valid credentials log the user into the Portal', async ({ page }) => {
    await test.step('Navigate to the Portal login page', async () => {
      await page.goto('http://localhost:5173/portal');

      await expect(
        page.getByRole('heading', { name: 'Login to Hjulverkstan Portal' }),
      ).toBeVisible();
    });

    await test.step('Fill in valid credentials and submit', async () => {
      await page.getByLabel('username').fill('admin');
      await page.getByLabel('password').fill('password');
      await page.locator('#submit').click();
    });

    await test.step('Verify the user has landed inside the Portal', async () => {
      await expect(page).toHaveURL(/\/portal/);
      await expect(
        page.getByRole('heading', { name: 'Login to Hjulverkstan Portal' }),
      ).not.toBeVisible();
    });

    await test.step('Verify no error message is shown', async () => {
      await expect(page.getByText(/error/i)).not.toBeVisible();
    });
  });

  // Lasse opens the Portal and enters an incorrect password.
  // He should stay on the login page, and get a warning about typing the
  // wrong password, instead of being let in to the portal.
  test('an incorrect password keeps the user on the login page', async ({
    page,
  }) => {
    await test.step('Navigate to the Portal login page', async () => {
      await page.goto('http://localhost:5173/portal');
    });

    await test.step('Fill in an invalid password and submit', async () => {
      await page.getByLabel('username').fill('admin');
      await page.getByLabel('password').fill('wrong-password');
      await page.locator('#submit').click();
    });

    await test.step('Verify the user is still on the login page', async () => {
      await expect(page).toHaveURL(/\/portal$/);
    });
  });

  // Lasse logs in at the start of his workday and needs to see what's
  // in his workshop — the Inventory list with each vehicle's status.
  test('a logged-in user sees vehicles with their status in the Inventory list', async ({
    page,
  }) => {
    await test.step('Log in with a valid user', async () => {
      await page.goto('http://localhost:5173/portal');
      await page.getByLabel('username').fill('admin');
      await page.getByLabel('password').fill('password');
      await page.locator('#submit').click();
    });

    await test.step('Verify the Inventory list has loaded', async () => {
      await expect(page).toHaveURL(/\/portal/);
      await expect(page.getByRole('table')).toBeVisible();
    });

    await test.step('Verify vehicles are shown with a status column', async () => {
      await expect(
        page.getByRole('columnheader', { name: 'Status', exact: true }),
      ).toBeVisible();

      const rowCount = await page.getByRole('row').count();
      expect(rowCount).toBeGreaterThan(1);
    });
  });
});
