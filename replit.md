# Overview

This is a 3D interactive bedroom exploration application built with React Three Fiber. The application creates an immersive first-person view where users can look around a virtual bedroom by rotating the camera between three distinct viewing angles: left (window & desk), center (TV), and right (door). The experience features smooth camera transitions, interactive controls via keyboard or mouse dragging, and a game-like UI overlay showing the current view and available controls.

The application uses a modern web stack with React for UI management, Three.js (via React Three Fiber) for 3D rendering, and includes infrastructure for audio management and game state tracking. The backend is set up with Express.js and configured for PostgreSQL database integration using Drizzle ORM, though the current implementation uses in-memory storage.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**3D Rendering Engine**: The application uses React Three Fiber as the primary 3D rendering solution, which provides a React-friendly wrapper around Three.js. This allows declarative 3D scene composition with React components while leveraging the full power of Three.js for WebGL rendering.

- **Rationale**: React Three Fiber enables component-based 3D development, making it easier to manage complex 3D scenes with React's familiar patterns
- **Benefits**: Better integration with React ecosystem, easier state management, component reusability
- **Trade-offs**: Slightly higher learning curve than vanilla Three.js, small performance overhead from React reconciliation

**Camera Control System**: Implements a custom camera controller that supports both keyboard inputs (arrow keys/WASD) and mouse dragging for rotating the view between three preset angles (±60° and center).

- **Rationale**: Provides intuitive navigation that works across different input devices
- **Implementation**: Uses Zustand store for camera state management, ensuring smooth transitions and preventing conflicts between input methods
- **Benefits**: Responsive controls, smooth animations, accessible on both desktop and mobile

**State Management**: Uses Zustand for global state management with separate stores for game state (`useGame`), bedroom navigation (`useBedroomGame`), and audio controls (`useAudio`).

- **Rationale**: Zustand provides a minimal, hook-based API that's simpler than Redux while still being powerful enough for complex state
- **Benefits**: No boilerplate, TypeScript-friendly, excellent React integration, built-in selectors prevent unnecessary re-renders
- **Trade-offs**: Less ecosystem tooling compared to Redux

**UI Layer**: Implements a shadcn/ui-based component library with Radix UI primitives and Tailwind CSS for styling.

- **Rationale**: Provides accessible, customizable components that maintain consistent design while allowing full styling control
- **Benefits**: Accessibility built-in, highly customizable, no runtime CSS-in-JS overhead
- **Structure**: UI components are separated from 3D components, with overlays rendered outside the Canvas context

## Backend Architecture

**Server Framework**: Express.js configured as an ESM module with Vite integration for development hot-reloading.

- **Rationale**: Express provides a minimal, flexible foundation for API endpoints while Vite enables fast development iteration
- **Development Setup**: Vite middleware mode allows serving the React app and API from a single server during development
- **Production Build**: Uses esbuild to bundle the server code for production deployment

**Storage Abstraction Layer**: Implements an `IStorage` interface with an in-memory implementation (`MemStorage`), designed to be swappable with a database-backed implementation.

- **Rationale**: Separates business logic from data persistence, making it easy to switch storage backends
- **Current Implementation**: `MemStorage` stores users in a JavaScript Map for development/testing
- **Future Migration Path**: Ready to swap with Drizzle ORM-based PostgreSQL implementation without changing API routes
- **Benefits**: Clean separation of concerns, easier testing, flexible deployment options

**API Structure**: Routes are registered through a centralized `registerRoutes` function that returns the HTTP server instance.

- **Pattern**: All API routes should use `/api` prefix for clear separation from static assets
- **Current State**: Placeholder implementation ready for CRUD endpoints
- **Design**: Expects route handlers to use the storage interface for data operations

## Build System

**Vite Configuration**: Custom Vite setup with path aliases, GLSL shader support, and special handling for 3D assets (GLTF/GLB models, audio files).

- **Client Build**: Outputs to `dist/public` with React plugin and runtime error overlay for development
- **Server Build**: Uses esbuild to bundle server code to `dist/index.js` with external packages
- **Asset Pipeline**: Configured to handle large 3D model files and audio formats
- **Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/` for cross-environment imports

## External Dependencies

**Database**: Configured for PostgreSQL via Neon's serverless driver (`@neondatabase/serverless`), using Drizzle ORM for schema management and type-safe queries.

- **Schema Location**: `shared/schema.ts` defines database tables with Drizzle
- **Migration System**: Drizzle Kit configured to output migrations to `./migrations`
- **Connection**: Requires `DATABASE_URL` environment variable
- **Current Usage**: Schema defined but using in-memory storage; ready for database activation

**3D Graphics Libraries**:
- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Useful helpers and abstractions for R3F (camera controls, loaders, etc.)
- `@react-three/postprocessing` - Post-processing effects for enhanced visuals
- `three` - Core 3D library (peer dependency)
- `vite-plugin-glsl` - GLSL shader import support

**UI Component System**:
- `@radix-ui/*` - Headless UI primitives for accessibility
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` - Type-safe component variants
- Extensive component library in `client/src/components/ui/`

**Data Fetching**: TanStack Query (`@tanstack/react-query`) configured with custom fetch wrapper for API requests.

- **Configuration**: Disabled automatic refetching, infinite stale time by default
- **Custom Hooks**: `getQueryFn` provides standardized error handling and 401 unauthorized behavior
- **API Helper**: `apiRequest` function wraps fetch with JSON handling and error checking

**Font System**: Uses Fontsource for self-hosted Inter font, avoiding external CDN requests.