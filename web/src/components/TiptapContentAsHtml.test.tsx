import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { TiptapContentAsHtml } from './TiptapContentAsHtml';
import { JSONContent } from '@tiptap/core';

// Mock the heavy tiptap deps so we don't need a full DOM editor
vi.mock('@tiptap/html', () => ({
  generateHTML: (_content: any, _extensions: any) => '<p>Rendered HTML</p>',
}));

vi.mock('@tiptap/starter-kit', () => ({ default: {} }));

describe('TiptapContentAsHtml Component', () => {
  const mockContent: JSONContent = {
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] }],
  };

  test('should render the generated HTML when content is provided', () => {
    // Act
    render(<TiptapContentAsHtml content={mockContent} />);

    // Assert
    expect(screen.getByText('Rendered HTML')).toBeInTheDocument();
  });

  test('should return null when content is undefined', () => {
    // Act
    const { container } = render(<TiptapContentAsHtml content={undefined} />);

    // Assert
    expect(container).toBeEmptyDOMElement();
  });

  test('should apply custom className to the wrapper', () => {
    // Act
    const { container } = render(
      <TiptapContentAsHtml content={mockContent} className="custom-class" />
    );

    // Assert
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
