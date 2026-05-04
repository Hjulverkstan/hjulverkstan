import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import EmployeeIcon from './EmployeeIcon';
import { Employee } from '@data/employee/types';

describe('EmployeeIcon Component', () => {
  const makeEmployee = (id: string, firstName: string, lastName: string): Employee =>
    ({ id, firstName, lastName }) as unknown as Employee;

  test('should render initials in uppercase', () => {
    // Arrange
    const employee = makeEmployee('1', 'mario', 'bugarin');

    // Act
    render(<EmployeeIcon employee={employee} />);

    // Assert
    expect(screen.getByText('MB')).toBeInTheDocument();
  });

  test('should apply a color class based on employee id modulo', () => {
    // Arrange – id "0" → index 0 → green color
    const employee = makeEmployee('0', 'Anna', 'Smith');

    // Act
    const { container } = render(<EmployeeIcon employee={employee} />);

    // Assert – first child div gets one of the color classes
    expect(container.firstChild).toHaveClass('bg-green-fill');
  });

  test('should apply custom className', () => {
    // Arrange
    const employee = makeEmployee('1', 'Joe', 'Doe');

    // Act
    const { container } = render(
      <EmployeeIcon employee={employee} className="custom-class" />
    );

    // Assert
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
