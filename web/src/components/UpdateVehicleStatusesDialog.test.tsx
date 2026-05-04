import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import UpdateVehicleStatusesDialog from './UpdateVehicleStatusesDialog';
import { VehicleStatus } from '../data/vehicle/types';
import { useUpdateVehicleStatusM } from '../data/vehicle/mutations';

// Mock Dialog sub-components
vi.mock('@components/shadcn/Dialog', () => ({
  DialogContent: ({ children }: any) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogDescription: ({ children }: any) => <div>{children}</div>,
  DialogClose: ({ children }: any) => <>{children}</>,
}));

// Mock useDialogManager
const mockCloseCurrentDialog = vi.fn();
vi.mock('@components/DialogManager', () => ({
  useDialogManager: () => ({ closeCurrentDialog: mockCloseCurrentDialog }),
}));

// Mock useToast
const mockToast = vi.fn();
vi.mock('@components/shadcn/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

// Mock mutations
vi.mock('../data/vehicle/mutations', () => ({
  useUpdateVehicleStatusM: vi.fn(),
}));

// Mock Select (Simplified)
vi.mock('@components/shadcn/Select', () => ({
  Root: ({ children, onValueChange, value }: any) => (
    <div data-testid="mock-select">
      <select 
        value={value} 
        onChange={(e) => onValueChange(e.target.value)}
        data-testid="status-select"
      >
        <option value="">Choose</option>
        {Object.values(VehicleStatus).map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      {children}
    </div>
  ),
  Trigger: ({ children }: any) => <div>{children}</div>,
  Value: ({ placeholder }: any) => <span>{placeholder}</span>,
  Content: ({ children }: any) => <div>{children}</div>,
  Item: ({ children, value }: any) => <div data-testid={`real-item-${value}`}>{children}</div>,
}));

describe('UpdateVehicleStatusesDialog Component', () => {
  const mockVehicles = [
    { id: '1', regTag: 'ABC-123' },
    { id: '2', regTag: '' }, // Should fall back to Vehicle 2
  ] as any[];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useUpdateVehicleStatusM).mockReturnValue({ mutateAsync: vi.fn() } as any);
  });

  test('should render vehicle list and status selectors', () => {
    // Act
    render(<UpdateVehicleStatusesDialog vehicles={mockVehicles} />);

    // Assert
    expect(screen.getByText('ABC-123')).toBeInTheDocument();
    expect(screen.getByText('Vehicle 2')).toBeInTheDocument();
    expect(screen.getAllByTestId('mock-select')).toHaveLength(2);
  });

  test('should show error toast and NOT close if statuses are missing', async () => {
    // Arrange
    const user = userEvent.setup();

    // Act
    render(<UpdateVehicleStatusesDialog vehicles={mockVehicles} />);
    await user.click(screen.getByRole('button', { name: /confirm/i }));

    // Assert
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Failed to choose the status for all vehicles.',
    }));
    expect(mockCloseCurrentDialog).not.toHaveBeenCalled();
  });

  test('should call mutation and close dialog on success', async () => {
    // Arrange
    const user = userEvent.setup();
    const mockMutateAsync = vi.fn().mockResolvedValue({});
    vi.mocked(useUpdateVehicleStatusM).mockReturnValue({ mutateAsync: mockMutateAsync } as any);

    render(<UpdateVehicleStatusesDialog vehicles={mockVehicles} />);
    
    // Act: Set statuses for both vehicles
    const selects = screen.getAllByTestId('status-select');
    await user.selectOptions(selects[0], VehicleStatus.AVAILABLE);
    await user.selectOptions(selects[1], VehicleStatus.BROKEN);

    await user.click(screen.getByRole('button', { name: /confirm/i }));

    // Assert
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledTimes(2);
    });
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Successfully managed to update the vehicle statuses: undefined.',
    }));
    expect(mockCloseCurrentDialog).toHaveBeenCalledTimes(1);
  });

  test('should show error toast if mutation fails', async () => {
    // Arrange
    const user = userEvent.setup();
    const mockMutateAsync = vi.fn().mockRejectedValue(new Error('Update failed'));
    vi.mocked(useUpdateVehicleStatusM).mockReturnValue({ mutateAsync: mockMutateAsync } as any);

    render(<UpdateVehicleStatusesDialog vehicles={mockVehicles} />);
    
    const selects = screen.getAllByTestId('status-select');
    await user.selectOptions(selects[0], VehicleStatus.AVAILABLE);
    await user.selectOptions(selects[1], VehicleStatus.BROKEN);

    await user.click(screen.getByRole('button', { name: /confirm/i }));

    // Assert
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Failed to update the vehicle statuses.',
      }));
    });
    expect(mockCloseCurrentDialog).not.toHaveBeenCalled();
  });

  test('should format status labels correctly', async () => {
    // Arrange
    render(<UpdateVehicleStatusesDialog vehicles={[mockVehicles[0]]} />);

    // Assert: Check if "Available" is present (capitalized)
    // Select.Item should be rendered as children of Select.Content which is children of Select.Root
    expect(screen.getByText('Available')).toBeInTheDocument();
  });
});
