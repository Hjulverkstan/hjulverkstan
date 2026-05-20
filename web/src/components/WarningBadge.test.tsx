import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import WarningBadge from './WarningBadge';

// Mock BadgeGroup to just render its props so we can assert on them
vi.mock('@components/BadgeGroup', () => ({
  default: ({ badges }: any) => (
    <div data-testid="mock-badge-group">
      {badges.map((b: any, i: number) => (
        <div key={i} data-testid="badge-item" data-variant={b.variant}>
          <span data-testid="badge-label">{b.label}</span>
          <span data-testid="badge-icon">{b.icon ? b.icon() : 'no-icon'}</span>
          <div data-testid="badge-tooltip">{b.tooltip}</div>
        </div>
      ))}
    </div>
  ),
}));

// Mock translations
vi.mock('@hooks/useTranslations', () => ({
  useTranslations: () => ({
    t: (key: string) => `trans_${key}`,
  }),
}));

// Mock enum mapping
vi.mock('@hooks/useTranslateRawEnums', () => ({
  useTranslateRawEnums: () => ['mocked_enums'],
}));

vi.mock('@utils/enums', () => ({
  findEnum: (enums: any, value: string) => {
    if (value === 'WARNING_1') {
      return { tooltipTranslationKey: 'key_1', icon: () => 'icon_1' };
    }
    if (value === 'WARNING_2') {
      return { tooltipTranslationKey: 'key_2', icon: () => 'icon_2' };
    }
    return { tooltipTranslationKey: '', icon: null };
  },
}));

describe('WarningBadge Component', () => {
  test('should render the id correctly', () => {
    // Act
    render(<WarningBadge id="12345" warnings={[]} variant="default" />);

    // Assert
    expect(screen.getByTestId('badge-label')).toHaveTextContent('#12345');
    expect(screen.getByTestId('badge-item')).toHaveAttribute(
      'data-variant',
      'default',
    );
  });

  test('should render mapped tooltips and icons when warnings are present', () => {
    // Act
    render(
      <WarningBadge
        id="54321"
        warnings={['WARNING_1', 'WARNING_2']}
        variant="destructive"
      />,
    );

    // Assert
    expect(screen.getByTestId('badge-label')).toHaveTextContent('#54321');
    expect(screen.getByTestId('badge-icon')).toHaveTextContent('icon_1');

    // Tooltip should contain both translations
    const tooltip = screen.getByTestId('badge-tooltip');
    expect(tooltip).toHaveTextContent('trans_key_1');
    expect(tooltip).toHaveTextContent('trans_key_2');
  });

  test('should render without warnings correctly', () => {
    // Act
    render(<WarningBadge id="999" warnings={[]} variant="outline" />);

    // Assert
    expect(screen.getByTestId('badge-label')).toHaveTextContent('#999');
    expect(screen.getByTestId('badge-icon')).toHaveTextContent('no-icon');
    expect(screen.getByTestId('badge-tooltip')).toBeEmptyDOMElement();
  });
});
