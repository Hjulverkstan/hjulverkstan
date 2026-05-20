import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { CardCompact } from './CardCompact';

vi.mock('@hooks/useCurrentLang', () => ({
  useCurrentLang: () => 'en',
}));

vi.mock('@hooks/usePreloadedData', () => ({
  usePreloadedDataLocalized: () => ({ currLang: 'en' }),
}));

describe('CardCompact Component', () => {
  test('should render the title, body, and passes the link correctly', () => {
    // Arrange
    const title = 'Test Compact Title';
    const body = 'Test Compact Body';
    const link = '/test-link';
    const ariaLabel = 'Navigate to test';

    // Act
    render(
      <MemoryRouter>
        <CardCompact
          title={title}
          body={body}
          link={link}
          ariaLabel={ariaLabel}
        />
      </MemoryRouter>,
    );

    // Assert
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(body)).toBeInTheDocument();

    const linkElement = screen.getByRole('link', { name: ariaLabel });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', `/en${link}`);
  });
});
