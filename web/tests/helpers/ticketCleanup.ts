// Tests create REPAIR tickets for shared fixture vehicles (e.g. "ERTY") but
// never remove them, so the tickets list would grow by a few rows every run.
// To keep the data clean, and so two tests running at the same time don't
// mix up each other's tickets, any test that creates one should:
//
//   1. tag its ticket's Comment field with a unique marker:
//        const marker = uniqueTicketMarker('AC-3');
//        ...fill Comment with `Samuel fixar ${marker}`...
//   2. register that marker right after creating the ticket:
//        registerTicketForCleanup(marker);
//
// After the test finishes, the afterEach below finds the ticket by its
// marker and deletes it via the API.

import { test } from '@playwright/test';

let markerToCleanUp: string | undefined;

export const uniqueTicketMarker = (prefix: string) =>
  `${prefix}-${test.info().workerIndex}-${Date.now()}`;

export const registerTicketForCleanup = (marker: string) => {
  markerToCleanUp = marker;
};

test.afterEach(async ({ page }) => {
  if (!markerToCleanUp) return;
  const marker = markerToCleanUp;
  markerToCleanUp = undefined;

  try {
    await page
      .locator('nav')
      .getByRole('button', { name: 'Tickets' })
      .click({ timeout: 5000 });

    const text = await page
      .getByRole('row', { name: new RegExp(marker) })
      .first()
      .textContent({ timeout: 5000 });

    const id = text?.match(/#(\d+)/)?.[1];

    if (id) {
      await page.request.delete(`http://localhost:5173/api/ticket/${id}/hard`);
    }
  } catch {
    // Best-effort cleanup only - a failed test may leave the app in a state
    // where the ticket can't be found here, which isn't worth failing over.
  }
});
