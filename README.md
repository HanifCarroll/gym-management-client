# Gym Management Application Frontend

A modern, responsive web application for efficient gym management. This frontend project provides an intuitive interface
for gym owners and administrators to manage members, memberships, payments, and check-ins.

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Architecture Overview](#architecture-overview)
4. [Getting Started](#getting-started)
5. [Running the Application](#running-the-application)
6. [Testing](#testing)
7. [Component Structure](#component-structure)
8. [State Management](#state-management)
9. [Styling](#styling)
10. [Code Quality and Formatting](#code-quality-and-formatting)
11. [Performance Considerations](#performance-considerations)
12. [Authentication](#authentication)
13. [API Integration](#api-integration)
14. [Future Improvements](#future-improvements)
15. [License](#license)
16. [Contact Information](#contact-information)

## Features

- Member registration and management
- Membership plan creation and management
- Payment processing with Stripe integration
- Member check-in system

## Technologies Used

- React 18
- Next.js 14 with App Router
- TypeScript
- Material-UI (MUI) for UI components
- React Query for server state management
- Axios for API requests
- Vitest and React Testing Library for testing
- MSW (Mock Service Worker) for API mocking in tests
- Date-fns for date manipulation

## Architecture Overview

This project follows a modified Clean Architecture approach, optimized for frontend development. The application is
built using Next.js 14 with the App Router, enabling efficient server-side rendering and client-side navigation.
The architecture is divided into two main layers:

**Core Business Logic Layer** (located in `src/core`):
This layer contains the heart of the application, free from framework-specific code. It includes:

Entities: Data models representing core business objects
Repositories: Implementations for data access and manipulation
Services: Business logic implementations

**Framework Layer** (located in `src/app`):
This layer contains all the Next.js and React-specific code, including:

- Pages and layouts
- UI components
- Routing logic
- Framework-specific hooks and utilities

This modified architecture promotes:

Clear separation between business logic and framework-specific code
Improved testability of core business logic
Easier maintenance and updates of the UI layer
Flexibility to change or upgrade the frontend framework with minimal impact on business logic

The removal of separate interface definitions simplifies the architecture while maintaining a clear separation of
concerns. This approach balances the benefits of Clean Architecture with the practical needs of frontend development.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (v7 or later)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/gym-management-frontend.git
   ```

2. Navigate to the project directory:

   ```
   cd gym-management-frontend
   ```

3. Install dependencies:
   ```
   npm install
   ```

### Environment Setup

1. Copy the `.env.example` file to `.env.local`:

   ```
   cp .env.example .env.local
   ```

2. Edit `.env.local` and set the required environment variables:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

## Running the Application

To run the application in development mode:

```
npm run dev
```

The application will be available at `http://localhost:3000`.

## Testing

This project uses Vitest for unit and integration testing, along with React Testing Library for component testing.

To run tests:

```
npm test
```

For watch mode:

```
npm run test:watch
```

Our testing strategy includes:

- Unit tests for utility functions and hooks
- Integration tests for complex components
- End-to-end tests for critical user flows

## Component Structure

The application follows a modular component structure:

- `src/app`: Next.js 14 App Router pages and layouts
- `src/core`: Core business logic, entities, and interfaces
- `src/infrastructure`: Implementation of core interfaces, API clients
- `src/ui/components`: Reusable UI components
- `src/ui/hooks`: Custom React hooks for shared logic

## State Management

This application uses a combination of React Query for server state management and local React state (via `useState`
and `useReducer`) for UI state.

React Query provides:

- Automatic caching and refetching
- Easy pagination and infinite scrolling
- Optimistic updates for a smoother user experience

## Styling

Styling is primarily handled through Material-UI (MUI), which provides a consistent and customizable design system.
Custom styling is applied using:

- MUI's `makeStyles` for component-specific styles
- Global styles in `src/app/globals.css`
- Tailwind CSS for utility classes and rapid prototyping

## Code Quality and Formatting

To ensure code quality and consistency, this project uses:

- **Prettier**: For consistent code formatting

  - Configuration in `.prettierrc.js`
  - Run formatter: `npm run format`

- **ESLint**: For static code analysis

  - Configuration in `.eslintrc.js`
  - Run linter: `npm run lint`

- **lint-staged**: For running linters on git staged files

  - Configuration in `package.json`

- **Husky**: For running git hooks
  - Pre-commit hook to run lint-staged

To manually run all checks:

```
npm run validate
```

## Performance Considerations

Performance optimizations include:

- Code splitting and lazy loading using Next.js
- Memoization of expensive computations with `useMemo` and `useCallback`
- Efficient list rendering with virtualization for large datasets
- Image optimization using Next.js Image component

## Authentication

Authentication is handled using JWT (JSON Web Tokens). The authentication flow includes:

- Login page for user credentials
- JWT storage in secure HTTP-only cookies
- Automatic token refresh mechanism
- Protected routes using Higher Order Components (HOCs)

## API Integration

The frontend interacts with the backend API using Axios. API calls are abstracted into service layers, allowing for easy
mocking in tests and flexibility in implementation.

Key aspects of API integration:

- Centralized API client configuration
- Request/response interceptors for common operations (e.g., adding auth headers)
- Error handling and retry logic

## Future Improvements

Planned enhancements for the frontend include:

- Implementing real-time updates using WebSockets
- Adding more data visualization and analytics features
- Enhancing accessibility features
- Implementing a progressive web app (PWA) for offline capabilities

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Contact Information

For any inquiries about this project, please contact:

Your Name
Email: your.email@example.com
LinkedIn: https://www.linkedin.com/in/yourprofile
GitHub: https://github.com/yourusername
