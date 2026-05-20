import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import DeleteTicketDialog from './DeleteTicketDialog';

// Mock Dialog sub-components
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

describe('DeleteTicketDialog Component', () => {
  test('should render ticket ID and entity description', () => {
    // Act
    render(<DeleteTicketDialog entity="Customer" entityId="T-123" />);

    // Assert
    expect(screen.getByText('Confirm deletion')).toBeInTheDocument();
    expect(
      screen.getByText(/you are trying to delete customer with id t-123/i),
    ).toBeInTheDocument();
  });

  test('should call onCancel when Cancel button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const onCancel = vi.fn();

    // Act
    render(<DeleteTicketDialog entity="Ticket" onCancel={onCancel} />);
    await user.click(screen.getByRole('button', { name: /cancel/i }));

    // Assert
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('should call onCloseTicket when Close button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const onCloseTicket = vi.fn();

    // Act
    render(
      <DeleteTicketDialog entity="Ticket" onCloseTicket={onCloseTicket} />,
    );
    await user.click(screen.getByRole('button', { name: /close/i }));

    // Assert
    expect(onCloseTicket).toHaveBeenCalledTimes(1);
  });

  test('should call onDelete when Delete button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const onDelete = vi.fn();

    // Act
    render(<DeleteTicketDialog entity="Ticket" onDelete={onDelete} />);
    await user.click(screen.getByRole('button', { name: /delete/i }));

    // Assert
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
