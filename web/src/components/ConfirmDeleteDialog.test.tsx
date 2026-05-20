import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';

// Provide a simple pass-through mock for the Dialog sub-components
vi.mock('@components/shadcn/Dialog', () => ({
  DialogContent: ({ children }: any) => (
    <div data-testid="dialog-content">{children}</div>
  ),
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogDescription: ({ children }: any) => <div>{children}</div>,
  DialogClose: ({ children }: any) => <>{children}</>,
}));

vi.mock('@radix-ui/react-tooltip', () => ({
  Provider: ({ children }: any) => <>{children}</>,
  Root: ({ children }: any) => <>{children}</>,
  Trigger: ({ children }: any) => <>{children}</>,
  Content: ({ children }: any) => (
    <div data-testid="tooltip-content">{children}</div>
  ),
}));

describe('ConfirmDeleteDialog Component', () => {
  test('should render the entity name and title', () => {
    // Act
    render(<ConfirmDeleteDialog entity="Customer" entityId="C-42" />);

    // Assert
    expect(screen.getByText('Choose delete method')).toBeInTheDocument();
    expect(
      screen.getByText(/you are trying to delete customer with id c-42/i),
    ).toBeInTheDocument();
  });

  test('should render entity without id when entityId is omitted', () => {
    // Act
    render(<ConfirmDeleteDialog entity="Ticket" />);

    // Assert
    expect(
      screen.getByText(/you are trying to delete ticket/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/with id/i)).not.toBeInTheDocument();
  });

  test('should call onCancel when Cancel button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const onCancel = vi.fn();

    // Act
    render(<ConfirmDeleteDialog entity="Item" onCancel={onCancel} />);
    await user.click(screen.getByRole('button', { name: /cancel/i }));

    // Assert
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('should call onDelete when Remove button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const onDelete = vi.fn();

    // Act
    render(<ConfirmDeleteDialog entity="Item" onDelete={onDelete} />);
    await user.click(screen.getByRole('button', { name: /remove/i }));

    // Assert
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  test('should call onHardDelete when Erase button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const onHardDelete = vi.fn();

    // Act
    render(<ConfirmDeleteDialog entity="Item" onHardDelete={onHardDelete} />);
    await user.click(screen.getByRole('button', { name: /erase/i }));

    // Assert
    expect(onHardDelete).toHaveBeenCalledTimes(1);
  });

  test('should disable Remove button and show tooltip when disable=true', () => {
    // Act
    render(<ConfirmDeleteDialog entity="Item" disable={true} />);

    // Assert
    expect(screen.getByRole('button', { name: /remove/i })).toBeDisabled();
    expect(screen.getByTestId('tooltip-content')).toHaveTextContent(
      'Delete ticket first.',
    );
  });
});
