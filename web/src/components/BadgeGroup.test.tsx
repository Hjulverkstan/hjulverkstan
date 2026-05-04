import { render, screen, act } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import * as Tooltip from '@components/shadcn/Tooltip';
import BadgeGroup, { Badge } from './BadgeGroup';

const MockIcon = () => <div data-testid="mock-icon" />;

describe('BadgeGroup Component', () => {
  test('should render a list of basic badges', () => {
    // Arrange
    const badges: Badge[] = [
      { label: 'Badge 1' },
      { label: 'Badge 2' },
    ];

    // Act
    render(
      <MemoryRouter>
        <BadgeGroup badges={badges} />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText('Badge 1')).toBeInTheDocument();
    expect(screen.getByText('Badge 2')).toBeInTheDocument();
  });

  test('should render correctly when exact limit is reached', () => {
    // Arrange
    const badges: Badge[] = [
      { label: 'Badge 1' },
      { label: 'Badge 2' },
      { label: 'Badge 3' },
    ];

    // Act
    render(
      <MemoryRouter>
        <BadgeGroup badges={badges} limit={3} />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText('Badge 1')).toBeInTheDocument();
    expect(screen.getByText('Badge 2')).toBeInTheDocument();
    expect(screen.getByText('Badge 3')).toBeInTheDocument();
    expect(screen.queryByText(/more \.\.\./)).not.toBeInTheDocument();
  });

  test('should truncate badges when limit exceeded', () => {
    // Arrange
    const badges: Badge[] = [
      { label: 'Badge 1' },
      { label: 'Badge 2' },
      { label: 'Badge 3' },
    ];

    // Act
    render(
      <MemoryRouter>
        <BadgeGroup badges={badges} limit={1} />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText('Badge 1')).toBeInTheDocument();
    expect(screen.queryByText('Badge 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Badge 3')).not.toBeInTheDocument();
    expect(screen.getByText('2 more ...')).toBeInTheDocument();
  });

  test('should wrap in Link when href provided', () => {
    // Arrange
    const badges: Badge[] = [
      { label: 'Link Badge', href: '/some-path' },
    ];

    // Act
    render(
      <MemoryRouter>
        <BadgeGroup badges={badges} />
      </MemoryRouter>
    );

    // Assert
    const linkElement = screen.getByRole('link');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/some-path');
    expect(linkElement).toHaveTextContent('Link Badge');
  });

  test('should wrap in Tooltip when tooltip provided', async () => {
    // Arrange
    const user = userEvent.setup();
    const badges: Badge[] = [
      { label: 'Tooltip Badge', tooltip: 'Tooltip Content' },
    ];

    // Act
    render(
      <Tooltip.Provider delayDuration={0}>
        <MemoryRouter>
          <BadgeGroup badges={badges} />
        </MemoryRouter>
      </Tooltip.Provider>
    );

    // Assert: Hover to show tooltip
    const badgeElement = screen.getByText('Tooltip Badge');
    
    await act(async () => {
      await user.hover(badgeElement);
    });
    
    // Check if tooltip content is rendered
    expect(await screen.findByRole('tooltip', { name: 'Tooltip Content' })).toBeInTheDocument();
  });
});
