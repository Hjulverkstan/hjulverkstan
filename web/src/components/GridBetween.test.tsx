import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { GridBetween } from './GridBetween';

describe('GridBetween Component', () => {
  test('should render children sliced into rows and cols', () => {
    // Arrange
    const children = [
      <div key="1">Item 1</div>,
      <div key="2">Item 2</div>,
      <div key="3">Item 3</div>,
      <div key="4">Item 4</div>,
    ];

    // Act
    const { container } = render(
      <GridBetween rows={2} cols={2}>
        {children}
      </GridBetween>,
    );

    // Assert
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 4')).toBeInTheDocument();

    // Verify two rows were created by checking child div count on the main container
    expect(container.firstChild?.childNodes.length).toBe(2);
  });

  test('should handle underflow when children are fewer than rows * cols', () => {
    // Arrange
    const children = [
      <div key="1">Item 1</div>,
      <div key="2">Item 2</div>,
    ];

    // Act
    const { container } = render(
      <GridBetween rows={2} cols={2}>
        {children}
      </GridBetween>,
    );

    // Assert
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();

    // Still creates 2 rows even though the second row is empty
    expect(container.firstChild?.childNodes.length).toBe(2);
    expect(container.firstChild?.childNodes[1]).toBeEmptyDOMElement();
  });

  test('should apply custom classes to the grid and rows', () => {
    // Arrange
    const customGridClass = 'custom-grid';
    const customRowClass = 'custom-row';

    // Act
    const { container } = render(
      <GridBetween
        rows={1}
        cols={1}
        className={customGridClass}
        rowClassName={customRowClass}
      >
        <div key="1">Item 1</div>
      </GridBetween>,
    );

    // Assert
    expect(container.firstChild).toHaveClass(customGridClass);
    expect(container.firstChild?.firstChild).toHaveClass(customRowClass);
  });
});
