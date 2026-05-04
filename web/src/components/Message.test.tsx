import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { AlertCircle } from 'lucide-react';
import Message from './Message';

vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-react')>();
  return {
    ...actual,
    AlertCircle: () => <div data-testid="mock-icon" />,
  };
});

describe('Message Component', () => {
  test('should render the provided message text correctly', () => {
    // Arrange
    const text = 'This is a test message';

    // Act
    render(<Message message={text} />);

    // Assert
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  test('should render children elements when provided', () => {
    // Arrange
    const text = 'Message with children';
    const buttonText = 'Click Me';

    // Act
    render(
      <Message message={text}>
        <button>{buttonText}</button>
      </Message>,
    );

    // Assert
    expect(
      screen.getByRole('button', { name: buttonText }),
    ).toBeInTheDocument();
  });

  test('should render icon if provided', () => {
    // Arrange
    const text = 'Message with icon';

    // Act
    render(<Message message={text} icon={AlertCircle} />);

    // Assert
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  test('should render correctly with only message string', () => {
    // Arrange
    const text = 'Minimal props';

    // Act
    render(<Message message={text} />);

    // Assert
    expect(screen.getByText(text)).toBeInTheDocument();
    expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
  });
});
