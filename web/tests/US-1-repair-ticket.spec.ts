// web/tests/US-1-repair-ticket.spec.ts
//
// Lasse, an instructor creates a repair ticket for a shop-owned bike.
// The bike should immediately flip to Unavailable, since it's now
// out of circulation until the repair is done.

import { test, expect } from '@playwright/test';
import {
  registerTicketForCleanup,
  uniqueTicketMarker,
} from './helpers/ticketCleanup';

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
    await page.locator('nav').getByRole('button').nth(1).click();

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

    // Lasse intentionally leave Repair Description empty.
    await page.getByRole('textbox', { name: 'Comment' }).fill('Samuel fixar');
  });

  await test.step('Verify Create is disabled without a repair description', async () => {
    await expect(
      page.getByRole('button', { name: 'Create', exact: true }),
    ).toBeDisabled();
  });
});

// AC-2
test('AC-2 the Vehicles field only offers vehicles from the selected location', async ({
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
    await page.locator('nav').getByRole('button').nth(1).click();
    await expect(page).toHaveURL(/\/portal\/shop\/tickets/);
  });

  await test.step('Open the create ticket form', async () => {
    await page.getByRole('button', { name: 'Add ticket' }).click();
  });

  await test.step('Select the Hjällbo location', async () => {
    await page.getByRole('combobox', { name: 'Location' }).click();
    await page
      .getByRole('group')
      .locator('span')
      .filter({ hasText: 'Hjällbo' })
      .click();
  });

  await test.step('Verify a vehicle from another location is not offered', async () => {
    await page.getByRole('combobox', { name: 'Vehicles' }).click();

    // ANOJ belongs to Backa, not Hjällbo, so it must not be selectable here.
    await expect(page.getByRole('option', { name: 'ANOJ' })).not.toBeVisible();

    // Sanity check: ERTY belongs to Hjällbo, so it should still be offered -
    // otherwise the check above would trivially pass on an empty list.
    await expect(page.getByRole('option', { name: 'ERTY' })).toBeVisible();
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
    await page.locator('nav').getByRole('button').nth(1).click();
    await expect(page).toHaveURL(/\/portal\/shop\/tickets/);
  });
  // Lasse starts to create a ticket for a bike with the example below.
  await test.step('Open the create ticket form', async () => {
    await page.getByRole('button', { name: 'Add ticket' }).click();
  });
  // Lasse fills the form
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

  const marker = uniqueTicketMarker('AC-3');

  await test.step('Fill in the repair description and comment', async () => {
    await page
      .getByRole('textbox', { name: 'Repair Description' })
      .fill('Trasig broms');
    await page
      .getByRole('textbox', { name: 'Comment' })
      .fill(`Samuel fixar ${marker}`);
  });

  await test.step('Submit the ticket', async () => {
    await page.getByRole('button', { name: 'Create', exact: true }).click();
    registerTicketForCleanup(marker);
  });

  await test.step('Navigate to Inventory and verify the vehicle is Unavailable', async () => {
    await page.goto('http://localhost:5173/portal/shop/inventory');
    await expect(page.getByRole('row', { name: /ERTY/ })).toContainText(
      'Unavailable',
    );
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
    await page.locator('nav').getByRole('button').nth(1).click();

    await expect(page).toHaveURL(/\/portal\/shop\/tickets/);
  });

  // Other tests (and other parallel workers) can create their own REPAIR
  // tickets for this same fixture vehicle around the same time, so a plain
  // "newest ERTY row" locator can end up pointing at someone else's ticket.
  // Tagging the comment with a run-unique marker lets us scope to exactly
  // the ticket this test created.
  const marker = uniqueTicketMarker('AC-4');

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

    await page
      .getByRole('textbox', { name: 'Comment' })
      .fill(`Samuel fixar ${marker}`);

    await page.getByRole('button', { name: 'Create', exact: true }).click();
    registerTicketForCleanup(marker);
  });

  const ticket = page.getByRole('row', { name: new RegExp(marker) });

  const setStatus = async (statusLabel: string) => {
    await ticket.getByRole('button').click();
    await page.getByRole('menuitem', { name: 'Status' }).hover();
    await page.getByRole('menuitem', { name: statusLabel }).click();
  };

  await test.step('Verify the ticket starts in Ready', async () => {
    await expect(ticket).toContainText('Ready');
  });

  await test.step('Move the ticket to In progress', async () => {
    await setStatus('In progress');
  });

  await test.step('Verify the ticket is In progress', async () => {
    await expect(ticket).toContainText('In progress');
  });

  await test.step('Move the ticket to Completed', async () => {
    await setStatus('Completed');

    // REPAIR tickets ask to confirm before notifying the customer.
    await page.getByRole('button', { name: 'Complete & notify' }).click();
  });

  await test.step('Verify the ticket is Completed', async () => {
    await expect(ticket).toContainText('Completed');
  });

  await test.step('Move the ticket to Closed', async () => {
    await setStatus('Closed');

    // Closing a REPAIR ticket for a shop-owned vehicle prompts to update
    // the vehicle's status; dismiss it since it's outside this AC's scope.
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  });

  await test.step('Verify the ticket is Closed', async () => {
    await expect(ticket).toContainText('Closed');
  });
});
