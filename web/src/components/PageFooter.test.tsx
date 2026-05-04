import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import PageFooter from './PageFooter';
import { MemoryRouter } from 'react-router-dom';

// Mock hooks
vi.mock('@hooks/usePreloadedData', () => ({
  usePreloadedDataLocalized: () => ({
    data: {
      shops: [
        { id: 's1', name: 'Shop One', slug: 'shop-one', address: 'Street 1, City 1', openHours: [] },
        { id: 's2', name: 'Shop Two', slug: 'shop-two', address: 'Street 2', openHours: [] },
      ],
    },
  }),
  usePreloadedData: () => ({
    langs: ['en', 'sv'],
  }),
}));

vi.mock('@hooks/useTranslations', () => ({
  useTranslations: () => ({ t: (key: string) => key }),
}));

// Mock OpenBadge
vi.mock('@components/OpenBadge', () => ({
  OpenBadge: () => <div data-testid="open-badge" />,
}));

describe('PageFooter Component', () => {
  test('should render shop cards with correct info', () => {
    // Act
    render(
      <MemoryRouter>
        <PageFooter />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText('Shop One')).toBeInTheDocument();
    expect(screen.getByText('Street 1', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('City 1', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Shop Two')).toBeInTheDocument();
    expect(screen.getAllByTestId('open-badge')).toHaveLength(2);
  });

  test('should render social/partnership links', () => {
    // Act
    render(
      <MemoryRouter>
        <PageFooter />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByRole('link', { name: /footerSaveTheChildrenBody/i })).toHaveAttribute('href', 'https://www.savethechildren.net');
    expect(screen.getByRole('link', { name: /footerDevelopBody/i })).toHaveAttribute('href', 'https://www.alten.se');
    expect(screen.getByRole('link', { name: /footerOpenSourceBody/i })).toHaveAttribute('href', 'https://github.com/Hjulverkstan');
  });

  test('should render navigation links', () => {
    // Act
    render(
      <MemoryRouter>
        <PageFooter />
      </MemoryRouter>
    );

    // Assert
    // navLinks from PageNavbar are mocked as translated keys
    expect(screen.getByRole('link', { name: /^home$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^shops$/i })).toBeInTheDocument();
  });
});
