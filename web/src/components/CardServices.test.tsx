import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { CardServices, CardServicesSteps } from './CardServices';

vi.mock('@hooks/useCurrentLang', () => ({
  useCurrentLang: () => 'en',
}));
vi.mock('@hooks/usePreloadedData', () => ({
  usePreloadedDataLocalized: () => ({ currLang: 'en' }),
}));

// Provide a mock Dialog context to test dialog mode properly
vi.mock('@components/shadcn/Dialog', () => ({
  DialogClose: ({ children }: any) => <div data-testid="dialog-close">{children}</div>,
  DialogDescription: ({ children, className }: any) => <div data-testid="dialog-desc" className={className}>{children}</div>,
  DialogTitle: ({ children, className }: any) => <div data-testid="dialog-title" className={className}>{children}</div>,
}));

const MockIcon = () => <div data-testid="mock-icon" />;

describe('CardServicesSteps Component', () => {
  test('should render label and description', () => {
    // Act
    render(
      <CardServicesSteps
        icon={MockIcon as any}
        label="Step 1"
        description="Do this first"
      />
    );

    // Assert
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Do this first')).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });
});

describe('CardServices Component', () => {
  test('should render correctly in page mode', () => {
    // Act
    render(
      <MemoryRouter>
        <CardServices
          title="Service Title"
          icon={MockIcon as any}
          footerNote="Optional note"
          linkLabel="Learn more"
          linkDestination="/learn"
          a11yTitle="A11y Title"
          a11yDescription="A11y Desc"
          mode="page"
        >
          <div data-testid="child-content">Child</div>
        </CardServices>
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText('Service Title')).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    expect(screen.getByText('Optional note')).toBeInTheDocument();
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    
    // Link checks
    const link = screen.getByRole('link');
    expect(link).toHaveTextContent('Learn more');
    expect(link).toHaveAttribute('href', '/en/learn');
    
    // Dialog parts should not be present
    expect(screen.queryByTestId('dialog-close')).not.toBeInTheDocument();
    expect(screen.queryByTestId('dialog-title')).not.toBeInTheDocument();
  });

  test('should wrap content in Dialog elements in dialog mode', () => {
    // Act
    render(
      <MemoryRouter>
        <CardServices
          title="Service Title"
          icon={MockIcon as any}
          linkLabel="Close"
          linkDestination="/close"
          a11yTitle="A11y Title"
          a11yDescription="A11y Desc"
          mode="dialog"
        />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByTestId('dialog-close')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-title')).toHaveTextContent('A11y Title');
    expect(screen.getByTestId('dialog-desc')).toHaveTextContent('A11y Desc');
  });
});
