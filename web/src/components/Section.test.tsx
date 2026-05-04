import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Section } from './Section';

describe('Section Component', () => {
  test('should render children inside a <section> element', () => {
    // Act
    render(<Section><p>Hello Section</p></Section>);

    // Assert – a <section> without an aria-label is generic, query by tag
    const { container } = render(<Section><p>Hello Section</p></Section>);
    expect(container.querySelector('section')).toBeInTheDocument();
    expect(screen.getAllByText('Hello Section').length).toBeGreaterThan(0);
  });

  test('should render grain overlay by default', () => {
    // Act
    const { container } = render(<Section><span>Content</span></Section>);

    // Assert – grain div has a style with grain.png background
    const grainDiv = container.querySelector('[style*="grain.png"]');
    expect(grainDiv).toBeInTheDocument();
  });

  test('should NOT render grain overlay when grain={false}', () => {
    // Act
    const { container } = render(
      <Section grain={false}><span>Content</span></Section>
    );

    // Assert
    const grainDiv = container.querySelector('[style*="grain.png"]');
    expect(grainDiv).not.toBeInTheDocument();
  });

  test('should apply variant class', () => {
    // Act
    const { container } = render(
      <Section variant="muted"><span>Content</span></Section>
    );

    // Assert
    expect(container.firstChild).toHaveClass('bg-muted');
  });

  test('should apply custom className', () => {
    // Act
    const { container } = render(
      <Section className="my-custom"><span>Content</span></Section>
    );

    // Assert
    expect(container.firstChild).toHaveClass('my-custom');
  });
});
