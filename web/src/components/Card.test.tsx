import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import * as Card from './Card';
import { User } from 'lucide-react';

// Mock ImageWithFallback and Error
vi.mock('@components/ImageWithFallback', () => ({
  ImageWithFallback: ({ alt }: any) => <img alt={alt} data-testid="fallback-img" />,
}));
vi.mock('@components/Error', () => ({
  default: () => <div data-testid="error-component" />,
}));

describe('Card Component Family', () => {
  test('Card.Base should render children and apply variant class', () => {
    // Act
    render(
      <Card.Base variant="muted" className="custom-base">
        <span>Content</span>
      </Card.Base>
    );

    // Assert
    const base = screen.getByText('Content').parentElement;
    expect(base).toHaveClass('bg-muted');
    expect(base).toHaveClass('custom-base');
  });

  test('Card.Title should render heading content', () => {
    // Act
    render(<Card.Title>My Title</Card.Title>);

    // Assert
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  test('Card.Icon should render lucide icon', () => {
    // Act
    const { container } = render(<Card.Icon icon={User} />);

    // Assert
    // Lucide icons render as svg tags
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  test('Card.Image should render ImageWithFallback when src is provided', () => {
    // Act
    render(<Card.Image src="test.jpg" alt="Test Image" />);

    // Assert
    expect(screen.getByTestId('fallback-img')).toHaveAttribute('alt', 'Test Image');
  });

  test('Card.Image should render fallback icon when src is missing', () => {
    // Act
    const { container } = render(<Card.Image alt="No Image" />);

    // Assert
    expect(screen.queryByTestId('fallback-img')).not.toBeInTheDocument();
    // It should render an svg for the fallback icon
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
