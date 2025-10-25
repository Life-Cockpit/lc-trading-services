# GitHub Copilot Instructions for lc-trading-services

## Project Overview

This is a TypeScript-based monorepo for Life Cockpit trading services, built using Nx. The project follows a workspace structure where libraries are managed under the `libs/` directory and applications under the `apps/` directory, following Nx best practices.

**Tech Stack:**

- **Build Tool:** Nx 22.0.1
- **Language:** TypeScript 5.9.2
- **Module System:** NodeNext (ESM)
- **Compiler:** SWC
- **Package Manager:** npm with workspaces

## Architecture

- Monorepo managed by Nx
- Libraries are located in `libs/*`
- Applications are located in `apps/*`
- Each library can be publishable or buildable
- Uses TypeScript project references for efficient builds
- Strict TypeScript configuration enforced

## Coding Standards

### TypeScript

- **Strict Mode:** All TypeScript code must pass strict type checking
- **Module Resolution:** Use `nodenext` module resolution
- **Target:** ES2022 features are available
- **Isolated Modules:** Each file should be independently compilable
- **No Unused Variables:** Remove unused imports and variables
- **No Implicit Returns:** All code paths in functions must explicitly return values
- **No Fallthrough Cases:** Switch statements must have explicit breaks or returns

### Code Quality

- Use TypeScript's strict compiler options
- Prefer explicit types over implicit ones
- Use async/await for asynchronous operations
- Follow consistent error handling patterns
- Write self-documenting code with clear variable and function names
- Add JSDoc comments for public APIs and complex logic

### Naming Conventions

- **Files:** Use kebab-case for file names (e.g., `trading-service.ts`)
- **Variables/Functions:** Use camelCase (e.g., `getTradingData`)
- **Classes/Interfaces/Types:** Use PascalCase (e.g., `TradingService`, `OrderData`)
- **Constants:** Use UPPER_SNAKE_CASE for true constants (e.g., `MAX_RETRY_COUNT`)
- **Private Members:** Prefix with underscore if needed, or use TypeScript's `private` keyword

## Nx Workspace Guidelines

### Creating New Libraries

Use Nx generators to create new libraries in the `libs/` directory:

```bash
npx nx g @nx/js:lib libs/library-name --publishable --importPath=@lc-trading-services/library-name
```

For applications, use:

```bash
npx nx g @nx/node:application apps/app-name
```

### Building

- Build a specific library or app: `npx nx build <library-name>`
- Build all projects: `npx nx run-many -t build`

### Type Checking

- Type check a library or app: `npx nx typecheck <library-name>`
- Type check all: `npx nx run-many -t typecheck`

### Testing

- When adding new features, include appropriate tests
- Test files should be co-located with source files or in a `__tests__` directory
- Use descriptive test names that explain the expected behavior

## Dependency Management

- Add dependencies to the root `package.json` for shared tooling
- Add library-specific dependencies to individual library's `package.json`
- Use exact versions or tilde (~) for patch updates
- Document why external dependencies are needed

## Project Sync

- Keep TypeScript project references in sync: `npx nx sync`
- Verify sync in CI: `npx nx sync:check`

## Git Workflow

### Commit Messages

Follow conventional commit format:

- `feat(scope): description` - New features
- `fix(scope): description` - Bug fixes
- `docs(scope): description` - Documentation changes
- `refactor(scope): description` - Code refactoring
- `test(scope): description` - Test additions or modifications
- `chore(scope): description` - Build process or auxiliary tool changes

Example: `feat(trading-api): add order execution endpoint`

## Best Practices

- Keep libraries focused and with single responsibility
- Avoid circular dependencies between libraries
- Use barrel exports (index.ts) for public library APIs
- Organize libraries by domain or feature (e.g., `libs/domain/user`, `libs/features/auth`)
- Keep applications in `apps/` directory separate from shared libraries
- Keep configuration files minimal and inherit from base configs
- Document architectural decisions in the README or docs
- Use Nx's dependency graph to visualize and manage dependencies: `npx nx graph`

## Security Considerations

- Never commit secrets or API keys
- Use environment variables for configuration
- Validate all external inputs
- Keep dependencies up to date
- Review security advisories for dependencies

## Documentation

- Update README.md when adding new features, libraries, or applications
- Document public APIs with JSDoc comments
- Include usage examples for complex functionality
- Keep architecture diagrams up to date

## Additional Resources

- [Nx Documentation](https://nx.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Project README](../README.md)
