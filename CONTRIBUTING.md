# Contributing to lc-trading-services

Thank you for your interest in contributing to lc-trading-services! This guide will help you get started with development in this NX monorepo.

## Development Setup

### Prerequisites

- Node.js v18+ (v20 recommended)
- npm v8+ (v10 recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/Life-Cockpit/lc-trading-services.git
cd lc-trading-services

# Install dependencies
npm install
```

## Workspace Structure

This is a TypeScript monorepo managed by NX. The structure is:

```
lc-trading-services/
├── packages/              # All libraries and applications
│   ├── core/             # Core functionality library
│   └── utils/            # Utility library
├── .nx/                  # NX cache (gitignored)
├── node_modules/         # Dependencies (gitignored)
├── dist/                 # Build output (gitignored)
├── nx.json              # NX workspace configuration
├── package.json         # Root package with scripts
├── tsconfig.base.json   # Base TypeScript config
└── tsconfig.json        # Root TypeScript config
```

## Creating New Libraries

To create a new library:

```bash
npx nx g @nx/js:lib packages/my-library --publishable --importPath=@lc-trading-services/my-library --unitTestRunner=none --bundler=tsc
```

This will:

- Create a new library under `packages/my-library`
- Configure it as a publishable package
- Set up TypeScript compilation
- Update the workspace configuration

## Common Commands

### Building

```bash
# Build all projects
npm run build

# Build a specific project
npx nx build @lc-trading-services/core
```

### Type Checking

```bash
# Type check all projects
npm run typecheck

# Type check a specific project
npx nx typecheck @lc-trading-services/utils
```

### Code Formatting

```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

### Project Graph

```bash
# Visualize project dependencies
npm run graph
```

## Working with Dependencies

### Adding Dependencies Between Packages

To use one package in another, add it to the package's `package.json`:

```json
{
  "dependencies": {
    "@lc-trading-services/core": "*"
  }
}
```

Then run `npm install` to link the packages.

### Adding External Dependencies

```bash
# Add a dependency to a specific package
npm install --workspace=@lc-trading-services/core lodash

# Add a dev dependency to the root
npm install --save-dev eslint
```

## NX Features

### Caching

NX automatically caches build outputs and test results. When you rebuild a project, if nothing has changed, NX will restore the output from cache instantly.

### Dependency Graph

NX understands your project dependencies and builds them in the correct order. When you build a project, all its dependencies are built first.

### Affected Commands

You can run commands only on projects affected by your changes:

```bash
# Build only affected projects
npx nx affected -t build

# Type check only affected projects
npx nx affected -t typecheck
```

## Code Style

- Use TypeScript strict mode (already configured)
- Format code with Prettier (already configured)
- Follow the existing code structure in sample libraries

## Commit Guidelines

- Write clear, descriptive commit messages
- Keep commits focused on a single change
- Reference issue numbers when applicable

## Publishing

This monorepo is configured for publishing packages. To publish:

```bash
# Dry run to see what would be published
npx nx release --dry-run

# Actually publish
npx nx release
```

## Getting Help

- Check the [NX documentation](https://nx.dev)
- Review existing code in `packages/core` and `packages/utils`
- Open an issue for questions or problems

## License

This project is licensed under the MIT License - see the LICENSE file for details.
