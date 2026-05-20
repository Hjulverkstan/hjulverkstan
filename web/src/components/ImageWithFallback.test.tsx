import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { ImageWithFallback } from './ImageWithFallback';

// Mock buildImageUrl to just return a known prefix
vi.mock('@utils/buildImageUrl', () => ({
  buildImageUrl: (src: string) => `built-${src}`,
}));

describe('ImageWithFallback Component', () => {
  test('should render native img tag with correctly built src', () => {
    // Arrange
    const fallback = <div data-testid="fallback">Fallback</div>;

    // Act
    render(
      <ImageWithFallback
        src="test-image.jpg"
        fallback={fallback}
        alt="test alt"
      />,
    );

    // Assert
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'built-test-image.jpg');
    expect(img).toHaveAttribute('alt', 'test alt');
    expect(screen.queryByTestId('fallback')).not.toBeInTheDocument();
  });

  test('should render fallback node when native img fires onError', () => {
    // Arrange
    const fallback = <div data-testid="fallback">Fallback</div>;

    // Act
    render(<ImageWithFallback src="error-image.jpg" fallback={fallback} />);

    const img = screen.getByRole('img');
    fireEvent.error(img); // Simulate image failing to load

    // Assert
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByTestId('fallback')).toBeInTheDocument();
  });

  test('should render fallback function correctly on error', () => {
    // Arrange
    const fallbackFn = () => <div data-testid="fallback-fn">Fallback Fn</div>;

    // Act
    render(<ImageWithFallback src="error-image2.jpg" fallback={fallbackFn} />);

    const img = screen.getByRole('img');
    fireEvent.error(img);

    // Assert
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByTestId('fallback-fn')).toBeInTheDocument();
  });

  test('should reset error state and attempt reload if src prop changes', () => {
    // Arrange
    const fallback = <div data-testid="fallback">Fallback</div>;
    const { rerender } = render(
      <ImageWithFallback src="img-1.jpg" fallback={fallback} />,
    );

    let img = screen.getByRole('img');
    fireEvent.error(img);

    // At this point, fallback is showing
    expect(screen.getByTestId('fallback')).toBeInTheDocument();

    // Act - change the src prop
    rerender(<ImageWithFallback src="img-2.jpg" fallback={fallback} />);

    // Assert - should show the new image, not the fallback
    expect(screen.queryByTestId('fallback')).not.toBeInTheDocument();
    img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'built-img-2.jpg');
  });
});
