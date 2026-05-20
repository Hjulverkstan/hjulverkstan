import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import DeleteVehicleDialog from './DeleteVehicleDialog';

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

describe('DeleteVehicleDialog Component', () => {
  test('should render vehicle ID and recommended action', () => {
    // Act
    render(<DeleteVehicleDialog entity="Vehicle" entityId="V-777" />);

    // Assert
    expect(screen.getByText('Confirm deletion')).toBeInTheDocument();
    expect(
      screen.getByText(/you are trying to delete vehicle with id v-777/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /archive/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/sets the status to archived/i),
    ).toBeInTheDocument();
  });

  test('should call onArchive when Archive button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const onArchive = vi.fn();

    // Act
    render(<DeleteVehicleDialog entity="X" onArchive={onArchive} />);
    await user.click(screen.getByRole('button', { name: /archive/i }));

    // Assert
    expect(onArchive).toHaveBeenCalledTimes(1);
  });

  test('should call onDelete when Delete button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const onDelete = vi.fn();

    // Act
    render(<DeleteVehicleDialog entity="X" onDelete={onDelete} />);
    await user.click(screen.getByRole('button', { name: /delete/i }));

    // Assert
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  test('should call onCancel when Cancel button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const onCancel = vi.fn();

    // Act
    render(<DeleteVehicleDialog entity="X" onCancel={onCancel} />);
    await user.click(screen.getByRole('button', { name: /cancel/i }));

    // Assert
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
