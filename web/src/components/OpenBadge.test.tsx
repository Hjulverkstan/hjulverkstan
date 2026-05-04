import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { OpenBadge } from './OpenBadge';

vi.mock('@hooks/useTranslations', () => ({
  useTranslations: () => ({
    t: (key: string) => `translated_${key}`,
  }),
}));

const mockUseShopOpenStatus = vi.fn();
vi.mock('@hooks/useShopOpenData', () => ({
  useShopOpenStatus: (...args: any) => mockUseShopOpenStatus(...args),
}));

// Mock the Badge from shadcn
vi.mock('@components/shadcn/Badge', () => ({
  Badge: ({ children, variant, className, icon: Icon }: any) => (
    <div data-testid="mock-badge" className={className} data-variant={variant}>
      {Icon && <Icon />}
      {children}
    </div>
  ),
}));

describe('OpenBadge Component', () => {
  test('should return null when openHours is undefined or null', () => {
    // Act
    const { container } = render(<OpenBadge openHours={undefined} />);

    // Assert
    expect(container).toBeEmptyDOMElement();
  });

  test('should render open state text and styles', () => {
    // Arrange
    mockUseShopOpenStatus.mockReturnValue(true);

    // Act
    render(<OpenBadge openHours={{} as any} />);

    // Assert
    expect(screen.getByText('translated_open')).toBeInTheDocument();
    
    const badge = screen.getByTestId('mock-badge');
    expect(badge).toHaveAttribute('data-variant', 'greenWhite');
  });

  test('should render closed state text and styles', () => {
    // Arrange
    mockUseShopOpenStatus.mockReturnValue(false);

    // Act
    render(<OpenBadge openHours={{} as any} />);

    // Assert
    expect(screen.getByText('translated_closed')).toBeInTheDocument();
    
    const badge = screen.getByTestId('mock-badge');
    expect(badge).toHaveAttribute('data-variant', 'yellowWhite');
  });

  test('should apply variant classes', () => {
    // Arrange
    mockUseShopOpenStatus.mockReturnValue(true);

    // Act
    render(<OpenBadge openHours={{} as any} variant="minimal" />);

    // Assert
    const badge = screen.getByTestId('mock-badge');
    expect(badge.className).toContain('bg-secondary p-0 text-base');
  });
});
