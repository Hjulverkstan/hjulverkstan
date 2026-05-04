import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Bullet } from './Bullet';

const MockIcon = (props: any) => <svg data-testid="mock-icon" {...props} />;

describe('Bullet Component', () => {
  test('should render children and icon correctly', () => {
    // Arrange
    const text = 'Bullet point text';

    // Act
    render(
      <Bullet icon={MockIcon as any}>
        <span>{text}</span>
      </Bullet>,
    );

    // Assert
    expect(screen.getByText(text)).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  test('should apply aria-hidden="true" to the icon', () => {
    // Arrange & Act
    render(
      <Bullet icon={MockIcon as any}>
        Text
      </Bullet>,
    );

    // Assert
    const icon = screen.getByTestId('mock-icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  test('should apply custom iconSize and classes', () => {
    // Arrange
    const customSize = 32;
    const customClass = 'custom-icon-class';

    // Act
    render(
      <Bullet
        icon={MockIcon as any}
        iconSize={customSize}
        iconClassName={customClass}
        className="wrapper-class"
      >
        Text
      </Bullet>,
    );

    // Assert
    const icon = screen.getByTestId('mock-icon');
    // Note: since the implementation uses `<Icon size={iconSize} className={iconClassName} ... />`
    // We expect our mock to pass those down to the svg
    expect(icon).toHaveAttribute('class', customClass);
    expect(icon).toHaveAttribute('size', customSize.toString());
  });
});
