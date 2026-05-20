import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import PageNavbar from './PageNavbar';
import { MemoryRouter } from 'react-router-dom';

// Mock hooks
vi.mock('@hooks/useCurrentLang', () => ({
  useCurrentLang: () => 'en',
}));

vi.mock('@hooks/useChangeLang', () => ({
  useChangeLang: () => vi.fn(),
}));

vi.mock('@hooks/usePreloadedData', () => ({
  usePreloadedData: () => ({
    langs: ['en', 'sv'],
  }),
  usePreloadedDataLocalized: () => ({
    data: { shops: [] },
  }),
}));

vi.mock('@hooks/useTranslations', () => ({
  useTranslations: () => ({ t: (key: string) => key }),
}));

vi.mock('@hooks/useScrolledPastElement', () => ({
  useScrolledPastElement: () => false,
}));

// Mock translations enums and utils
vi.mock('@data/translations/enums', () => ({
  langCodes: [
    { value: 'en', label: 'EN', dataKey: 'lang' },
    { value: 'sv', label: 'SV', dataKey: 'lang' },
  ],
}));

vi.mock('@utils/enums', () => ({
  findEnum: (enums: any[], value: string) => {
    const found = enums.find((e) => e.value === value);
    if (!found) return { label: value };
    return found;
  },
}));

// Mock shadcn Select to avoid deep Radix logic
vi.mock('@components/shadcn/Select', () => ({
  Root: ({ children, value, onValueChange }: any) => (
    <div data-testid="lang-select" onClick={() => onValueChange('sv')}>
      {value}
      {children}
    </div>
  ),
  Trigger: ({ children }: any) => <div>{children}</div>,
  Value: () => <span>Select Lang</span>,
  Content: ({ children }: any) => <div>{children}</div>,
  Item: ({ children, value }: any) => (
    <div data-testid={`lang-item-${value}`}>{children}</div>
  ),
}));

describe('PageNavbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should render navigation links', () => {
    // Act
    render(
      <MemoryRouter>
        <PageNavbar />
      </MemoryRouter>,
    );

    // Assert
    expect(screen.getByRole('link', { name: /^home$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^shops$/i })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /^contact$/i }),
    ).toBeInTheDocument();
  });

  test('should render language switcher', () => {
    // Act
    render(
      <MemoryRouter>
        <PageNavbar />
      </MemoryRouter>,
    );

    // Assert
    expect(screen.getByTestId('lang-select')).toBeInTheDocument();
  });

  test('should toggle mobile menu when menu icon is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <PageNavbar />
      </MemoryRouter>,
    );

    // Act: Open menu
    // The menu button has aria-label "Toggle menu"
    const menuBtn = screen.getByRole('button', { name: /toggle menu/i });
    await user.click(menuBtn);

    // Assert: Check if mobile nav is visible (in our mock, it's a div with nav links)
    // We can check if there are multiple "home" links now (one in desktop, one in mobile)
    // Wait, let's be more specific. PageNavbar renders mobile nav only if isOpen is true.
    expect(screen.getAllByRole('link', { name: /^home$/i })).toHaveLength(2);

    // Act: Close menu
    await user.click(menuBtn);
    expect(screen.getAllByRole('link', { name: /^home$/i })).toHaveLength(1);
  });

  test('should apply transparent class when onHero is true', () => {
    // Arrange
    // onHero is true when hasHeroSection=true AND scrolledPast=false AND isOpen=false

    // Act
    const { container } = render(
      <MemoryRouter>
        <PageNavbar hasHeroSection={true} />
      </MemoryRouter>,
    );

    // Assert
    const header = container.querySelector('header');
    expect(header).toHaveClass('bg-transparent');
  });
});
