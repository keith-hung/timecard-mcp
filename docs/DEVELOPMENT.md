# TimeCard MCP Development Guide

This guide is for developers who want to understand, modify, or extend TimeCard MCP.

## 📋 Table of Contents

- [Development Setup](#development-setup)
- [Architecture Overview](#architecture-overview)
- [Code Structure](#code-structure)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Contributing](#contributing)
- [Building & Packaging](#building--packaging)

---

## Development Setup

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn
- Git
- Chrome/Chromium browser
- Access to a TimeCard system for testing

### Local Development Environment

```bash
# Clone and setup
git clone https://github.com/your-org/timecard-mcp.git
cd timecard-mcp

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium

# Create development environment file
cp .env.example .env

# Edit .env with your test credentials
vim .env
```

### Development Scripts

```bash
# Build the project
npm run build

# Development mode with hot reload
npm run dev

# Run in development mode
npm start

# Test the MCP server
npm test

# Lint code
npm run lint

# Format code
npm run format
```

### Environment Configuration

**Development `.env` file:**

```bash
# Development credentials
TIMECARD_USERNAME=dev_username
TIMECARD_PASSWORD=dev_password
TIMECARD_BASE_URL=http://localhost:3000/app/

# Development settings
LOG_LEVEL=debug
NODE_ENV=development

# Browser debugging
BROWSER_HEADLESS=false
BROWSER_DEVTOOLS=true
```

## Architecture Overview

### High-Level Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   MCP Client    │───▶│   TimeCard MCP   │───▶│  TimeCard Web   │
│  (Claude, etc)  │    │     Server       │    │    Application  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   Playwright     │
                       │   Browser        │
                       └──────────────────┘
```

### Core Components

#### 1. MCP Server (`src/index.ts`)

- Entry point and MCP protocol handler
- Tool registration and routing
- Error handling and logging
- Session lifecycle management

#### 2. Session Management (`src/timecard-session.ts`)

- Browser automation orchestration
- Authentication and session persistence
- Navigation and state management
- Automatic cleanup and recovery

#### 3. Tool Categories (`src/tools/`)

- **Authentication** (`auth-tools.ts`) - Login, logout, session management
- **Data Operations** (`data-tools.ts`) - Projects, activities, timesheet retrieval
- **Timesheet Operations** (`timesheet-tools.ts`) - Entry manipulation, hours, notes
- **Management** (`management-tools.ts`) - Save, validate, summarize

#### 4. Utilities (`src/utils/`)

- **Error Handling** (`errors.ts`) - Custom error types and handling
- **Logging** (`logger.ts`) - Structured logging and debugging

### Data Flow

```
1. MCP Client Request
   │
   ▼
2. Tool Validation & Routing
   │
   ▼
3. Session Authentication Check
   │
   ▼
4. Browser Automation
   │
   ▼
5. TimeCard Web Interaction
   │
   ▼
6. Response Processing
   │
   ▼
7. MCP Client Response
```

## Code Structure

### Project Layout

```
src/
├── index.ts                 # MCP server entry point
├── timecard-session.ts      # Session management
├── tools/                   # MCP tool implementations
│   ├── index.ts            # Tool type definitions
│   ├── auth-tools.ts       # Authentication tools
│   ├── data-tools.ts       # Data retrieval tools
│   ├── timesheet-tools.ts  # Timesheet manipulation
│   └── management-tools.ts # Management operations
└── utils/                   # Utility modules
    ├── index.ts            # Utility exports
    ├── errors.ts           # Error handling
    └── logger.ts           # Logging utilities
```

### Key Interfaces

#### MCPTool Interface

```typescript
interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
  handler: (
    args: Record<string, any>,
    session: TimeCardSession
  ) => Promise<any>;
}
```

#### Session Interface

```typescript
interface TimeCardSessionInfo {
  authenticated: boolean;
  username?: string;
  sessionStartTime?: Date;
  currentUrl?: string;
}
```

### Error Handling

**Custom Error Types:**

```typescript
enum TimeCardErrorCode {
  AUTHENTICATION_FAILED = "AUTHENTICATION_FAILED",
  SESSION_EXPIRED = "SESSION_EXPIRED",
  INVALID_PROJECT = "INVALID_PROJECT",
  INVALID_ACTIVITY = "INVALID_ACTIVITY",
  BROWSER_ERROR = "BROWSER_ERROR",
  TIMEOUT_ERROR = "TIMEOUT_ERROR",
}

class TimeCardError extends Error {
  constructor(
    public readonly code: TimeCardErrorCode,
    message: string,
    public readonly details?: Record<string, any>
  ) {
    super(message);
    this.name = "TimeCardError";
  }
}
```

## API Reference

### Authentication Tools

#### `timecard_login`

Establishes a session with the TimeCard system.

```typescript
// Input
{
  username?: string,  // Optional if env var set
  password?: string   // Optional if env var set
}

// Output
{
  success: boolean,
  message: string
}
```

#### `timecard_check_session`

Validates current session status.

```typescript
// Output
{
  authenticated: boolean,
  username?: string,
  session_time?: string,
  current_url?: string
}
```

### Data Tools

#### `timecard_get_projects`

Retrieves available projects for the user.

```typescript
// Output
{
  projects: Array<{
    id: string,
    name: string,
    description: string
  }>,
  count: number
}
```

#### `timecard_get_activities`

Gets activities for a specific project.

```typescript
// Input
{
  project_id: string
}

// Output
{
  project_id: string,
  activities: Array<{
    id: string,
    name: string,
    description: string
  }>,
  count: number
}
```

### Timesheet Tools

#### `timecard_set_timesheet_entry`

Sets project and activity for a timesheet entry.

```typescript
// Input
{
  entry_index: number,  // 0-9
  project_id: string,
  activity_id: string
}

// Output
{
  success: boolean,
  entry_index: number,
  project_name: string,
  activity_name: string
}
```

#### `timecard_set_daily_hours`

Sets hours for a specific day and entry.

```typescript
// Input
{
  entry_index: number,  // 0-9
  day: string,         // "monday", "0", "2025-07-07"
  hours: number
}

// Output
{
  success: boolean,
  entry_index: number,
  day: string,
  day_index: number,
  hours: number
}
```

### Management Tools

#### `timecard_save_timesheet`

Permanently saves all timesheet changes.

```typescript
// Output
{
  success: boolean,
  message: string,
  timestamp: string,
  current_url: string
}
```

## Testing

### Test Structure

```
tests/
├── unit/                    # Unit tests
│   ├── session.test.ts     # Session management tests
│   ├── tools.test.ts       # Individual tool tests
│   └── utils.test.ts       # Utility function tests
├── integration/             # Integration tests
│   ├── auth-flow.test.ts   # Authentication flow
│   ├── timesheet.test.ts   # End-to-end timesheet operations
│   └── error-handling.test.ts
└── fixtures/                # Test data and mocks
    ├── mock-timecard.ts    # Mock TimeCard responses
    └── test-data.json      # Sample test data
```

### Running Tests

```bash
# Run all tests (MCP server functionality)
npm test

# Run URL logic tests
npm run test:url

# Run specific test suite
npm test -- --grep "authentication"

# Run with coverage
npm run test:coverage

# Run integration tests
npm run test:integration

# Run tests in watch mode
npm run test:watch
```

### Testing with npx (after publishing)

If the package is published to npm, you can test the `npx` command directly:

```bash
# Ensure environment variables are set (e.g., TIMECARD_USERNAME, TIMECARD_PASSWORD, TIMECARD_BASE_URL)
# Example: export TIMECARD_USERNAME="test_user"

# Run the MCP server using npx
npx timecard-mcp
```

If the package is not published, but you want to test the `npx` command from a Git repository:

```bash
# Ensure environment variables are set
# Example: export TIMECARD_USERNAME="test_user"

# Run the MCP server directly from the Git repository
npx git+https://github.com/your-org/timecard-mcp.git
```

### Test Configuration

**Jest configuration** (`jest.config.js`):

```javascript
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  testMatch: ["**/*.test.ts"],
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/index.ts"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Mock Setup

**Playwright Mock:**

```typescript
// tests/fixtures/mock-timecard.ts
import { Page } from "playwright";

export class MockTimeCardPage {
  constructor(private page: Page) {}

  async mockLogin(success: boolean = true) {
    await this.page.route("**/login", (route) => {
      if (success) {
        route.fulfill({
          status: 302,
          headers: { Location: "/dashboard" },
        });
      } else {
        route.fulfill({
          status: 401,
          body: "Authentication failed",
        });
      }
    });
  }

  async mockProjectsAPI(projects: any[]) {
    await this.page.route("**/api/projects", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ projects }),
      });
    });
  }
}
```

## Contributing

### Development Workflow

1. **Fork & Clone**

   ```bash
   git clone https://github.com/your-username/timecard-mcp.git
   cd timecard-mcp
   git remote add upstream https://github.com/original-org/timecard-mcp.git
   ```

2. **Create Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Develop & Test**

   ```bash
   npm run dev
   npm test
   npm run lint
   ```

4. **Commit Changes**

   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push & Pull Request**
   ```bash
   git push origin feature/your-feature-name
   # Create PR on GitHub
   ```

### Code Standards

**TypeScript Configuration:**

- Strict mode enabled
- ESLint with TypeScript rules
- Prettier for formatting
- Pre-commit hooks for quality checks

**Commit Convention:**

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation updates
- `refactor:` Code refactoring
- `test:` Test additions/updates
- `chore:` Maintenance tasks

### Adding New Tools

1. **Create tool implementation:**

   ```typescript
   // src/tools/new-feature-tools.ts
   import { MCPTool } from "./index.js";
   import { TimeCardSession } from "../timecard-session.js";

   const newFeatureTool: MCPTool = {
     name: "timecard_new_feature",
     description: "Description of new feature",
     inputSchema: {
       type: "object",
       properties: {
         parameter: {
           type: "string",
           description: "Parameter description",
         },
       },
       required: ["parameter"],
     },
     handler: async (args, session: TimeCardSession) => {
       // Implementation
       return { success: true };
     },
   };

   export const newFeatureTools: MCPTool[] = [newFeatureTool];
   ```

2. **Register tool:**

   ```typescript
   // src/index.ts
   import { newFeatureTools } from "./tools/new-feature-tools.js";

   const allTools = [
     ...authTools,
     ...dataTools,
     ...timesheetTools,
     ...managementTools,
     ...newFeatureTools, // Add here
   ];
   ```

3. **Add tests:**

   ```typescript
   // tests/unit/new-feature-tools.test.ts
   import { newFeatureTools } from "../../src/tools/new-feature-tools";

   describe("New Feature Tools", () => {
     test("should handle new feature", async () => {
       // Test implementation
     });
   });
   ```

## Building & Packaging

### Build Process

```bash
# Clean previous builds
npm run clean

# Compile TypeScript
npm run build

# Verify build
node dist/index.js --version

# Create distribution package
npm pack
```

### Build Configuration

**TypeScript configuration** (`tsconfig.json`):

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### Distribution

**Package structure:**

```
timecard-mcp-1.0.0.tgz
├── dist/           # Compiled JavaScript
├── package.json    # Package metadata
├── README.md       # Usage documentation
├── DEPLOYMENT.md   # Deployment guide
└── LICENSE         # License file
```

**NPM publishing:**

```bash
# Version bump
npm version patch|minor|major

# Publish to registry
npm publish

# Tag release
git tag v1.0.0
git push origin v1.0.0
```

---

## Performance Considerations

### Browser Optimization

- Session reuse to avoid repeated logins
- Efficient element selection strategies
- Memory cleanup after operations
- Connection pooling for multiple sessions

### Error Recovery

- Automatic retry mechanisms
- Graceful degradation on failures
- Session restoration after timeouts
- Browser crash recovery

### Monitoring

- Performance metrics collection
- Error rate tracking
- Session duration monitoring
- Resource usage alerts

---

## Debugging

### Debug Mode

```bash
# Enable debug logging
DEBUG=timecard:* npm start

# Browser debugging
BROWSER_HEADLESS=false BROWSER_DEVTOOLS=true npm start

# Playwright debugging
DEBUG=pw:* npm start
```

### Common Debug Scenarios

**Authentication Issues:**

```typescript
// Add debug logging to auth tools
console.log("Login attempt:", { username, baseUrl });
console.log("Page URL after login:", page.url());
console.log("Page title:", await page.title());
```

**Element Selection:**

```typescript
// Debug element selection
const element = page.locator(selector);
console.log("Element count:", await element.count());
console.log("Element visible:", await element.isVisible());
await element.screenshot({ path: "debug-element.png" });
```

---

For technical support or architecture questions, please check the existing issues or create a new one with the "development" label.
