# Branch Protection Policy

## Overview

This repository implements branch protection rules to ensure code quality and maintain a clean git history. The `main` branch is protected and requires all changes to go through a pull request process.

> **Note**: For instructions on how to activate these protections, see [ACTIVATION_GUIDE.md](ACTIVATION_GUIDE.md).

## Protected Branch: `main`

The `main` branch is protected with the following rules:

### 1. No Direct Commits

Direct commits to the `main` branch are **not allowed**. All changes must be submitted via pull requests.

### 2. Pull Request Requirements

Pull requests to `main` must:

- Originate **only** from the `develop` branch
- Have at least **1 approving review**
- Pass all required status checks:
  - Run Tests
  - Build Libraries
  - Lint Code
- Resolve all review comments before merging

### 3. Additional Protections

- **No force pushes**: The branch cannot be force-pushed or have its history rewritten
- **No deletion**: The branch cannot be deleted
- **Linear history**: Requires a linear commit history (no merge commits)
- **Stale reviews**: Dismisses stale pull request approvals when new commits are pushed

## Workflow

### Making Changes to `main`

1. **Create a feature branch** from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and commit them to your feature branch:
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```

3. **Create a pull request** from your feature branch to `develop`:
   - Go to GitHub and create a PR
   - Ensure all tests pass
   - Get code review approval
   - Merge to `develop`

4. **Create a pull request** from `develop` to `main`:
   - Once changes are ready for production
   - Create a PR from `develop` to `main`
   - Ensure all status checks pass
   - Get required approvals
   - Merge to `main`

### Branch Hierarchy

```
main (production)
  ↑
develop (integration)
  ↑
feature/* (feature branches)
```

## Enforcement

Branch protection rules are enforced through:

1. **GitHub Rulesets** (`.github/rulesets/main-branch-protection.json`)
   - Defines branch protection rules as code
   - Enforced by GitHub's branch protection system

2. **GitHub Actions Workflow** (`.github/workflows/validate-pr-source.yml`)
   - Validates that PRs to `main` only come from `develop`
   - Provides immediate feedback on invalid PRs

## Bypass

There are no bypass actors configured. This means that **all contributors**, including repository administrators, must follow these rules.

If you need to bypass these rules in an emergency:
1. Repository administrators can temporarily disable the ruleset in GitHub settings
2. Make the necessary changes
3. Re-enable the ruleset immediately after

## Questions?

If you have questions about the branch protection policy, please contact the repository maintainers or open an issue.
