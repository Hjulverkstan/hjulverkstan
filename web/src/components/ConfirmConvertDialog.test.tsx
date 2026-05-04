import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import ConfirmConvertDialog from './ConfirmConvertDialog';
import { useVehiclesQ } from '../data/vehicle/queries';

// Mock Dialog sub-components
vi.mock('@components/shadcn/Dialog', () => ({
  DialogContent: ({ children }: any) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogDescription: ({ children }: any) => <div>{children}</div>,
  DialogClose: ({ children }: any) => <>{children}</>,
}));

// Mock useVehiclesQ hook
vi.mock('../data/vehicle/queries', () => ({
  useVehiclesQ: vi.fn(),
}));

// Mock BadgeGroup
vi.mock('@components/BadgeGroup', () => ({
  default: ({ badges, limit }: any) => (
    <div 
      data-testid="mock-badge-group" 
      data-badges-json={JSON.stringify(badges)}
      data-limit={limit}
    >
      {badges.map((b: any) => (
        <span key={b.label}>{b.label}</span>
      ))}
    </div>
  ),
}));

describe('ConfirmConvertDialog Component', () => {
  test('should render title, description and badges', () => {
    // Arrange
    vi.mocked(useVehiclesQ).mockReturnValue({
      data: [
        { id: '1', regTag: 'ABC-123', isCustomerOwned: false, vehicleType: 'car' },
        { id: '2', regTag: 'XYZ-789', isCustomerOwned: true, vehicleType: 'truck' },
      ],
    } as any);

    // Act
    render(
      <ConfirmConvertDialog 
        title="Convert Vehicles" 
        description="Are you sure?" 
        vehicleIds={['1', '2']} 
        onConfirm={vi.fn()} 
      />
    );

    // Assert
    expect(screen.getByText('Convert Vehicles')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    
    expect(screen.getByText('ABC-123')).toBeInTheDocument();
    expect(screen.getByText('#2')).toBeInTheDocument();
  });

  test('should call onConfirm when Convert button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    vi.mocked(useVehiclesQ).mockReturnValue({ data: [] } as any);

    // Act
    render(
      <ConfirmConvertDialog 
        title="Title" 
        vehicleIds={['1']} 
        onConfirm={onConfirm} 
      />
    );
    await user.click(screen.getByRole('button', { name: /convert/i }));

    // Assert
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  test('should call onClose when Cancel button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    vi.mocked(useVehiclesQ).mockReturnValue({ data: [] } as any);

    // Act
    render(
      <ConfirmConvertDialog 
        title="Title" 
        vehicleIds={['1']} 
        onConfirm={vi.fn()} 
        onClose={onClose} 
      />
    );
    await user.click(screen.getByRole('button', { name: /cancel/i }));

    // Assert
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('should render empty list if data is missing', () => {
    // Arrange
    vi.mocked(useVehiclesQ).mockReturnValue({ data: null } as any);

    // Act
    render(
      <ConfirmConvertDialog 
        title="Title" 
        vehicleIds={['1']} 
        onConfirm={vi.fn()} 
      />
    );

    // Assert
    expect(screen.queryByText('ABC-123')).not.toBeInTheDocument();
  });

  test('should pass tooltips and variants to BadgeGroup', () => {
    // Arrange
    vi.mocked(useVehiclesQ).mockReturnValue({ 
      data: [{ id: '1', regTag: 'ABC', isCustomerOwned: false, vehicleType: 'motorcycle' }] 
    } as any);

    // Act
    render(
      <ConfirmConvertDialog 
        title="Title" 
        vehicleIds={['1']} 
        onConfirm={vi.fn()} 
      />
    );

    // Assert
    const badgeGroup = screen.getByTestId('mock-badge-group');
    const badges = JSON.parse(badgeGroup.getAttribute('data-badges-json') || '[]');
    expect(badges[0]).toEqual({
      label: 'ABC',
      variant: 'secondary',
      tooltip: 'Motorcycle'
    });
  });
});
