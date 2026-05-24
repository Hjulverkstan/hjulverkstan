import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useEditorRerender } from '@hooks/useEditorRerender';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const makeEditor = () => ({ on: vi.fn(), off: vi.fn() });

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('useEditorRerender', () => {
  describe('Happy Path — registration', () => {
    it('registers listeners for all three events when a valid editor is provided', () => {
      // Arrange
      const editor = makeEditor();

      // Act
      renderHook(() => useEditorRerender(editor));

      // Assert
      const registeredEvents = editor.on.mock.calls.map(
        ([event]: [string]) => event,
      );
      expect(registeredEvents).toContain('selectionUpdate');
      expect(registeredEvents).toContain('transaction');
      expect(registeredEvents).toContain('update');
      expect(editor.on).toHaveBeenCalledTimes(3);
    });
  });

  describe('Boundary — guard', () => {
    it('does not register any listeners when editor is null', () => {
      // Arrange & Act
      const editor = makeEditor();
      renderHook(() => useEditorRerender(null));

      // Assert
      expect(editor.on).not.toHaveBeenCalled();
    });

    it('does not register any listeners when editor is undefined', () => {
      // Arrange & Act
      const editor = makeEditor();
      renderHook(() => useEditorRerender(undefined));

      // Assert
      expect(editor.on).not.toHaveBeenCalled();
    });
  });

  describe('Cleanup', () => {
    it('unregisters all three listeners when the hook unmounts', () => {
      // Arrange
      const editor = makeEditor();
      const { unmount } = renderHook(() => useEditorRerender(editor));

      // Act
      unmount();

      // Assert
      expect(editor.off).toHaveBeenCalledTimes(3);
      expect(editor.off).toHaveBeenCalledWith(
        'selectionUpdate',
        expect.any(Function),
      );
      expect(editor.off).toHaveBeenCalledWith(
        'transaction',
        expect.any(Function),
      );
      expect(editor.off).toHaveBeenCalledWith('update', expect.any(Function));
    });

    it('cleans up old editor listeners and registers new ones when editor changes', () => {
      // Arrange
      const editor1 = makeEditor();
      const editor2 = makeEditor();
      let currentEditor = editor1;

      const { rerender } = renderHook(() => useEditorRerender(currentEditor));
      expect(editor1.on).toHaveBeenCalledTimes(3);

      // Act
      currentEditor = editor2;
      rerender();

      // Assert
      expect(editor1.off).toHaveBeenCalledTimes(3);
      expect(editor2.on).toHaveBeenCalledTimes(3);
    });
  });

  describe('Core behaviour', () => {
    it('causes a re-render when a registered event callback fires', () => {
      // Arrange
      const editor = makeEditor();
      let renderCount = 0;

      renderHook(() => {
        renderCount++;
        useEditorRerender(editor);
      });

      const registeredCallback = editor.on.mock.calls[0][1];
      expect(renderCount).toBe(1);

      // Act — simulate the editor firing an event
      act(() => registeredCallback());

      // Assert
      expect(renderCount).toBeGreaterThan(1);
    });
  });
});
