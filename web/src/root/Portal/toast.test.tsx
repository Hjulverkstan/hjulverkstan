import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  createErrorToast,
  createRepairNotificationErrorToast,
  createSuccessToast,
  createRefreshToast,
} from './toast';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@components/shadcn/Toast', () => ({
  Action: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick: () => void;
  }) => <button onClick={onClick}>{children}</button>,
}));

// ─── createErrorToast ─────────────────────────────────────────────────────────

describe('createErrorToast', () => {
  it('sets variant to "red"', () => {
    expect(
      createErrorToast({ verbLabel: 'delete', dataLabel: 'vehicle' }).variant,
    ).toBe('red');
  });

  it('interpolates verbLabel and dataLabel in the title', () => {
    const { title } = createErrorToast({
      verbLabel: 'delete',
      dataLabel: 'vehicle',
    });
    expect(title).toBe('Failed to delete the vehicle.');
  });

  it('returns the fixed description string', () => {
    const { description } = createErrorToast({
      verbLabel: 'delete',
      dataLabel: 'vehicle',
    });
    expect(description).toBe('Try again soon or contact your local developer.');
  });

  it('sets duration to 5000', () => {
    expect(
      createErrorToast({ verbLabel: 'delete', dataLabel: 'vehicle' }).duration,
    ).toBe(5000);
  });
});

// ─── createRepairNotificationErrorToast ──────────────────────────────────────

describe('createRepairNotificationErrorToast', () => {
  it('returns the correct static title, description, and duration', () => {
    // Arrange & Act
    const toast = createRepairNotificationErrorToast();

    // Assert
    expect(toast.title).toBe('SMS notification failed.');
    expect(toast.description).toBe(
      'Failed to notify the customer via SMS – try to send it manually.',
    );
    expect(toast.duration).toBe(10000000);
  });
});

// ─── createSuccessToast ───────────────────────────────────────────────────────

describe('createSuccessToast', () => {
  it('sets variant to "green"', () => {
    expect(
      createSuccessToast({ verbLabel: 'create', dataLabel: 'ticket', id: '42' })
        .variant,
    ).toBe('green');
  });

  it('interpolates verbLabel, dataLabel, and id in the title', () => {
    const { title } = createSuccessToast({
      verbLabel: 'create',
      dataLabel: 'ticket',
      id: '42',
    });
    expect(title).toBe('Successfully managed to create the ticket: 42.');
  });

  it('sets duration to 5000', () => {
    expect(
      createSuccessToast({ verbLabel: 'create', dataLabel: 'ticket' }).duration,
    ).toBe(5000);
  });

  it('includes "undefined" in the title when id is not provided', () => {
    const { title } = createSuccessToast({
      verbLabel: 'create',
      dataLabel: 'ticket',
    });
    expect(title).toBe('Successfully managed to create the ticket: undefined.');
  });
});

// ─── createRefreshToast ───────────────────────────────────────────────────────

describe('createRefreshToast', () => {
  it('returns the correct title, description, and duration', () => {
    // Arrange & Act
    const toast = createRefreshToast(vi.fn());

    // Assert
    expect(toast.title).toBe(
      'Someone has made changes to the data you are viewing.',
    );
    expect(toast.description).toBe('Do you want to refresh?');
    expect(toast.duration).toBe(1000000);
  });

  it('invokes the callback when the action button is clicked', async () => {
    // Arrange
    const cb = vi.fn();
    const toast = createRefreshToast(cb);

    // Act
    render(toast.action);
    await userEvent.click(screen.getByRole('button', { name: 'Yes' }));

    // Assert
    expect(cb).toHaveBeenCalledTimes(1);
  });
});
