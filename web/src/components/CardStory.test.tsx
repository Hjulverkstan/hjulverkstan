import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { CardStory } from './CardStory';
import { Story } from '@data/webedit/story/types';

vi.mock('@hooks/useCurrentLang', () => ({
  useCurrentLang: () => 'en',
}));
vi.mock('@hooks/usePreloadedData', () => ({
  usePreloadedDataLocalized: () => ({ currLang: 'en' }),
}));

vi.mock('@components/TiptapContentAsText', () => ({
  TiptapContentAsText: () => <div data-testid="mock-tiptap-text" />,
}));
vi.mock('@components/Card', async () => {
  const actual = await vi.importActual('@components/Card');
  return {
    ...actual as any,
    Image: ({ src, alt }: any) => <img data-testid="mock-image" src={src} alt={alt} />,
  };
});

describe('CardStory Component', () => {
  const mockStory = {
    title: 'Amazing Journey',
    slug: 'amazing-journey',
    imageURL: '/journey.jpg',
    bodyText: 'Some rich text body content',
  } as unknown as Story;

  test('should mock TiptapContentAsText and validate title/image/link', () => {
    // Act
    render(
      <MemoryRouter>
        <CardStory story={mockStory} />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText('Amazing Journey')).toBeInTheDocument();
    
    const img = screen.getByTestId('mock-image');
    expect(img).toHaveAttribute('src', '/journey.jpg');
    expect(img).toHaveAttribute('alt', 'Amazing Journey');

    expect(screen.getByTestId('mock-tiptap-text')).toBeInTheDocument();

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/en/stories/amazing-journey');
  });
});
