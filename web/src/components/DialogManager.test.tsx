import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { Provider, useDialogManager } from './DialogManager';

// A helper consumer that lets us call openDialog / closeDialog from a button
const Consumer = () => {
  const { openDialog, closeDialog } = useDialogManager();
  return (
    <>
      <button
        onClick={() => {
          const id = openDialog(<div data-testid="dialog-child">Hello Dialog</div>);
          // expose close for later
          (window as any).__testDialogId = id;
        }}
      >
        Open
      </button>
      <button onClick={() => closeDialog((window as any).__testDialogId)}>Close</button>
    </>
  );
};

// Simple pass-through Dialog mock
vi.mock('@components/shadcn/Dialog', () => ({
  Dialog: ({ open, children }: any) =>
    open ? <div data-testid="radix-dialog">{children}</div> : null,
}));

describe('DialogManager Provider', () => {
  test('should render children without dialog initially', () => {
    // Act
    render(
      <Provider>
        <p>App content</p>
      </Provider>
    );

    // Assert
    expect(screen.getByText('App content')).toBeInTheDocument();
    expect(screen.queryByTestId('radix-dialog')).not.toBeInTheDocument();
  });

  test('should open a dialog with content when openDialog is called', async () => {
    // Arrange
    const user = userEvent.setup();

    // Act
    render(
      <Provider>
        <Consumer />
      </Provider>
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));

    // Assert
    expect(screen.getByTestId('radix-dialog')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-child')).toBeInTheDocument();
  });

  test('should close the dialog when closeDialog is called', async () => {
    // Arrange
    const user = userEvent.setup();

    render(
      <Provider>
        <Consumer />
      </Provider>
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByTestId('radix-dialog')).toBeInTheDocument();

    // Act
    await user.click(screen.getByRole('button', { name: 'Close' }));

    // Assert
    expect(screen.queryByTestId('radix-dialog')).not.toBeInTheDocument();
  });

  test('should throw when useDialogManager is used outside Provider', () => {
    // Arrange
    const BrokenConsumer = () => {
      useDialogManager();
      return null;
    };

    // Assert
    expect(() => render(<BrokenConsumer />)).toThrow(
      'useDialog must be invoked in a descendant for <DialogProvider />'
    );
  });
});
