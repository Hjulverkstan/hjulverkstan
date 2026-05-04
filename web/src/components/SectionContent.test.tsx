import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { SectionContent } from './SectionContent';

vi.mock('@hooks/useCurrentLang', () => ({
  useCurrentLang: () => 'en',
}));
vi.mock('@hooks/usePreloadedData', () => ({
  usePreloadedDataLocalized: () => ({ currLang: 'en' }),
}));

describe('SectionContent Component', () => {
  test('should render children', () => {
    // Act
    render(
      <MemoryRouter>
        <SectionContent><p>Child Content</p></SectionContent>
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  test('should render heading when provided', () => {
    // Act
    render(
      <MemoryRouter>
        <SectionContent heading="Section Heading">
          <p>Child</p>
        </SectionContent>
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByRole('heading', { name: 'Section Heading' })).toBeInTheDocument();
  });

  test('should NOT render heading when not provided', () => {
    // Act
    render(
      <MemoryRouter>
        <SectionContent><p>Child</p></SectionContent>
      </MemoryRouter>
    );

    // Assert
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  test('should render link when both linkTo and linkLabel are provided', () => {
    // Act
    render(
      <MemoryRouter>
        <SectionContent heading="Title" linkTo="/go" linkLabel="See all">
          <p>Child</p>
        </SectionContent>
      </MemoryRouter>
    );

    // Assert – two links rendered (one desktop hidden, one mobile hidden)
    const links = screen.getAllByRole('link', { name: /See all/i });
    expect(links.length).toBeGreaterThanOrEqual(1);
    expect(links[0]).toHaveAttribute('href', '/en/go');
  });

  test('should NOT render link when linkTo or linkLabel is missing', () => {
    // Act
    render(
      <MemoryRouter>
        <SectionContent heading="Title" linkTo="/go">
          <p>Child</p>
        </SectionContent>
      </MemoryRouter>
    );

    // Assert
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
