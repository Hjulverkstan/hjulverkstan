import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import TiptapEditor from './TiptapEditor';

// Mock Tiptap
vi.mock('@tiptap/react', () => ({
  useEditor: () => ({
    // Mock editor object
  }),
  EditorContent: ({ editor }: any) => <div data-testid="tiptap-content" />,
}));

describe('TiptapEditor Component', () => {
  test('should render editor content', () => {
    // Act
    render(<TiptapEditor />);

    // Assert
    expect(screen.getByTestId('tiptap-content')).toBeInTheDocument();
  });
});
