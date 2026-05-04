import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import ConfirmSoftDeleteDialog from './ConfirmSoftDeleteDialog';

// Mock Dialog sub-components
vi.mock('@components/shadcn/Dialog', () => ({
  DialogContent: ({ children }: any) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogDescription: ({ children }: any) => <div>{children}</div>,
  DialogClose: ({ children }: any) => <>{children}</>,
}));

describe('ConfirmSoftDeleteDialog Component', () => {
  test('should render entity and title', () => {
    // Act
    render(
      <ConfirmSoftDeleteDialog 
        entity="Customer" 
        entityId="C-1" 
      />
    );

    // Assert
    expect(screen.getByText('Confirm deletion')).toBeInTheDocument();
    expect(screen.getByText(/you are trying to delete customer with id c-1/i)).toBeInTheDocument();
  });

  test('should call onDelete when Delete button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const onDelete = vi.fn();

    // Act
    render(<ConfirmSoftDeleteDialog entity="X" onDelete={onDelete} />);
    await user.click(screen.getByRole('button', { name: /delete/i }));

    // Assert
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  test('should call onCancel when Cancel button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const onCancel = vi.fn();

    // Act
    render(<ConfirmSoftDeleteDialog entity="X" onCancel={onCancel} />);
    await user.click(screen.getByRole('button', { name: /cancel/i }));

    // Assert
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
