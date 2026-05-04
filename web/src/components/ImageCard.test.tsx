import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ImageCard } from './ImageCard';

vi.mock('@hooks/useCurrentLang', () => ({
  useCurrentLang: () => 'en',
}));
vi.mock('@hooks/usePreloadedData', () => ({
  usePreloadedDataLocalized: () => ({ currLang: 'en' }),
}));

vi.mock('@components/Card', async () => {
  const actual = await vi.importActual('@components/Card');
  return {
    ...actual as any,
    Image: ({ src, variant }: any) => <img data-testid={`mock-image-${variant}`} src={src} />,
  };
});

describe('ImageCard Component', () => {
  test('should render title, body, and button with correct href', () => {
    // Act
    render(
      <MemoryRouter>
        <ImageCard
          title="Card Title"
          body="Card Body"
          ariaLabel="Go to card"
          link="/go-here"
          linkLabel="Go"
          image="/primary.jpg"
        />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Body')).toBeInTheDocument();
    
    const link = screen.getByRole('link');
    expect(link).toHaveTextContent('Go');
    expect(link).toHaveAttribute('href', '/en/go-here');

    const primaryImage = screen.getByTestId('mock-image-imageBackground');
    expect(primaryImage).toHaveAttribute('src', '/primary.jpg');
  });

  test('should render secondary image when variant is multiple', () => {
    // Act
    render(
      <MemoryRouter>
        <ImageCard
          title="Title"
          body="Body"
          ariaLabel="Label"
          variant="multiple"
          image="/primary.jpg"
          secondaryImage="/secondary.jpg"
          secondImageVariant="fit"
        />
      </MemoryRouter>
    );

    // Assert
    const primaryImage = screen.getByTestId('mock-image-noShadow');
    expect(primaryImage).toHaveAttribute('src', '/primary.jpg');
    
    const secondaryImage = screen.getByTestId('mock-image-fit');
    expect(secondaryImage).toHaveAttribute('src', '/secondary.jpg');
  });

  test('should modify button variant when base variant is brown', () => {
    // Act
    render(
      <MemoryRouter>
        <ImageCard
          title="Title"
          body="Body"
          ariaLabel="Label"
          variant="brown"
        />
      </MemoryRouter>
    );

    // Assert
    const link = screen.getByRole('link');
    // Button gets variant="brownBackground", our component uses buttonVariants
    expect(link.className).toContain('bg-brown');
  });
});
