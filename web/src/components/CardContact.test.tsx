import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { CardContact } from './CardContact';
import { Shop } from '@data/webedit/shop/types';

vi.mock('@hooks/useTranslations', () => ({
  useTranslations: () => ({
    t: (key: string) => key,
  }),
}));

// Mock OpenBadge to avoid deeply rendering hook-heavy component
vi.mock('@components/OpenBadge', () => ({
  OpenBadge: () => <div data-testid="mock-open-badge" />,
}));

describe('CardContact Component', () => {
  const mockShop = {
    name: 'Test Shop',
    address: '123 Test St',
    latitude: '12.34',
    longitude: '56.78',
    openHours: {
      mon: '08:00 - 16:00',
      tue: '08:00 - 16:00',
      wed: '08:00 - 16:00',
      thu: '08:00 - 16:00',
      fri: '08:00 - 16:00',
      sat: '10:00 - 14:00',
      sun: 'closed',
    },
  } as unknown as Shop;

  test('should render correctly with full shop details and groups hours', () => {
    // Act
    render(<CardContact shop={mockShop} />);

    // Assert
    expect(screen.getByText('Test Shop')).toBeInTheDocument();
    expect(screen.getByText('123 Test St')).toBeInTheDocument();
    expect(screen.getByTestId('mock-open-badge')).toBeInTheDocument();

    // Check map iframe src
    const iframe = screen.getByTitle(/map showing location of/i);
    expect(iframe).toHaveAttribute(
      'src',
      'https://www.google.com/maps?q=12.34,56.78&z=15&output=embed',
    );

    // Check grouped hours
    // Monday to Friday should be grouped together since they have identical hours
    expect(
      screen.getByText('monday–friday: 08:00 - 16:00'),
    ).toBeInTheDocument();
    expect(screen.getByText('saturday: 10:00 - 14:00')).toBeInTheDocument();
    expect(screen.getByText('sunday: closed')).toBeInTheDocument();
  });

  test('should adjust layout for compact variant', () => {
    // Act
    const { container } = render(
      <CardContact shop={mockShop} variant="compact" />,
    );

    // Assert
    // Compact mode shouldn't show header (title and badge)
    expect(screen.queryByText('Test Shop')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-open-badge')).not.toBeInTheDocument();

    // Address and hours should still be there
    expect(screen.getByText('123 Test St')).toBeInTheDocument();

    // Check for base compact class
    expect(container.firstChild).toHaveClass('p-8 md:flex-row');
  });

  test('should hide header when showHeader is false', () => {
    // Act
    render(
      <CardContact shop={mockShop} showHeader={false} variant="default" />,
    );

    // Assert
    expect(screen.queryByText('Test Shop')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-open-badge')).not.toBeInTheDocument();
    expect(screen.getByText('123 Test St')).toBeInTheDocument();
  });
});
