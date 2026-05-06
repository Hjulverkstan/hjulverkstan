import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProtectedByRole, Provider, useAuth } from './Auth';
import * as api from '../data/auth/api';

// Mock the API
vi.mock('../data/auth/api', () => ({
  logIn: vi.fn(),
  logOut: vi.fn(),
  verifyAuth: vi.fn(),
  subscribeToRefreshFailed: vi.fn(),
}));

// Mock useToast
const mockToast = vi.fn();
vi.mock('@components/shadcn/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

// Mock Button
vi.mock('./shadcn/Button', () => ({
  Button: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

// Fix MouseEvent reference error
if (typeof MouseEvent === 'undefined') {
  global.MouseEvent = class MouseEvent {} as any;
}

// A helper consumer to test useAuth
const AuthConsumer = () => {
  const { auth, logIn, logOut, isInitialising, isLoading } = useAuth();
  if (isInitialising)
    return <div data-testid="initialising">Initialising...</div>;
  return (
    <div>
      {auth ? (
        <div data-testid="user-info">User: {auth.username}</div>
      ) : (
        <div data-testid="no-user">No User</div>
      )}
      {isLoading && <div data-testid="loading">Loading...</div>}
      <button onClick={() => logIn('testuser', 'password')}>Login</button>
      <button onClick={() => logOut()}>Logout</button>
    </div>
  );
};

describe('Auth Component & Provider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    // Default mock for verifyAuth to simulate no session
    (api.verifyAuth as any).mockRejectedValue({ status: 401 });
  });

  test('should log error if ProtectedByRole is rendered without auth', async () => {
    // Arrange
    (api.verifyAuth as any).mockRejectedValue({ status: 401 });

    render(
      <MemoryRouter>
        <Provider>
          <ProtectedByRole roles={['admin']} />
        </Provider>
      </MemoryRouter>,
    );

    // Assert
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('authenticated user'),
      );
    });
  });

  test('should initialise and show no user if verification fails', async () => {
    // Act
    render(
      <Provider>
        <AuthConsumer />
      </Provider>,
    );

    // Assert
    expect(screen.getByTestId('initialising')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('initialising')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('no-user')).toBeInTheDocument();
    expect(api.verifyAuth).toHaveBeenCalledTimes(1);
  });

  test('should initialise and show user if verification succeeds', async () => {
    // Arrange
    (api.verifyAuth as any).mockResolvedValue({
      username: 'sessionuser',
      roles: ['admin'],
    });

    // Act
    render(
      <Provider>
        <AuthConsumer />
      </Provider>,
    );

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('user-info')).toHaveTextContent(
        'User: sessionuser',
      );
    });
  });

  test('should update state on successful login', async () => {
    // Arrange
    const user = userEvent.setup();
    (api.logIn as any).mockResolvedValue({
      username: 'newuser',
      roles: ['user'],
    });

    render(
      <Provider>
        <AuthConsumer />
      </Provider>,
    );
    await waitFor(() =>
      expect(screen.queryByTestId('initialising')).not.toBeInTheDocument(),
    );

    // Act
    await user.click(screen.getByRole('button', { name: /login/i }));

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('user-info')).toHaveTextContent(
        'User: newuser',
      );
    });
    expect(api.logIn).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password',
    });
  });

  test('should show toast on failed login', async () => {
    // Arrange
    const user = userEvent.setup();
    (api.logIn as any).mockRejectedValue(new Error('Login failed'));

    render(
      <Provider>
        <AuthConsumer />
      </Provider>,
    );
    await waitFor(() =>
      expect(screen.queryByTestId('initialising')).not.toBeInTheDocument(),
    ); // Wait for initialising to disappear

    // Act
    await user.click(screen.getByRole('button', { name: /login/i }));

    // Assert
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Failed to log in the user.',
        }),
      );
    });
  });

  test('should clear state on logout', async () => {
    // Arrange
    const user = userEvent.setup();
    (api.verifyAuth as any).mockResolvedValue({ username: 'user', roles: [] });
    (api.logOut as any).mockResolvedValue({});

    render(
      <Provider>
        <AuthConsumer />
      </Provider>,
    );
    await waitFor(() =>
      expect(screen.getByTestId('user-info')).toBeInTheDocument(),
    );

    // Act
    await user.click(screen.getByRole('button', { name: /logout/i }));

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('no-user')).toBeInTheDocument();
    });
    expect(api.logOut).toHaveBeenCalled();
  });

  test('should show toast on failed logout', async () => {
    // Arrange
    const user = userEvent.setup();
    (api.verifyAuth as any).mockResolvedValue({ username: 'user', roles: [] });
    (api.logOut as any).mockRejectedValue(new Error('Logout failed'));

    render(
      <Provider>
        <AuthConsumer />
      </Provider>,
    );
    await waitFor(() =>
      expect(screen.getByTestId('user-info')).toBeInTheDocument(),
    );

    // Act
    await user.click(screen.getByRole('button', { name: /logout/i }));

    // Assert
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Failed to log out the user.',
        }),
      );
    });
  });

  test('should verify again on refreshSuccess', async () => {
    // Arrange
    (api.verifyAuth as any)
      .mockRejectedValueOnce({ refreshSuccess: true })
      .mockResolvedValueOnce({ username: 'refreshed', roles: [] });

    // Act
    render(
      <Provider>
        <AuthConsumer />
      </Provider>,
    );

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('user-info')).toHaveTextContent(
        'User: refreshed',
      );
    });
    expect(api.verifyAuth).toHaveBeenCalledTimes(2);
  });

  test('should handle refresh failed subscription', async () => {
    // Arrange
    let refreshFailedCb: any;
    (api.subscribeToRefreshFailed as any).mockImplementation((cb: any) => {
      refreshFailedCb = cb;
    });

    render(
      <Provider>
        <AuthConsumer />
      </Provider>,
    );
    await waitFor(() =>
      expect(screen.queryByTestId('initialising')).not.toBeInTheDocument(),
    );

    // Act: simulate refresh failure
    refreshFailedCb();

    // Assert
    expect(screen.getByTestId('no-user')).toBeInTheDocument();
  });

  test('should show loading state during login', async () => {
    // Arrange
    const user = userEvent.setup();
    let resolveLogin: any;
    (api.logIn as any).mockReturnValue(
      new Promise((resolve) => {
        resolveLogin = resolve;
      }),
    );

    render(
      <Provider>
        <AuthConsumer />
      </Provider>,
    );
    await waitFor(() =>
      expect(screen.queryByTestId('initialising')).not.toBeInTheDocument(),
    );

    // Act
    await user.click(screen.getByRole('button', { name: /login/i }));

    // Assert
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    // Cleanup
    resolveLogin({ username: 'test', roles: [] });
    await waitFor(() =>
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument(),
    );
  });

  describe('ProtectedByRole', () => {
    test('should render content if user has ALL required roles', async () => {
      // Arrange
      (api.verifyAuth as any).mockResolvedValue({
        username: 'admin',
        roles: ['admin', 'user'],
      });

      render(
        <MemoryRouter>
          <Provider>
            <ProtectedByRole roles={['admin', 'user']}>
              <div data-testid="protected-content">Secret Content</div>
            </ProtectedByRole>
          </Provider>
        </MemoryRouter>,
      );

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      });
    });

    test('should NOT render content if user has only some of the required roles', async () => {
      // Arrange
      (api.verifyAuth as any).mockResolvedValue({
        username: 'admin',
        roles: ['admin'],
      });

      render(
        <MemoryRouter>
          <Provider>
            <ProtectedByRole roles={['admin', 'superadmin']}>
              <div data-testid="protected-content">Secret Content</div>
            </ProtectedByRole>
          </Provider>
        </MemoryRouter>,
      );

      // Assert
      await waitFor(() => {
        expect(api.verifyAuth).toHaveBeenCalled();
      });
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    test('should render content if user has required roles (single)', async () => {
      // Arrange
      (api.verifyAuth as any).mockResolvedValue({
        username: 'admin',
        roles: ['admin'],
      });

      render(
        <MemoryRouter>
          <Provider>
            <ProtectedByRole roles={['admin']}>
              <div data-testid="protected-content">Secret Content</div>
            </ProtectedByRole>
          </Provider>
        </MemoryRouter>,
      );

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      });
    });

    test('should render Outlet if no children provided', async () => {
      // Arrange
      (api.verifyAuth as any).mockResolvedValue({
        username: 'admin',
        roles: ['admin'],
      });

      render(
        <MemoryRouter initialEntries={['/protected']}>
          <Provider>
            <Routes>
              <Route
                path="/protected"
                element={<ProtectedByRole roles={['admin']} />}
              >
                <Route
                  index
                  element={
                    <div data-testid="outlet-content">Outlet Content</div>
                  }
                />
              </Route>
            </Routes>
          </Provider>
        </MemoryRouter>,
      );

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
      });
    });

    test('should return null if no access and no landing page/redirect', async () => {
      // Arrange
      (api.verifyAuth as any).mockResolvedValue({
        username: 'user',
        roles: ['user'],
      });

      const { container } = render(
        <MemoryRouter>
          <Provider>
            <ProtectedByRole roles={['admin']} />
          </Provider>
        </MemoryRouter>,
      );

      // Assert
      await waitFor(() => {
        expect(api.verifyAuth).toHaveBeenCalled();
      });
      expect(container.firstChild).toBeNull();
    });

    test('should go back when clicking button in landing page', async () => {
      // Arrange
      const user = userEvent.setup();
      (api.verifyAuth as any).mockResolvedValue({
        username: 'user',
        roles: ['user'],
      });

      render(
        <MemoryRouter>
          <Provider>
            <ProtectedByRole roles={['admin']} renderLandingPage />
          </Provider>
        </MemoryRouter>,
      );

      // Act
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /go back/i }),
        ).toBeInTheDocument();
      });
      await user.click(screen.getByRole('button', { name: /go back/i }));

      // Assert
    });
  });

  test('should throw error if useAuth is used outside of Provider', () => {
    // Hide console.error for this test as React logs the boundary error
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const ComponentOutside = () => {
      useAuth();
      return null;
    };

    expect(() => render(<ComponentOutside />)).toThrow(
      'useAuth must be invoked',
    );
  });
});
