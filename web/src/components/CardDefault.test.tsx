import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CardDefault } from './CardDefault';

vi.mock('@hooks/useCurrentLang', () => ({
  useCurrentLang: () => 'en',
}));

vi.mock('@hooks/usePreloadedData', () => ({
  usePreloadedDataLocalized: () => ({ currLang: 'en' }),
}));

const MockIcon = () => <div data-testid="mock-icon" />;

describe('CardDefault Component', () => {
  test('should render the title, body, and linkLabel correctly', () => {
    // Arrange
    const title = 'Test Default Title';
    const body = 'Test Default Body';
    const linkLabel = 'Read Full Story';
    const link = '/read-more';

    // Act
    render(
      <MemoryRouter>
        <CardDefault
          title={title}
          body={body}
          linkLabel={linkLabel}
          link={link}
        />
      </MemoryRouter>,
    );

    // Assert
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(body)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Read more/i })).toHaveTextContent(
      linkLabel,
    );
  });

  test('should render without crashing when no icon is provided', () => {
    // Act
    render(
      <MemoryRouter>
        <CardDefault title="Title" body="Body" />
      </MemoryRouter>,
    );

    // Assert
    expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
  });

  test('should render icon when provided', () => {
    // Act
    render(
      <MemoryRouter>
        <CardDefault title="Title" body="Body" icon={MockIcon as any} />
      </MemoryRouter>,
    );

    // Assert
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  test('should fire onClick event', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClickMock = vi.fn();

    // Act
    render(
      <MemoryRouter>
        <CardDefault title="Title" body="Body" onClick={onClickMock} />
      </MemoryRouter>,
    );

    const button = screen.getByRole('link');
    await user.click(button);

    // Assert
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
