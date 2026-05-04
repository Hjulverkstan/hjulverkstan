import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import ConfirmSendNotificationDialog from './ConfirmSendNotificationDialog';

// Mock Dialog sub-components
vi.mock('@components/shadcn/Dialog', () => ({
  DialogContent: ({ children }: any) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogDescription: ({ children }: any) => <div>{children}</div>,
  DialogClose: ({ children }: any) => <>{children}</>,
}));

describe('ConfirmSendNotificationDialog Component', () => {
  test('should render phone number and title', () => {
    // Act
    render(
      <ConfirmSendNotificationDialog 
        phoneNumber="555-1234" 
        onSend={vi.fn()} 
      />
    );

    // Assert
    expect(screen.getByText(/completing this repair will notify the customer/i)).toBeInTheDocument();
    expect(screen.getByText(/555-1234/i)).toBeInTheDocument();
  });

  test('should call onSend when Confirm button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const onSend = vi.fn();

    // Act
    render(<ConfirmSendNotificationDialog phoneNumber="123" onSend={onSend} />);
    await user.click(screen.getByRole('button', { name: /complete & notify/i }));

    // Assert
    expect(onSend).toHaveBeenCalledTimes(1);
  });
});
