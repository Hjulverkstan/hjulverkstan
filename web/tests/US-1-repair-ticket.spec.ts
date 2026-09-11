// web/tests/US-1-repair-ticket.spec.ts
//
// Lasse, an instructor creates a repair ticket for a shop-owned bike.
// The bike should immediately flip to Unavailable, since it's now
// out of circulation until the repair is done.

import { test, expect } from '@playwright/test';
// AC-1
test('AC-1 a REPAIR ticket requires a repair description', async ({ page }) => {
  await test.step('Log in with a valid user', async () => {
    await page.goto('http://localhost:5173/portal');

    await page.getByLabel('username').fill('admin');
    await page.getByLabel('password').fill('password');
    await page.locator('#submit').click();

    await expect(page).toHaveURL(/\/portal/);
  });

  await test.step('Navigate to the Tickets tab', async () => {
    const navButtons = page.locator('nav').getByRole('button');

    await navButtons.nth(1).click();

    await expect(page).toHaveURL(/\/portal\/shop\/tickets/);
  });

  await test.step('Open the create ticket form', async () => {
    await page.getByRole('button', { name: 'Add ticket' }).click();
  });

  await test.step('Fill in the ticket information except repair description', async () => {
    await page.getByRole('combobox', { name: 'Customer' }).click();
    await page.getByRole('group').getByText('Hjulverkstan +').click();

    await page.getByRole('combobox', { name: 'Location' }).click();
    await page
      .getByRole('group')
      .locator('span')
      .filter({ hasText: 'Hjällbo' })
      .click();

    await page.getByRole('combobox', { name: 'Vehicles' }).click();
    await page.getByRole('option', { name: 'ERTY' }).click();

    // Vehicles is a multi-select and stays open after selecting a vehicle.
    await page.keyboard.press('Escape');

    await page.getByRole('combobox', { name: 'Employee' }).click();
    await page.getByRole('group').getByText('Samuel Siesjö').click();

    // Intentionally leave Repair Description empty.
    await page.getByRole('textbox', { name: 'Comment' }).fill('Samuel fixar');
  });

  await test.step('Verify Create is disabled without a repair description', async () => {
    await expect(
      page.getByRole('button', { name: 'Create', exact: true }),
    ).toBeDisabled();
  });
});

// AC-4
test('AC-4 a REPAIR ticket follows the correct status lifecycle', async ({
  page,
}) => {
  await test.step('Log in with a valid user', async () => {
    await page.goto('http://localhost:5173/portal');
    await page.getByLabel('username').fill('admin');
    await page.getByLabel('password').fill('password');
    await page.locator('#submit').click();

    await expect(page).toHaveURL(/\/portal/);
  });

  await test.step('Navigate to the Tickets tab', async () => {
    const navButtons = page.locator('nav').getByRole('button');
    await navButtons.nth(1).click();

    await expect(page).toHaveURL(/\/portal\/shop\/tickets/);
  });

  await test.step('Create a REPAIR ticket', async () => {
    await page.getByRole('button', { name: 'Add ticket' }).click();

    await page.getByRole('combobox', { name: 'Customer' }).click();
    await page.getByRole('group').getByText('Hjulverkstan +').click();

    await page.getByRole('combobox', { name: 'Location' }).click();
    await page
      .getByRole('group')
      .locator('span')
      .filter({ hasText: 'Hjällbo' })
      .click();

    await page.getByRole('combobox', { name: 'Vehicles' }).click();
    await page.getByRole('option', { name: 'ERTY' }).click();
    await page.keyboard.press('Escape');

    await page.getByRole('combobox', { name: 'Employee' }).click();
    await page.getByRole('group').getByText('Samuel Siesjö').click();

    await page
      .getByRole('textbox', { name: 'Repair Description' })
      .fill('Trasig broms');

    await page.getByRole('textbox', { name: 'Comment' }).fill('Samuel fixar');

    await page.getByRole('button', { name: 'Create', exact: true }).click();
  });

  await test.step('Verify the ticket starts in Ready', async () => {
    const ticket = page.getByRole('row', { name: /ERTY/ });

    await expect(ticket).toContainText('Ready');
  });

  await test.step('Move the ticket to IN_PROGRESS', async () => {
    // We need to adapt this selector to the actual UI.
    await page.getByRole('button', { name: /IN_PROGRESS/i }).click();
  });

  await test.step('Verify the ticket is IN_PROGRESS', async () => {
    await expect(page.getByText('IN_PROGRESS')).toBeVisible();
  });

  await test.step('Move the ticket to COMPLETE', async () => {
    await page.getByRole('button', { name: /COMPLETE/i }).click();
  });

  await test.step('Verify the ticket is COMPLETE', async () => {
    await expect(page.getByText('COMPLETE')).toBeVisible();
  });

  await test.step('Move the ticket to CLOSED', async () => {
    await page.getByRole('button', { name: /CLOSED/i }).click();
  });

  await test.step('Verify the ticket is CLOSED', async () => {
    await expect(page.getByText('CLOSED')).toBeVisible();
  });
});
//AC-3
test('AC-3 creating a REPAIR ticket marks the vehicle as Unavailable', async ({
  page,
}) => {
  await test.step('Log in with a valid user', async () => {
    await page.goto('http://localhost:5173/portal');
    await page.getByLabel('username').fill('admin');
    await page.getByLabel('password').fill('password');
    await page.locator('#submit').click();
    await expect(page).toHaveURL(/\/portal/);
  });
  // Lasse clicks the tickets tab to see an overview
  await test.step('Navigate to the Tickets tab', async () => {
    const navButtons = page.locator('nav').getByRole('button');
    await navButtons.nth(1).click();
    await expect(page).toHaveURL(/\/portal\/shop\/tickets/);
  });
  // Lasse starts to create a ticket for a bike with the example below.
  await test.step('Open the create ticket form', async () => {
    await page.getByRole('button', { name: 'Add ticket' }).click();
  });

  await test.step('Fill in customer, location, vehicle and employee', async () => {
    await page.getByRole('combobox', { name: 'Customer' }).click();
    await page.getByRole('group').getByText('Hjulverkstan +').click();

    await page.getByRole('combobox', { name: 'Location' }).click();
    await page
      .getByRole('group')
      .locator('span')
      .filter({ hasText: 'Hjällbo' })
      .click();

    await page.getByRole('combobox', { name: 'Vehicles' }).click();
    await page.getByRole('option', { name: 'ERTY' }).click();

    // Vehicles is a multi-select and stays open after picking one item,
    // so we need to explicitly close it before interacting with anything else.
    await page.keyboard.press('Escape');

    await page.getByRole('combobox', { name: 'Employee' }).click();
    await page.getByRole('group').getByText('Samuel Siesjö').click();
  });

  await test.step('Fill in the repair description and comment', async () => {
    await page
      .getByRole('textbox', { name: 'Repair Description' })
      .fill('Trasig broms');
    await page.getByRole('textbox', { name: 'Comment' }).fill('Samuel fixar');
  });

  await test.step('Submit the ticket', async () => {
    await page.getByRole('button', { name: 'Create', exact: true }).click();
  });

  await test.step('Navigate to Inventory and verify the vehicle is Unavailable', async () => {
    await page.goto('http://localhost:5173/portal/shop/inventory');
    await expect(page.getByRole('row', { name: /ERTY/ })).toContainText(
      'Unavailable',
    );
  });
});
