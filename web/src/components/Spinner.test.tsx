import { render, act } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import Spinner from './Spinner';

vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-react')>();
  return {
    ...actual,
    Loader2: () => <div data-testid="spinner-icon" />,
  };
});

describe('Spinner Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('should be visible immediately when visible={true}', () => {
    // Arrange & Act
    const { queryByTestId } = render(<Spinner visible={true} />);

    // Assert
    expect(queryByTestId('spinner-icon')).toBeInTheDocument();
  });

  test('should debounce fast toggle and remain visible for 600ms', () => {
    // Arrange
    const { rerender, queryByTestId } = render(<Spinner visible={true} />);
    expect(queryByTestId('spinner-icon')).toBeInTheDocument();

    // Act: Toggle off before 600ms (e.g., at 100ms)
    act(() => {
      vi.advanceTimersByTime(100);
    });
    rerender(<Spinner visible={false} />);

    // Assert: Should still be visible
    expect(queryByTestId('spinner-icon')).toBeInTheDocument();

    // Act: Advance time to reach 600ms (100 + 500)
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Assert: Now it should be hidden
    expect(queryByTestId('spinner-icon')).not.toBeInTheDocument();
  });

  test('should hide immediately if toggled off after 600ms', () => {
    // Arrange
    const { rerender, queryByTestId } = render(<Spinner visible={true} />);

    // Act: Advance past the 600ms debounce
    act(() => {
      vi.advanceTimersByTime(700);
    });

    // Toggle off
    rerender(<Spinner visible={false} />);

    // Assert: Should hide immediately
    expect(queryByTestId('spinner-icon')).not.toBeInTheDocument();
  });

  test('should not render anything when visible={false} initially', () => {
    // Arrange & Act
    const { queryByTestId } = render(<Spinner visible={false} />);

    // Assert
    expect(queryByTestId('spinner-icon')).not.toBeInTheDocument();
  });
});
