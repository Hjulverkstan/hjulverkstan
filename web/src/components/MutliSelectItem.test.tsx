import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import MutliSelectItem from './MutliSelectItem';
import { User } from 'lucide-react';

// Mock Command sub-components
vi.mock('@components/shadcn/Command', () => ({
  Item: ({ children, onSelect, disabled, className }: any) => (
    <div
      data-testid="command-item"
      onClick={onSelect}
      className={className}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      {children}
    </div>
  ),
}));

describe('MutliSelectItem Component', () => {
  const mockEnumAttr = {
    value: 'test-value',
    label: 'Test Label',
    count: 10,
    icon: User,
  };

  test('should render label, icon and count', () => {
    // Act
    render(
      <MutliSelectItem
        enumAttr={mockEnumAttr}
        checkBox="unchecked"
        onClick={vi.fn()}
      />,
    );

    // Assert
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    // Lucide icon check
    expect(
      screen.getByTestId('command-item').querySelector('svg'),
    ).toBeInTheDocument();
  });

  test('should call onClick when clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClick = vi.fn();

    // Act
    render(
      <MutliSelectItem
        enumAttr={mockEnumAttr}
        checkBox="unchecked"
        onClick={onClick}
      />,
    );
    await user.click(screen.getByTestId('command-item'));

    // Assert
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('should render CheckIcon when checked', () => {
    // Act
    render(
      <MutliSelectItem
        enumAttr={mockEnumAttr}
        checkBox="checked"
        onClick={vi.fn()}
      />,
    );

    // Assert
    // CheckIcon from lucide has class lucide-check
    expect(
      screen.getByTestId('command-item').querySelector('.lucide-check'),
    ).toBeInTheDocument();
  });

  test('should render MinusIcon when intermediate', () => {
    // Act
    render(
      <MutliSelectItem
        enumAttr={mockEnumAttr}
        checkBox="intermediate"
        onClick={vi.fn()}
      />,
    );

    // Assert
    // MinusIcon from lucide has class lucide-minus
    expect(
      screen.getByTestId('command-item').querySelector('.lucide-minus'),
    ).toBeInTheDocument();
  });

  test('should apply indentation class when isIndented is true', () => {
    // Act
    const { container } = render(
      <MutliSelectItem
        enumAttr={mockEnumAttr}
        checkBox="unchecked"
        onClick={vi.fn()}
        isIndented={true}
      />,
    );

    // Assert
    // The indentation class is applied to the checkbox wrapper div
    const checkboxWrapper = container.querySelector('.ml-4');
    expect(checkboxWrapper).toBeInTheDocument();
  });
});
