# NPM Publishing Setup Instructions

This document provides step-by-step instructions for setting up NPM publishing for the `trading-data-client` library.

## Prerequisites

Before you can publish to NPM, you need:

1. An NPM account with access to create the `@lc-trading-services` scope
2. Repository admin access to configure GitHub secrets

## Step 1: NPM Account Setup

### Create NPM Account (if needed)

1. Go to [npmjs.com](https://www.npmjs.com/signup)
2. Sign up for a free account
3. Verify your email address

### Create Organization/Scope

1. Navigate to [npmjs.com/org/create](https://www.npmjs.com/org/create)
2. Create organization: `lc-trading-services`
3. Choose plan (free tier is fine for public packages)

**Note**: If the scope already exists, ensure you have publish access.

## Step 2: Generate NPM Token

1. **Login to NPM**
   - Go to [npmjs.com](https://www.npmjs.com)
   - Sign in to your account

2. **Access Tokens Page**
   - Click on your profile icon (top right)
   - Select "Access Tokens"
   - Or visit: [npmjs.com/settings/YOUR_USERNAME/tokens](https://www.npmjs.com/settings/)

3. **Generate New Token**
   - Click "Generate New Token"
   - Choose "Automation" token type (recommended for CI/CD)
   - Configure token settings:
     - **Token Type**: Automation
     - **Expiration**: No expiration or 1 year (you choose)
     - **Packages and scopes**: Select specific packages/scopes
     - Grant access to `@lc-trading-services` scope
   
4. **Copy the Token**
   - **IMPORTANT**: Copy the token immediately
   - You won't be able to see it again
   - Store it securely (you'll add it to GitHub in the next step)

Example token format: `npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Step 3: Add Token to GitHub Secrets

1. **Navigate to Repository Settings**
   - Go to: https://github.com/Life-Cockpit/lc-trading-services
   - Click "Settings" tab
   - Click "Secrets and variables" → "Actions" in the left sidebar

2. **Create New Secret**
   - Click "New repository secret" button
   - Configure:
     - **Name**: `NPM_TOKEN`
     - **Secret**: Paste the NPM token you copied earlier
   - Click "Add secret"

3. **Verify Secret**
   - You should see `NPM_TOKEN` listed under "Repository secrets"
   - The value will be hidden (shows as `***`)

## Step 4: Verify Workflow Configuration

The workflow file is already configured at `.github/workflows/publish-npm.yml`.

Verify it references the secret correctly:
```yaml
env:
  NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Step 5: Test the Setup (Optional but Recommended)

### Option A: Manual Workflow Test

1. Go to the Actions tab in GitHub
2. Find "Publish to NPM" workflow
3. Click "Run workflow" button
4. Select the branch
5. Click "Run workflow"

This will run the workflow manually to test if everything works.

### Option B: Test with Version Bump

1. Create a test branch
2. Update version in `libs/trading-data-client/package.json` to `0.0.2-test.1`
3. Push to the branch and merge to main
4. Check the Actions tab to see if the workflow runs

**Important**: Use a prerelease version (e.g., `0.0.2-test.1`) so it won't affect production users.

## Step 6: First Production Publish

Once everything is tested:

1. **Update Version**
   ```bash
   # Edit libs/trading-data-client/package.json
   # Change version from 0.0.1 to 0.1.0 (or appropriate version)
   ```

2. **Create PR**
   ```bash
   git checkout -b release/v0.1.0
   git add libs/trading-data-client/package.json
   git commit -m "chore: bump trading-data-client to v0.1.0"
   git push origin release/v0.1.0
   ```

3. **Merge to Main**
   - Create PR to main branch
   - Get it reviewed
   - Merge the PR

4. **Monitor Workflow**
   - Go to Actions tab
   - Watch "Publish to NPM" workflow
   - Verify it completes successfully

5. **Verify on NPM**
   - Visit: https://www.npmjs.com/package/@lc-trading-services/trading-data-client
   - Confirm version is published
   - Test installation: `npm install @lc-trading-services/trading-data-client`

## Troubleshooting

### Error: 403 Forbidden

**Problem**: NPM token doesn't have permission to publish

**Solution**:
1. Verify token has "Automation" type
2. Check token has access to `@lc-trading-services` scope
3. Ensure you're a member of the organization with publish rights
4. Regenerate token with correct permissions

### Error: 404 Not Found

**Problem**: Scope doesn't exist or package name is wrong

**Solution**:
1. Verify `@lc-trading-services` organization exists on NPM
2. Check package name in `package.json` matches expected format
3. First publish requires organization to exist

### Error: Package already exists

**Problem**: Version already published

**Solution**:
1. Increment version in `package.json`
2. Cannot republish same version to NPM

### Workflow doesn't run

**Problem**: Workflow not triggering on merge to main

**Solution**:
1. Verify workflow file is in `.github/workflows/` directory
2. Check branch name is exactly `main`
3. Ensure workflow file has correct YAML syntax
4. Check Actions are enabled for the repository

### Token expired

**Problem**: NPM token has expired

**Solution**:
1. Generate new token on npmjs.com
2. Update `NPM_TOKEN` secret in GitHub
3. Re-run failed workflow

## Security Best Practices

1. **Never commit tokens** to git or share them publicly
2. **Use Automation tokens** for CI/CD (not your personal token)
3. **Set expiration dates** on tokens (rotate periodically)
4. **Limit token scope** to only what's needed
5. **Monitor usage** - NPM shows when tokens are used
6. **Revoke immediately** if compromised

## Maintenance

### Rotating Tokens

It's good practice to rotate tokens periodically:

1. Generate new NPM token
2. Update GitHub secret `NPM_TOKEN`
3. Revoke old token on npmjs.com
4. Test with a workflow run

Recommended: Rotate every 6-12 months

### Monitoring

Check these regularly:

1. **GitHub Actions logs** - Watch for publish failures
2. **NPM download stats** - Monitor package usage
3. **GitHub Issues** - User reports about package
4. **Security advisories** - For dependencies

## Need Help?

If you encounter issues:

1. Check the [PUBLISHING.md](PUBLISHING.md) guide
2. Review GitHub Actions logs for error messages
3. Open an issue in the repository
4. Contact repository maintainers

## Success Checklist

- [ ] NPM account created
- [ ] `@lc-trading-services` organization exists
- [ ] NPM automation token generated
- [ ] Token added to GitHub secrets as `NPM_TOKEN`
- [ ] Workflow file exists and is correct
- [ ] Test workflow run completed successfully
- [ ] First version published to NPM
- [ ] Package verified on npmjs.com
- [ ] Package can be installed with npm
- [ ] Documentation reviewed

Once all items are checked, the publishing pipeline is fully operational! 🎉
