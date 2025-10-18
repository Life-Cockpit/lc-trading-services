# Quick Reference

## Project Information

- **Workspace**: lc-trading-services
- **Type**: TypeScript Monorepo
- **Build System**: NX v21.6.5
- **Package Manager**: npm with workspaces
- **TypeScript**: v5.9.2 (strict mode enabled)

## Example Packages

### @lc-trading-services/core

Location: `packages/core`
A core library that provides basic functionality.

### @lc-trading-services/utils

Location: `packages/utils`
A utilities library that depends on the core library.

## Quick Commands

```bash
# Install dependencies
npm install

# Build all projects
npm run build

# Type check all projects
npm run typecheck

# Format code
npm run format

# Check formatting
npm run format:check

# View dependency graph
npm run graph

# Create a new library
npx nx g @nx/js:lib packages/new-lib --publishable --importPath=@lc-trading-services/new-lib --unitTestRunner=none --bundler=tsc

# Build a specific project
npx nx build @lc-trading-services/core

# Run affected builds
npx nx affected -t build

# Show project info
npx nx show project @lc-trading-services/core

# List all projects
npx nx show projects
```

## File Structure

```
.
├── packages/                    # All libraries and applications
│   ├── core/                   # Core library
│   │   ├── src/
│   │   │   ├── index.ts       # Entry point
│   │   │   └── lib/           # Library code
│   │   ├── package.json       # Package configuration
│   │   ├── tsconfig.json      # TypeScript config
│   │   └── tsconfig.lib.json  # Library TypeScript config
│   └── utils/                  # Utils library (depends on core)
│       └── ... (same structure)
├── .nx/                        # NX cache (gitignored)
├── .vscode/                    # VSCode settings
├── .verdaccio/                 # Local npm registry config
├── node_modules/               # Dependencies (gitignored)
├── CONTRIBUTING.md             # Development guidelines
├── README.md                   # Main documentation
├── nx.json                     # NX configuration
├── package.json                # Root package config
├── tsconfig.base.json          # Base TypeScript config
└── tsconfig.json               # Root TypeScript config
```

## TypeScript Configuration

The workspace uses strict TypeScript configuration:

- Target: ES2022
- Module: NodeNext
- Strict mode enabled
- Composite projects for incremental builds
- Declaration maps for better debugging

## NX Features Enabled

- **Smart Caching**: Builds are cached and reused
- **Dependency Graph**: Automatic dependency tracking
- **Task Pipeline**: Dependencies built in correct order
- **Affected Commands**: Run tasks only on changed projects
- **Code Generation**: Scaffolding for new libraries
- **Workspace Analysis**: Visual dependency graph

## Publishing

The workspace is configured for publishing packages:

```bash
# Dry run
npx nx release --dry-run

# Publish
npx nx release
```

## Resources

- [NX Documentation](https://nx.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [npm Workspaces](https://docs.npmjs.com/cli/v10/using-npm/workspaces)
