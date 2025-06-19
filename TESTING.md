# Testing Setup & Guidelines

## Overview

Comprehensive testing setup for React/Next.js/TypeScript with Jest and React Testing Library.

## Setup Commands

```bash
# Install dependencies
npm install

# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Testing Strategy

### 🎯 Priority 1: Pure Functions (Easy Wins)

- **Validation utilities** (`app/utils/validation.ts`)
- **Image utilities** (`app/utils/imageUtils.ts`)
- **Service layer functions** (`app/services/imageService.ts`)

### 🎯 Priority 2: Business Logic

- **User service** (`lib/userService.ts`) - Mock Vercel Blob
- **API routes** (`app/api/*`) - Integration tests
- **Custom hooks** (`app/hooks/*`) - React Testing Library

### 🎯 Priority 3: Components

- **Core components** with business logic
- **Error boundaries** and edge cases
- **User interactions** and state changes

## Architecture Benefits for Testing

### ✅ Already Well-Separated

```
Pure Functions → Service Layer → Hooks → Components
     ↓              ↓           ↓         ↓
   Unit Tests   Mocked Tests  RTL Tests  E2E Tests
```

### ✅ Dependency Injection Ready

- Services accept parameters (no global access)
- Fetch calls isolated in service layer
- Event bus can be mocked
- Logger can be injected

### ✅ TypeScript Advantages

- Interface-based mocking
- Branded types prevent errors
- Strong typing catches issues early
- No need for complex DI framework

## Test Examples

### Pure Function Test

```typescript
import { validateUserId } from '../app/utils/validation';

test('validates user ID format', () => {
  const result = validateUserId('user_123');
  expect(result.isValid).toBe(true);
});
```

### Service Layer Test

```typescript
import { prepareImageForUpload } from '../app/services/imageService';

jest.mock('../app/utils/validation');
test('prepares image with valid data', () => {
  // Mock validation, test business logic
});
```

### Hook Test

```typescript
import { renderHook } from '@testing-library/react';
import useImageUpload from '../app/hooks/useImageUpload';

test('handles upload state correctly', () => {
  const { result } = renderHook(() => useImageUpload());
  // Test hook behavior
});
```

## Coverage Targets

- **Functions**: 70%+ (business logic)
- **Branches**: 70%+ (error handling)
- **Lines**: 70%+ (core functionality)

## File Structure

```
__tests__/
├── utils/           # Pure function tests
├── services/        # Business logic tests
├── hooks/           # React hook tests
├── components/      # Component tests
└── api/            # API route tests
```

## Mock Strategy

- **Fetch**: Global mock for API calls
- **Next.js**: Router and navigation mocks
- **Vercel Blob**: Mock storage operations
- **Logger**: Mock for test isolation

## Benefits

- **Fast feedback** on business logic
- **Regression prevention** for core features
- **Documentation** through test cases
- **Refactoring confidence** with good coverage
