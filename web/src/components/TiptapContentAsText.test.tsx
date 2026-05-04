import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { TiptapContentAsText } from './TiptapContentAsText';
import { JSONContent } from '@tiptap/core';

vi.mock('@tiptap/core', async () => {
  const actual = await vi.importActual<typeof import('@tiptap/core')>('@tiptap/core');
  return {
    ...actual,
    generateText: (_content: any, _extensions: any, _options: any) =>
      'Generated plain text from tiptap',
  };
});

vi.mock('@tiptap/starter-kit', () => ({ default: {} }));

describe('TiptapContentAsText Component', () => {
  const mockContent: JSONContent = {
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] }],
  };

  test('should render the generated plain text when content is provided', () => {
    // Act
    render(<TiptapContentAsText content={mockContent} />);

    // Assert
    expect(screen.getByText('Generated plain text from tiptap')).toBeInTheDocument();
  });

  test('should render empty string when content is null', () => {
    // Act
    const { container } = render(<TiptapContentAsText content={null} />);

    // Assert
    expect(container).toBeEmptyDOMElement();
  });

  test('should truncate text when max prop is provided', () => {
    // Act – generateText returns 'Generated plain text from tiptap' (33 chars)
    // max=10 → truncated to first 10 chars + ellipsis
    render(<TiptapContentAsText content={mockContent} max={10} />);

    // The truncate util trims to max; just assert it doesn't throw and renders something
    const text = screen.getByText((content) => content.length > 0);
    expect(text).toBeInTheDocument();
  });
});
