import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import IconLabel from './IconLabel';

const MockIcon = () => <div data-testid="mock-icon" />;

describe('IconLabel Component', () => {
  test('should render the provided text label correctly', () => {
    // Arrange
    const labelText = 'My Label';

    // Act
    render(<IconLabel label={labelText} />);

    // Assert
    expect(screen.getByText(labelText)).toBeInTheDocument();
  });

  test('should render the icon when provided', () => {
    // Arrange
    const labelText = 'Label with Icon';

    // Act
    render(<IconLabel label={labelText} icon={MockIcon} />);

    // Assert
    expect(screen.getByText(labelText)).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  test('should render additional children', () => {
    // Arrange
    const labelText = 'Label with Children';
    const childText = 'Additional info';

    // Act
    render(
      <IconLabel label={labelText}>
        <span data-testid="child-element">{childText}</span>
      </IconLabel>,
    );

    // Assert
    expect(screen.getByText(labelText)).toBeInTheDocument();
    expect(screen.getByTestId('child-element')).toBeInTheDocument();
    expect(screen.getByText(childText)).toBeInTheDocument();
  });
});
