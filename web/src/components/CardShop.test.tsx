import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { CardShop } from './CardShop';
import { Shop } from '@data/webedit/shop/types';

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

describe('CardShop Component', () => {
  const mockShop = {
    name: 'Store Alpha',
    slug: 'store-alpha',
    address: '99 Beta St',
    imageURL: '/store.jpg',
  } as unknown as Shop;

  test('should render shop card elements and wrap in localized link', () => {
    // Act
    render(
      <MemoryRouter>
        <CardShop shop={mockShop} />
      </MemoryRouter>,
    );

    // Assert
    expect(screen.getByText('Store Alpha')).toBeInTheDocument();
    expect(screen.getByText('99 Beta St')).toBeInTheDocument();
    expect(screen.getByTestId('mock-open-badge')).toBeInTheDocument();

    const img = screen.getByTestId('mock-image');
    expect(img).toHaveAttribute('src', '/store.jpg');
    expect(img).toHaveAttribute('alt', 'Store Alpha');

    // The entire card is wrapped in a link pointing to /shops/store-alpha
    // Since usePreloadedDataLocalized returns currLang='en', it prepends /en
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/en/shops/store-alpha');
  });
});
