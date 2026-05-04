import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import RichTextEditorDialog from './RichTextEditorDialog';
import { MemoryRouter } from 'react-router-dom';

// Fix MouseEvent reference error in JSDOM
if (typeof MouseEvent === 'undefined') {
  global.MouseEvent = class MouseEvent {} as any;
}

// Mock Dialog sub-components
vi.mock('@components/shadcn/Dialog', () => ({
  DialogContent: ({ children }: any) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children, className }: any) => <h2 className={className}>{children}</h2>,
  DialogDescription: ({ children, className }: any) => <div className={className}>{children}</div>,
  DialogClose: ({ children }: any) => <>{children}</>,
}));

// Mock usePortalSlugs
const mockSlugs = { tailSlug: 'edit', url: '/admin/items' };
vi.mock('@hooks/useSlugs', () => ({
  default: () => mockSlugs,
}));

// Mock Tiptap core
vi.mock('@tiptap/core', () => ({
  Editor: class {},
  ChainedCommands: class {},
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock Tiptap
const mockEditor = {
  getJSON: () => ({ type: 'doc', content: [] }),
  getText: () => 'Some text',
  on: vi.fn(),
  off: vi.fn(),
  chain: () => ({
    focus: () => ({
      run: vi.fn(),
      toggleBold: () => ({ run: vi.fn() }),
    }),
  }),
  isActive: vi.fn(),
  can: () => ({
    toggleBold: () => true,
    toggleItalic: () => true,
    toggleStrike: () => true,
    toggleHeading: () => true,
    toggleBulletList: () => true,
    toggleOrderedList: () => true,
    toggleBlockquote: () => true,
    undo: () => true,
    redo: () => true,
  }),
};

vi.mock('@tiptap/react', () => ({
  useEditor: () => mockEditor,
  EditorContent: () => <div data-testid="tiptap-editor" />,
}));

describe('RichTextEditorDialog Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSlugs.tailSlug = 'edit'; // Default to editable
  });

  test('should render editor and description', () => {
    // Act
    render(
      <MemoryRouter>
        <RichTextEditorDialog content={{}} onSubmit={vi.fn()} />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByTestId('tiptap-editor')).toBeInTheDocument();
    expect(screen.getByText(/using the toolbar and text box bellow/i)).toBeInTheDocument();
  });

  test('should show Edit button instead of toolbar when not in edit/create mode', () => {
    // Arrange
    mockSlugs.tailSlug = 'view';

    // Act
    render(
      <MemoryRouter>
        <RichTextEditorDialog content={{}} onSubmit={vi.fn()} />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /done/i })).not.toBeInTheDocument();
  });

  test('should call navigate to edit when Edit button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    mockSlugs.tailSlug = 'view';

    render(
      <MemoryRouter>
        <RichTextEditorDialog content={{}} onSubmit={vi.fn()} />
      </MemoryRouter>
    );

    // Act
    await user.click(screen.getByRole('button', { name: /edit/i }));

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/admin/items/edit');
  });

  test('should call onSubmit with JSON when Done is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    mockSlugs.tailSlug = 'edit';

    render(
      <MemoryRouter>
        <RichTextEditorDialog content={{}} onSubmit={onSubmit} />
      </MemoryRouter>
    );

    // Act
    await user.click(screen.getByRole('button', { name: /done/i }));

    // Assert
    expect(onSubmit).toHaveBeenCalledWith(expect.any(Object));
  });

  test('should call onSubmit with null if editor is empty', async () => {
    // Arrange
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    mockSlugs.tailSlug = 'edit';
    
    // Mock empty text
    mockEditor.getText = () => '   ';

    render(
      <MemoryRouter>
        <RichTextEditorDialog content={{}} onSubmit={onSubmit} />
      </MemoryRouter>
    );

    // Act
    await user.click(screen.getByRole('button', { name: /done/i }));

    // Assert
    expect(onSubmit).toHaveBeenCalledWith(null);
  });
});
