import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { CardVehicle } from './CardVehicle';
import { Shop } from '@data/webedit/shop/types';
import { Vehicle } from '@data/vehicle/types';

vi.mock('@hooks/useCurrentLang', () => ({
  useCurrentLang: () => 'en',
}));
vi.mock('@hooks/usePreloadedData', () => ({
  usePreloadedDataLocalized: () => ({ currLang: 'en' }),
}));

vi.mock('@components/OpenBadge', () => ({
  OpenBadge: () => <div data-testid="mock-open-badge" />,
}));
vi.mock('@components/Card', async () => {
  const actual = await vi.importActual('@components/Card');
  return {
    ...(actual as any),
    Image: ({ src, alt }: any) => (
      <img data-testid="mock-image" src={src} alt={alt} />
    ),
  };
});

vi.mock('@hooks/useTranslateRawEnums', () => ({
  useTranslateRawEnums: () => ({
    vehicleType: 'MOCK_VEHICLE_TYPE_ENUMS',
  }),
}));

vi.mock('@utils/enums', () => ({
  findEnum: (enums: any, value: string) => {
    if (value === 'BRAND_YAMAHA') return { label: 'Yamaha' };
    if (value === 'TYPE_SCOOTER') return { label: 'Scooter' };
    return { label: 'Unknown' };
  },
}));

describe('CardVehicle Component', () => {
  const mockShop = {
    name: 'Bike Store',
    address: '101 Bike Lane',
  } as unknown as Shop;

  const mockVehicle = {
    id: 'veh-123',
    brand: 'BRAND_YAMAHA',
    vehicleType: 'TYPE_SCOOTER',
    imageURL: '/scooter.jpg',
  } as unknown as Vehicle;

  test('should concatenate titleLabel using enums and display correctly with Link', () => {
    // Act
    render(
      <MemoryRouter>
        <CardVehicle shop={mockShop} vehicle={mockVehicle} />
      </MemoryRouter>,
    );

    // Assert
    // Title is concatenated from brand and type
    expect(screen.getByText('Yamaha Scooter')).toBeInTheDocument();

    // Shop info
    expect(screen.getByText('Bike Store')).toBeInTheDocument();
    expect(screen.getByText('101 Bike Lane')).toBeInTheDocument();
    expect(screen.getByTestId('mock-open-badge')).toBeInTheDocument();

    const img = screen.getByTestId('mock-image');
    expect(img).toHaveAttribute('src', '/scooter.jpg');
    expect(img).toHaveAttribute('alt', 'Yamaha Scooter');

    // Link wrapping the card
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/en/vehicle/veh-123');
  });
});
