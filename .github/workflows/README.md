# GitHub Actions Workflows

This directory contains CI/CD pipelines for the lc-trading-services project.

## Workflows

### CI - Test & Build (`ci.yml`)

**Triggers:**
- Push to `main`, `develop`, `feature/**`, or `copilot/**` branches
- Pull requests to `main` or `develop`

**Jobs:**
1. **Test** - Runs all tests with coverage reporting
   - Executes `npx nx run-many -t test --parallel=3 --coverage`
   - Uploads coverage reports to Codecov
   
2. **Build** - Builds all libraries
   - Executes `npx nx run-many -t build --parallel=3`
   - Verifies build artifacts are created
   
3. **Lint** - Code quality checks
   - Runs Prettier formatting check
   - Runs TypeScript type checking

### PR - Quality Check (`pr-check.yml`)

**Triggers:**
- Pull request opened, synchronized, or reopened

**Jobs:**
1. **Affected Tests** - Runs tests only for affected projects
   - Uses NX affected commands for efficient testing
   - Tests only the libraries changed in the PR
   - Comments on PR with test results
   
2. **Security Check** - Security audit
   - Runs `npm audit` to check for vulnerabilities
   - Reports security issues

## Running Tests Locally

Before pushing code, you can run the same checks locally:

```bash
# Run all tests
npx nx run-many -t test

# Run tests with coverage
npx nx run-many -t test --coverage

# Build all libraries
npx nx run-many -t build

# Check formatting
npx prettier --check "libs/**/*.{ts,js,json,md}"

# Type check
npx nx run-many -t typecheck
```

## Running Affected Tests

To test only what you've changed:

```bash
# Test affected projects
npx nx affected -t test

# Build affected projects
npx nx affected -t build
```

## Test Coverage

Coverage reports are automatically uploaded to Codecov when running in CI. You can view detailed coverage reports in the Codecov dashboard linked to your repository.

## Configuration

- **Node.js Version**: 20.x
- **Cache**: npm dependencies are cached for faster builds
- **Parallelization**: Tests and builds run with `--parallel=3` for efficiency
