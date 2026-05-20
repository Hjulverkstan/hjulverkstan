import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { endpoints } from '@data/api';
import ErrorComponent from './Error';

describe('Error Component', () => {
  test('should render ECONNABORTED default message correctly', () => {
    // Arrange
    // Note: The type ErrorRes has `error: string` (though it's an enum conceptually, string works based on the file content)
    // Actually ErrorRes in components is used like { error: 'ECONNABORTED' } in mapping.
    // Let's pass the minimal object to test the mapping logic.
    const errorProp = { error: 'ECONNABORTED' } as any;

    // Act
    render(<ErrorComponent error={errorProp} />);

    // Assert
    expect(screen.getByText('Server is not responding.')).toBeInTheDocument();
  });

  test('should render NOT_FOUND specific to endpoints.image correctly', () => {
    // Arrange
    const errorProp = { error: 'NOT_FOUND', endpoint: endpoints.image } as any;

    // Act
    render(<ErrorComponent error={errorProp} />);

    // Assert
    expect(screen.getByText('Image not available.')).toBeInTheDocument();
  });

  test('should render NOT_FOUND specific to endpoints.vehicle correctly', () => {
    // Arrange
    const errorProp = {
      error: 'NOT_FOUND',
      endpoint: endpoints.vehicle,
    } as any;

    // Act
    render(<ErrorComponent error={errorProp} />);

    // Assert
    expect(screen.getByText('Vehicle not found.')).toBeInTheDocument();
  });

  test('should render DEFAULT unknown error message when error code is unmapped', () => {
    // Arrange
    const errorProp = { error: 'SOME_UNKNOWN_CODE' } as any;

    // Act
    render(<ErrorComponent error={errorProp} />);

    // Assert
    expect(screen.getByText('There was an unknown error.')).toBeInTheDocument();
  });
});
