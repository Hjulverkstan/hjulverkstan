# Playwright E2E Tests

This directory contains end-to-end tests for the application using Playwright, following the Page Object Model (POM) pattern for better maintainability and reusability.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create or update the `.env` file in the project root with your environment variables:
   ```env
   VITE_FRONTEND_URL=https://dev.hjulverkstan.org
   ```
   Replace the URL with your target environment if needed.

## Running Tests

### Basic Commands

- **Run all tests**:
  ```bash
  npx playwright test
  ```

- **Run smoke tests**:
  ```bash
  npx playwright test tests/smoke/
  ```

- **Run a specific test file**:
  ```bash
  npx playwright test tests/smoke/HjulverkstanPortalSmoke.test.ts
  ```

### Debugging

- **Run in headed mode** (opens a browser):
  ```bash
  npx playwright test --headed tests/smoke/
  ```

- **Debug with Playwright Inspector**:
  ```bash
  npx playwright test --debug
  ```

- **Enable debug logs**:
  ```bash
  DEBUG=pw:api npx playwright test tests/smoke/
  ```

### Test Results

- **View HTML report**:
  ```bash
  npx playwright show-report
  ```
  - Location: `playwright-report/index.html`
  - Includes screenshots and traces for failed tests

- **Test artifacts**:
  - Screenshots: `test-results/`
  - Video recordings: `test-results/artifacts/`

## Test Structure

```
tests/
  pages/           # Page Object Models
    LoginPage.ts
    DashboardPage.ts
  smoke/           # Smoke test suites
    HjulverkstanPortalSmoke.test.ts
```

## Writing Tests

### Page Object Model (POM)

We use the Page Object Model pattern to:
- Separate test logic from page-specific code
- Improve test maintenance
- Reduce code duplication
- Make tests more readable

Example page object structure:

```typescript
// pages/LoginPage.ts
import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}
  
  // Locators
  private readonly usernameInput = this.page.getByRole('textbox', { name: 'username' });
  
  // Actions
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    // ... other actions
  }
  
  // Assertions
  async verifyPageLoaded() {
    await expect(this.page.getByRole('heading')).toContainText('Login');
  }
}
```

### Test Guidelines

- **Naming Conventions**:
  - Test files: `*.test.ts` or `*.spec.ts`
  - Page objects: `*Page.ts`
  - Test names: Should describe the expected behavior

- **Best Practices**:
  - One assertion per test
  - Use descriptive test names
  - Keep tests independent
  - Use test fixtures for common setup
  - Follow the Arrange-Act-Assert pattern

- **Selectors**:
  - Prefer user-visible text and ARIA roles
  - Avoid using implementation details like CSS classes
  - Use `data-testid` for elements that lack semantic meaning
