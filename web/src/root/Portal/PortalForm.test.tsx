import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import PortalForm from './PortalForm';
import { Mode, useDataForm } from '@components/DataForm';
import { useToast } from '@components/shadcn/use-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { createSuccessToast, createErrorToast } from './toast';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useParams: vi.fn(),
}));
vi.mock('@components/DataForm', () => ({
  Mode: { READ: 'READ', EDIT: 'EDIT', CREATE: 'CREATE' },
  useDataForm: vi.fn(),
}));
vi.mock('@components/shadcn/use-toast', () => ({ useToast: vi.fn() }));
vi.mock('@components/shadcn/Button', () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => <button onClick={onClick}>{children}</button>,
  IconButton: ({
    text,
    disabled,
    onClick,
  }: {
    text?: string;
    disabled?: boolean;
    onClick?: () => void;
  }) =>
    text ? (
      <button data-testid="action-button" disabled={disabled} onClick={onClick}>
        {text}
      </button>
    ) : (
      <button
        data-testid="close-button"
        disabled={disabled}
        onClick={onClick}
      />
    ),
}));
vi.mock('@components/shadcn/Tooltip', () => ({
  Root: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Trigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Content: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
vi.mock('@components/Error', () => ({ default: () => null }));
vi.mock('./toast', () => ({
  createSuccessToast: vi.fn((args) => ({ type: 'success', ...args })),
  createErrorToast: vi.fn((args) => ({ type: 'error', ...args })),
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

const navigateMock = vi.fn();
const toastMock = vi.fn();

const renderForm = (
  props: Partial<React.ComponentProps<typeof PortalForm>> = {},
) => {
  const { children, ...rest } = props;
  return render(
    <PortalForm
      isSubmitting={false}
      saveMutation={vi.fn().mockResolvedValue({ id: 'saved-id' })}
      dataLabel="Vehicle"
      toToolbarName={() => 'My Vehicle'}
      {...rest}
    >
      {children ?? <div>fields</div>}
    </PortalForm>,
  );
};

const clickAction = () => userEvent.click(screen.getByTestId('action-button'));

beforeEach(() => {
  navigateMock.mockClear();
  toastMock.mockClear();
  vi.mocked(createSuccessToast).mockClear();
  vi.mocked(createErrorToast).mockClear();

  vi.mocked(useNavigate).mockReturnValue(navigateMock);
  vi.mocked(useParams).mockReturnValue({ id: 'existing-id' });
  vi.mocked(useToast).mockReturnValue({ toast: toastMock } as any);
  vi.mocked(useDataForm).mockReturnValue({
    mode: Mode.READ,
    body: { name: 'test-body' },
    submitError: null,
    isLoading: false,
  } as any);
});

// ─── onCreate ─────────────────────────────────────────────────────────────────

describe('onCreate', () => {
  beforeEach(() => {
    vi.mocked(useDataForm).mockReturnValue({
      mode: Mode.CREATE,
      body: { name: 'test-body' },
      submitError: null,
      isLoading: false,
    } as any);
  });

  it('does not call createMutation when submitError is set', async () => {
    vi.mocked(useDataForm).mockReturnValue({
      mode: Mode.CREATE,
      body: {},
      submitError: 'Required field missing',
      isLoading: false,
    } as any);
    const createMutation = vi.fn().mockResolvedValue({ id: 'new-id' });
    renderForm({ createMutation });

    await clickAction();

    expect(createMutation).not.toHaveBeenCalled();
  });

  it('applies transformBodyOnSubmit to body before calling createMutation', async () => {
    const createMutation = vi.fn().mockResolvedValue({ id: 'new-id' });
    const transformBodyOnSubmit = (b: any) => ({ ...b, transformed: true });
    renderForm({ createMutation, transformBodyOnSubmit });

    await clickAction();

    expect(createMutation).toHaveBeenCalledWith({
      name: 'test-body',
      transformed: true,
    });
  });

  it('on success — navigates to "../" + res.id and calls success toast', async () => {
    const createMutation = vi.fn().mockResolvedValue({ id: 'new-id' });
    renderForm({ createMutation });

    await clickAction();

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('../new-id'));
    expect(toastMock).toHaveBeenCalledTimes(1);
    expect(vi.mocked(createSuccessToast).mock.calls[0][0]).toMatchObject({
      verbLabel: 'create',
      dataLabel: 'Vehicle',
    });
  });

  it('on error — calls console.error and error toast', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const createMutation = vi.fn().mockRejectedValue(new Error('server error'));
    renderForm({ createMutation });

    await clickAction();

    await waitFor(() => expect(toastMock).toHaveBeenCalledTimes(1));
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(vi.mocked(createErrorToast).mock.calls[0][0]).toMatchObject({
      verbLabel: 'create',
      dataLabel: 'Vehicle',
    });

    consoleSpy.mockRestore();
  });
});

// ─── onSave ───────────────────────────────────────────────────────────────────

describe('onSave', () => {
  beforeEach(() => {
    vi.mocked(useDataForm).mockReturnValue({
      mode: Mode.EDIT,
      body: { name: 'test-body' },
      submitError: null,
      isLoading: false,
    } as any);
  });

  it('does not call saveMutation when submitError is set', async () => {
    vi.mocked(useDataForm).mockReturnValue({
      mode: Mode.EDIT,
      body: {},
      submitError: 'Required field missing',
      isLoading: false,
    } as any);
    const saveMutation = vi.fn().mockResolvedValue({ id: 'saved-id' });
    renderForm({ saveMutation });

    await clickAction();

    expect(saveMutation).not.toHaveBeenCalled();
  });

  it('on success — navigates to "../" + res.id and calls success toast', async () => {
    const saveMutation = vi.fn().mockResolvedValue({ id: 'updated-id' });
    renderForm({ saveMutation });

    await clickAction();

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith('../updated-id'),
    );
    expect(toastMock).toHaveBeenCalledTimes(1);
    expect(vi.mocked(createSuccessToast).mock.calls[0][0]).toMatchObject({
      verbLabel: 'save',
      dataLabel: 'Vehicle',
    });
  });

  it('on error — calls console.error and error toast', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const saveMutation = vi.fn().mockRejectedValue(new Error('server error'));
    renderForm({ saveMutation });

    await clickAction();

    await waitFor(() => expect(toastMock).toHaveBeenCalledTimes(1));
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(vi.mocked(createErrorToast).mock.calls[0][0]).toMatchObject({
      verbLabel: 'save',
      dataLabel: 'Vehicle',
    });

    consoleSpy.mockRestore();
  });
});

// ─── Mode-to-UI mapping ───────────────────────────────────────────────────────

describe('Mode-to-UI mapping', () => {
  it('Mode.READ → action button text is "Edit"', () => {
    renderForm();
    expect(screen.getByTestId('action-button')).toHaveTextContent('Edit');
  });

  it('Mode.EDIT → action button text is "Save"', () => {
    vi.mocked(useDataForm).mockReturnValue({
      mode: Mode.EDIT,
      body: {},
      submitError: null,
      isLoading: false,
    } as any);
    renderForm();
    expect(screen.getByTestId('action-button')).toHaveTextContent('Save');
  });

  it('Mode.CREATE with createMutation provided → action button text is "Create"', () => {
    vi.mocked(useDataForm).mockReturnValue({
      mode: Mode.CREATE,
      body: {},
      submitError: null,
      isLoading: false,
    } as any);
    renderForm({ createMutation: vi.fn().mockResolvedValue({ id: '1' }) });
    expect(screen.getByTestId('action-button')).toHaveTextContent('Create');
  });

  it('Mode.CREATE without createMutation → falls back to "Edit" (READ behavior)', () => {
    vi.mocked(useDataForm).mockReturnValue({
      mode: Mode.CREATE,
      body: {},
      submitError: null,
      isLoading: false,
    } as any);
    renderForm();
    expect(screen.getByTestId('action-button')).toHaveTextContent('Edit');
  });
});

// ─── Button disable predicate ─────────────────────────────────────────────────

describe('Action button disabled predicate', () => {
  it('disabled when error prop is set', () => {
    renderForm({ error: { message: 'Not found' } as any });
    expect(screen.getByTestId('action-button')).toBeDisabled();
  });

  it('disabled when isSubmitting is true', () => {
    renderForm({ isSubmitting: true });
    expect(screen.getByTestId('action-button')).toBeDisabled();
  });

  it('disabled when submitError is set from useDataForm', () => {
    vi.mocked(useDataForm).mockReturnValue({
      mode: Mode.READ,
      body: {},
      submitError: 'Field required',
      isLoading: false,
    } as any);
    renderForm();
    expect(screen.getByTestId('action-button')).toBeDisabled();
  });

  it('disabled when disableEdit string is provided', () => {
    renderForm({ disableEdit: 'Editing is locked' });
    expect(screen.getByTestId('action-button')).toBeDisabled();
  });
});
