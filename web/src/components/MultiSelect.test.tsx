import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import MultiSelect from './MultiSelect';

// Mock Command
vi.mock('@components/shadcn/Command', () => ({
  Group: ({ children, heading }: any) => (
    <div data-testid="command-group">
      <h3>{heading}</h3>
      {children}
    </div>
  ),
  Item: ({ children, onSelect, className }: any) => (
    <div data-testid="command-item" onClick={onSelect} className={className}>
      {children}
    </div>
  ),
}));

// Mock MultiSelectItem to simplify testing of MultiSelect logic
vi.mock('@components/MutliSelectItem', () => {
  return {
    __esModule: true,
    default: ({ enumAttr, checkBox, onClick, isIndented }: any) => {
      if (!enumAttr) return <div data-testid="error">No enumAttr</div>;
      return (
        <div
          data-testid={`item-${enumAttr.value}`}
          onClick={onClick}
          data-checkbox={checkBox}
          data-indented={isIndented ? 'true' : 'false'}
        >
          {enumAttr.label}
        </div>
      );
    },
  };
});

describe('MultiSelect Component', () => {
  const mockEnums = [
    { value: 'parent1', label: 'Parent 1', children: ['child1', 'child2'] },
    { value: 'child1', label: 'Child 1' },
    { value: 'child2', label: 'Child 2' },
    { value: 'root1', label: 'Root 1' },
  ] as any[];

  test('should render hierarchy correctly', () => {
    // Act
    render(
      <MultiSelect
        enums={mockEnums}
        selected={[]}
        setSelected={vi.fn()}
        heading="Categories"
      />,
    );

    // Assert
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByTestId('item-parent1')).toBeInTheDocument();
    expect(screen.getByTestId('item-child1')).toHaveAttribute(
      'data-indented',
      'true',
    );
    expect(screen.getByTestId('item-root1')).toHaveAttribute(
      'data-indented',
      'false',
    );
  });

  test('should set parent to intermediate if some children are selected', () => {
    // Act
    render(
      <MultiSelect
        enums={mockEnums}
        selected={['child1']}
        setSelected={vi.fn()}
      />,
    );

    // Assert
    expect(screen.getByTestId('item-parent1')).toHaveAttribute(
      'data-checkbox',
      'intermediate',
    );
    expect(screen.getByTestId('item-child1')).toHaveAttribute(
      'data-checkbox',
      'checked',
    );
    expect(screen.getByTestId('item-child2')).toHaveAttribute(
      'data-checkbox',
      'unchecked',
    );
  });

  test('should set parent to checked if parent value is in selected', () => {
    // Act
    render(
      <MultiSelect
        enums={mockEnums}
        selected={['parent1']}
        setSelected={vi.fn()}
      />,
    );

    // Assert
    expect(screen.getByTestId('item-parent1')).toHaveAttribute(
      'data-checkbox',
      'checked',
    );
    // Children should also be considered checked via logic in component
    expect(screen.getByTestId('item-child1')).toHaveAttribute(
      'data-checkbox',
      'checked',
    );
  });

  test('should handle folding: selecting last child should select parent and remove children', async () => {
    // Arrange
    const user = userEvent.setup();
    const setSelected = vi.fn();

    // All siblings except child2 are selected
    render(
      <MultiSelect
        enums={mockEnums}
        selected={['child1']}
        setSelected={setSelected}
      />,
    );

    // Act: Click child2
    await user.click(screen.getByTestId('item-child2'));

    // Assert: It should remove child1 and add parent1
    expect(setSelected).toHaveBeenCalledWith(
      expect.arrayContaining(['parent1']),
    );
    expect(setSelected).toHaveBeenCalledWith(
      expect.not.arrayContaining(['child1', 'child2']),
    );
  });

  test('should handle unfolding: deselecting child when parent is selected', async () => {
    // Arrange
    const user = userEvent.setup();
    const setSelected = vi.fn();

    render(
      <MultiSelect
        enums={mockEnums}
        selected={['parent1']}
        setSelected={setSelected}
      />,
    );

    // Act: Click child1 (to deselect it from parent)
    await user.click(screen.getByTestId('item-child1'));

    // Assert: It should remove parent1 and add other siblings (child2)
    expect(setSelected).toHaveBeenCalledWith(['child2']);
  });
});
