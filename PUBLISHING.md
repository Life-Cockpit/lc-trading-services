# Publishing Guide

This guide explains how to publish packages from this monorepo to NPM.

## Overview

This monorepo uses **independent versioning** for each library and application. Each package can be versioned and published separately, allowing for flexible release management.

### Key Features

- ✅ **Independent Versions**: Each package has its own version number
- ✅ **Selective Publishing**: Publish only the packages that changed
- ✅ **Dedicated Tags**: Each package uses its own git tag format
- ✅ **Automated Publishing**: GitHub Actions handles the publishing workflow

## Package Structure

Packages are organized in two directories:

- `libs/`: Shared libraries that can be published to NPM
- `apps/`: Applications that can be published to NPM (when created)

Each package has its own `package.json` with:
- Unique package name (e.g., `@lc-trading-services/trading-data-client`)
- Independent version number
- Publishing configuration

## Publishing a Package

### Prerequisites

1. **NPM Access**: Ensure you have publish permissions for the `@lc-trading-services` scope
2. **GitHub Secrets**: The `NPM_TOKEN` secret must be configured in the repository

### Publishing Process

Publishing is automated via GitHub Actions. To publish a package:

1. **Ensure all changes are committed and merged to `main`**

2. **Create a version tag** following the format: `<package-name>-v<version>`

   ```bash
   # For trading-data-client library
   git tag trading-data-client-v0.1.0
   git push origin trading-data-client-v0.1.0
   ```

3. **GitHub Actions will automatically**:
   - Extract the package name and version from the tag
   - Install dependencies
   - Update the package version in `package.json`
   - Run tests for the specific package
   - Build the specific package
   - Publish to NPM with provenance
   - Create a GitHub release

### Tag Format

Tags must follow this format: `<package-name>-v<version>`

**Examples:**
- `trading-data-client-v0.1.0` - Publish trading-data-client version 0.1.0
- `trading-data-client-v1.2.3-beta.1` - Publish pre-release version
- `my-new-lib-v2.0.0` - Publish a different library version 2.0.0

**Invalid formats:**
- `v0.1.0` - Missing package name
- `trading-data-client-0.1.0` - Missing 'v' prefix
- `0.1.0` - Missing both package name and 'v' prefix

### Semantic Versioning

Follow [Semantic Versioning](https://semver.org/) principles:

- **MAJOR** (x.0.0): Breaking changes
- **MINOR** (0.x.0): New features (backward compatible)
- **PATCH** (0.0.x): Bug fixes (backward compatible)

**Pre-release versions:**
- `1.0.0-alpha.1` - Alpha release
- `1.0.0-beta.1` - Beta release
- `1.0.0-rc.1` - Release candidate

## Publishing Multiple Packages

Each package is published independently. To publish multiple packages:

```bash
# Publish trading-data-client version 0.2.0
git tag trading-data-client-v0.2.0
git push origin trading-data-client-v0.2.0

# Publish another-lib version 1.0.0 (when it exists)
git tag another-lib-v1.0.0
git push origin another-lib-v1.0.0
```

## Using Nx Release (Alternative Method)

You can also use Nx's built-in release tooling for more advanced workflows:

### Release a Specific Package

```bash
# Interactive release for a specific package
npx nx release --projects=trading-data-client

# Non-interactive with specific version
npx nx release --projects=trading-data-client --version=0.2.0
```

### Release All Changed Packages

```bash
# Detect and release all packages with changes
npx nx release
```

The Nx release configuration is set to:
- **Independent versioning**: Each project maintains its own version
- **Project changelogs**: Generate changelog for each package
- **GitHub releases**: Automatically create GitHub releases

## Verifying Published Packages

After publishing, verify the package on NPM:

1. **Check NPM Registry**:
   ```bash
   npm view @lc-trading-services/trading-data-client
   ```

2. **Install and Test**:
   ```bash
   npm install @lc-trading-services/trading-data-client@latest
   ```

3. **View on NPM Website**:
   - [trading-data-client](https://www.npmjs.com/package/@lc-trading-services/trading-data-client)

## Adding a New Package

When adding a new library or application to the monorepo:

1. **Create the package** using Nx generators:

   ```bash
   # For a library
   npx nx g @nx/js:lib libs/my-new-lib --publishable --importPath=@lc-trading-services/my-new-lib
   
   # For an application
   npx nx g @nx/node:application apps/my-new-app
   ```

2. **Configure package.json** in the new package:

   ```json
   {
     "name": "@lc-trading-services/my-new-lib",
     "version": "0.0.1",
     "publishConfig": {
       "access": "public"
     },
     "files": [
       "dist",
       "README.md",
       "LICENSE"
     ]
   }
   ```

3. **Publish the first version**:

   ```bash
   git tag my-new-lib-v0.0.1
   git push origin my-new-lib-v0.0.1
   ```

## Troubleshooting

### Publishing Failed

If publishing fails:

1. **Check GitHub Actions logs**: Review the workflow run for error messages
2. **Verify NPM token**: Ensure `NPM_TOKEN` secret is valid
3. **Check package.json**: Verify the package name and version are correct
4. **Test locally**: Try building and testing the package locally

### Tag Already Exists

If you pushed the wrong version tag:

```bash
# Delete local tag
git tag -d trading-data-client-v0.1.0

# Delete remote tag
git push origin :refs/tags/trading-data-client-v0.1.0

# Create correct tag
git tag trading-data-client-v0.1.0
git push origin trading-data-client-v0.1.0
```

### Version Conflicts

If the version already exists on NPM:

1. Increment the version number
2. Create a new tag with the updated version
3. NPM doesn't allow overwriting existing versions

## Best Practices

1. **Test Before Publishing**: Always run tests and builds locally before tagging
2. **Update Changelogs**: Document changes in the package's README or CHANGELOG
3. **Review Changes**: Use `git diff` to review changes before committing
4. **Coordinate Releases**: Communicate with team members about upcoming releases
5. **Follow Semver**: Use semantic versioning consistently
6. **Tag After Merge**: Only tag commits that are merged to `main`

## Local Publishing for Testing

To test publishing without actually publishing to NPM:

1. **Use Verdaccio (local NPM registry)**:

   ```bash
   # Start local registry
   npx nx local-registry
   
   # In another terminal, publish to local registry
   cd libs/trading-data-client
   npm publish --registry http://localhost:4873
   ```

2. **Use npm pack**:

   ```bash
   cd libs/trading-data-client
   npm pack
   # This creates a .tgz file you can inspect or install locally
   ```

## Support

For questions or issues with publishing:

1. Check the [GitHub Actions workflow logs](../../actions)
2. Review the [Nx Release documentation](https://nx.dev/recipes/nx-release)
3. Open an issue in the repository

---

**Last Updated**: 2025-10-26
