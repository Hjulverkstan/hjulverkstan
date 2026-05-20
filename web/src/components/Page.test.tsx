import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { Page } from './Page';

// Mock heavy sub-components that have many of their own deps
vi.mock('@components/PageNavbar', () => ({
  default: ({ hasHeroSection }: any) => (
    <nav data-testid="mock-navbar" data-hero={String(hasHeroSection)} />
  ),
}));

vi.mock('@components/PageFooter', () => ({
  default: () => <footer data-testid="mock-footer" />,
}));

describe('Page Component', () => {
  test('should render children, navbar, and footer', () => {
    // Act
    render(
      <Page>
        <main>Page Body</main>
      </Page>,
    );

    // Assert
    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    expect(screen.getByText('Page Body')).toBeInTheDocument();
  });

  test('should render heading inside an h1 when provided', () => {
    // Act
    render(
      <Page heading="Page Heading">
        <p>Content</p>
      </Page>,
    );

    // Assert
    expect(
      screen.getByRole('heading', { level: 1, name: 'Page Heading' }),
    ).toBeInTheDocument();
  });

  test('should NOT render h1 when no heading is provided', () => {
    // Act
    render(
      <Page>
        <p>Content</p>
      </Page>,
    );

    // Assert
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });

  test('should pass hasHeroSection prop to PageNavbar', () => {
    // Act
    render(
      <Page hasHeroSection>
        <p>Content</p>
      </Page>,
    );

    // Assert
    expect(screen.getByTestId('mock-navbar')).toHaveAttribute(
      'data-hero',
      'true',
    );
  });

  test('should apply muted variant class', () => {
    // Act
    render(
      <Page variant="muted">
        <p>Content</p>
      </Page>,
    );

    // Assert – the main wrapping content should have bg-muted
    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveClass('bg-muted');
  });
});
