# Activating Branch Protection for Main Branch

## Overview

This repository now includes configuration files for protecting the `main` branch. These protections ensure that:
1. No direct commits can be made to `main`
2. All changes to `main` must come through pull requests from the `develop` branch
3. Pull requests require at least one approval
4. All CI checks must pass before merging

## Files Added

### 1. GitHub Ruleset
- **Location**: `.github/rulesets/main-branch-protection.json`
- **Purpose**: Defines branch protection rules as code

The ruleset includes:
- Prevention of branch deletion
- Prevention of force pushes
- Requirement for linear history
- Pull request requirements (1 approval, stale review dismissal)
- Required status checks (tests, build, lint)

### 2. GitHub Actions Workflow
- **Location**: `.github/workflows/validate-pr-source.yml`
- **Purpose**: Validates that PRs to `main` only come from `develop` branch

This workflow:
- Runs on every PR to `main`
- Checks the source branch
- Comments on the PR with validation results
- Fails the check if the source branch is not `develop`

### 3. Documentation
- **Location**: `.github/BRANCH_PROTECTION.md`
- **Purpose**: Comprehensive documentation of the branch protection policy

### 4. README Update
- **Location**: `README.md`
- **Purpose**: Added section referencing the branch protection policy

## Activation Steps

### Automatic Activation (Rulesets)

**Note**: GitHub repository rulesets defined in `.github/rulesets/` are **not automatically applied** to the repository. The JSON file serves as a template/documentation.

To activate the ruleset, a repository administrator must:

1. Go to the repository on GitHub
2. Navigate to **Settings** → **Rules** → **Rulesets**
3. Click **New ruleset** → **New branch ruleset**
4. Configure the ruleset with the following settings based on `main-branch-protection.json`:

   **Basic Settings:**
   - Name: "Protect Main Branch"
   - Enforcement status: Active
   - Target branches: `main`

   **Rules:**
   - ✅ Restrict deletions
   - ✅ Restrict force pushes
   - ✅ Require linear history
   - ✅ Require pull request before merging
     - Required approvals: 1
     - Dismiss stale pull request approvals when new commits are pushed
     - Require conversation resolution before merging
   - ✅ Require status checks to pass
     - ✅ Require branches to be up to date before merging
     - Status checks:
       - Run Tests
       - Build Libraries
       - Lint Code

5. Click **Create** to activate the ruleset

### Automatic Activation (Workflow)

The `validate-pr-source.yml` workflow is **automatically active** once merged to the default branch. It will:
- Run on any PR targeting the `main` branch
- Validate the source branch is `develop`
- Provide immediate feedback via PR comments

## Alternative: Using GitHub Settings UI

If you prefer not to use rulesets, you can configure branch protection through the GitHub UI:

1. Go to **Settings** → **Branches**
2. Click **Add branch protection rule**
3. Branch name pattern: `main`
4. Enable:
   - ✅ Require a pull request before merging
     - Required approvals: 1
     - Dismiss stale pull request approvals when new commits are pushed
     - Require review from Code Owners (optional)
   - ✅ Require status checks to pass before merging
     - ✅ Require branches to be up to date before merging
     - Status checks: Run Tests, Build Libraries, Lint Code
   - ✅ Require conversation resolution before merging
   - ✅ Require linear history
   - ✅ Do not allow bypassing the above settings
5. Click **Create** or **Save changes**

## Verifying Protection is Active

After activation, verify the protection is working:

1. Try to push directly to `main`:
   ```bash
   git checkout main
   git commit --allow-empty -m "test"
   git push origin main
   ```
   This should be **rejected** with a message about branch protection.

2. Create a PR from a non-`develop` branch to `main`:
   - The `validate-pr-source.yml` workflow should fail
   - A comment should appear on the PR indicating the invalid source branch

3. Create a PR from `develop` to `main`:
   - The `validate-pr-source.yml` workflow should pass
   - A comment should appear on the PR confirming the valid source branch
   - The PR should require approval before merging

## Important Notes

- **Repository rulesets** (JSON files in `.github/rulesets/`) are reference documentation and require manual activation via GitHub UI
- **GitHub Actions workflows** are automatically active when merged to the repository
- Both mechanisms work together to enforce the branch protection policy
- The workflow validation is an additional layer on top of the ruleset/branch protection

## Questions?

If you encounter issues activating the branch protection, please contact the repository maintainers.
