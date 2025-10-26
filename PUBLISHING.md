# Publishing Guide for trading-data-client

This guide explains how to publish the `trading-data-client` library to the NPM registry.

## Overview

The `trading-data-client` library and its dependency `lc-trading-data-interface` are published to NPM automatically via GitHub Actions when changes are merged to the `main` branch.

## Prerequisites

Before you can publish, ensure the following is set up:

### 1. NPM Token Configuration

A repository administrator must configure an NPM token with publish permissions:

1. **Create NPM Account/Organization**
   - Ensure the `@lc-trading-services` scope is registered on npmjs.com
   - Create an access token with "Automation" type for publishing

2. **Add Token to GitHub Secrets**
   - Go to repository Settings → Secrets and Variables → Actions
   - Add a new secret named `NPM_TOKEN`
   - Paste your NPM automation token

3. **Verify Permissions**
   - Ensure the token has permission to publish to the `@lc-trading-services` scope
   - The token should have "Read and Publish" access

### 2. Required Repository Permissions

The GitHub Actions workflow needs the following permissions:
- `contents: write` - To create tags and releases
- `id-token: write` - For NPM provenance

These are configured in the workflow file.

## Publishing Process

### Automated Publishing (Recommended)

1. **Update Version Numbers**
   
   Update the version in the appropriate `package.json` file(s):
   
   ```bash
   # For interface changes
   # Edit libs/lc-trading-data-interface/package.json
   
   # For client changes
   # Edit libs/trading-data-client/package.json
   ```
   
   Follow [semantic versioning](https://semver.org/):
   - **Patch** (0.0.x): Bug fixes, documentation updates
   - **Minor** (0.x.0): New features, backward compatible
   - **Major** (x.0.0): Breaking changes

2. **Create and Merge PR**
   
   ```bash
   git checkout -b release/v0.0.2
   # Make your version changes
   git add libs/*/package.json
   git commit -m "chore: bump version to 0.0.2"
   git push origin release/v0.0.2
   ```
   
   Create a PR to `main` branch and get it reviewed.

3. **Automatic Publishing**
   
   Once merged to `main`:
   - GitHub Actions workflow triggers automatically
   - Runs tests and builds the libraries
   - Checks if versions have changed on NPM
   - Publishes new versions if needed
   - Creates Git tags and GitHub releases

### Manual Publishing (For Testing)

For local testing or emergency situations:

```bash
# Build the libraries
npx nx build lc-trading-data-interface
npx nx build trading-data-client

# Login to NPM (one-time)
npm login

# Publish interface first
cd libs/lc-trading-data-interface
npm publish --access public

# Then publish client
cd ../trading-data-client
npm publish --access public
```

## Workflow Details

The publishing workflow (`.github/workflows/publish-npm.yml`) performs these steps:

### Job 1: publish-interface
1. Checkout code
2. Setup Node.js with NPM registry
3. Install dependencies
4. Run tests for `lc-trading-data-interface`
5. Build the library
6. Check if version changed compared to NPM
7. If changed, publish to NPM with provenance
8. Create Git tag for the release

### Job 2: publish-client
1. Runs after `publish-interface` completes
2. Same steps as above for `trading-data-client`
3. Additionally creates a GitHub Release

## Version Management

### When to Publish

Publish new versions when:
- ✅ New features are added
- ✅ Bugs are fixed
- ✅ Documentation is significantly updated
- ✅ Dependencies are updated (especially yahoo-finance2)
- ✅ Breaking changes are made (increment major version!)

### Version Synchronization

- The `trading-data-client` depends on `lc-trading-data-interface`
- When publishing both, ensure compatible versions:
  - If interface has breaking changes, update both major versions
  - Update client's dependency version in its `package.json`

Example:
```json
{
  "dependencies": {
    "@lc-trading-services/lc-trading-data-interface": "^0.1.0"
  }
}
```

## Verifying Published Packages

After publishing, verify the packages:

1. **Check NPM Registry**
   ```bash
   npm view @lc-trading-services/trading-data-client
   npm view @lc-trading-services/lc-trading-data-interface
   ```

2. **Test Installation**
   ```bash
   mkdir /tmp/test-install
   cd /tmp/test-install
   npm init -y
   npm install @lc-trading-services/trading-data-client
   ```

3. **Verify Package Contents**
   ```bash
   npm pack @lc-trading-services/trading-data-client
   tar -tzf lc-trading-services-trading-data-client-*.tgz
   ```

## Troubleshooting

### Workflow Fails to Publish

**Issue**: Authentication errors
```
npm ERR! code ENEEDAUTH
npm ERR! need auth This command requires you to be logged in.
```

**Solution**: 
- Verify `NPM_TOKEN` is correctly set in GitHub secrets
- Ensure token hasn't expired
- Confirm token has publish permissions for the scope

### Version Already Published

The workflow automatically skips publishing if the version hasn't changed. To publish:

1. Increment version in `package.json`
2. Commit and push to main

### Package Not Found After Publishing

**Issue**: Package shows as published but `npm install` fails

**Solution**:
- NPM can take a few minutes to propagate
- Check package visibility: should be "public"
- Verify scope name is correct: `@lc-trading-services`

### Build Fails in Workflow

**Issue**: Tests or build fail in CI

**Solution**:
- Ensure all tests pass locally: `npx nx run-many -t test`
- Verify builds work: `npx nx run-many -t build`
- Check for missing dependencies

## Rolling Back a Release

If you need to deprecate or unpublish a version:

```bash
# Deprecate a version (recommended over unpublish)
npm deprecate @lc-trading-services/trading-data-client@0.0.1 "This version has a critical bug, please upgrade to 0.0.2"

# Unpublish (only within 72 hours, not recommended)
npm unpublish @lc-trading-services/trading-data-client@0.0.1
```

**Note**: Unpublishing can break existing users. Use deprecation instead.

## Package Metadata

Both packages include:
- ✅ README.md - User documentation
- ✅ LICENSE - MIT license
- ✅ package.json - With all required metadata
- ✅ TypeScript declarations (.d.ts files)
- ✅ Compiled JavaScript (ESM)
- ✅ Source maps for debugging

Excluded from packages:
- ❌ Source TypeScript files (.ts)
- ❌ Test files (.spec.ts, .test.ts)
- ❌ Build configuration
- ❌ Development dependencies

## Monitoring

After publishing, monitor:

1. **NPM Download Stats**
   - https://www.npmjs.com/package/@lc-trading-services/trading-data-client

2. **GitHub Releases**
   - Check that tags and releases are created correctly

3. **Issues**
   - Watch for installation or usage issues from users

## Best Practices

1. **Always Test Before Publishing**
   - Run full test suite
   - Build all libraries
   - Test in a clean environment

2. **Document Changes**
   - Update README for new features
   - Keep CHANGELOG up to date (if using)
   - Write clear commit messages

3. **Follow Semantic Versioning**
   - Breaking changes = major version
   - New features = minor version
   - Bug fixes = patch version

4. **Keep Dependencies Updated**
   - Regularly update `yahoo-finance2` and other deps
   - Test thoroughly after updates

5. **Coordinate Interface Changes**
   - Update interface first if needed
   - Then update client to use new interface
   - Publish interface before client

## Support

For questions or issues with publishing:
- Open an issue on GitHub
- Contact the repository maintainers
- Check GitHub Actions logs for workflow failures
