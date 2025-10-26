# Branch Protection Configuration

This directory contains configuration for protecting the `main` branch using GitHub Rulesets.

## Overview

The main branch protection uses a two-part approach:
1. **GitHub Ruleset** (`main-branch-ruleset.json`) - Defines branch protection rules
2. **Status Check Workflow** (`workflows/validate-pr-source.yml`) - Validates PR source branch

## Setup Instructions

### Step 1: Apply the Ruleset

Apply the ruleset configuration from `main-branch-ruleset.json` using one of these methods:

#### Method A: GitHub Web UI

1. Navigate to repository **Settings** → **Rules** → **Rulesets**
2. Click **New ruleset** → **New branch ruleset**
3. Enter ruleset name: `Main Branch Protection`
4. Set **Enforcement status** to **Active**
5. Under **Target branches**, add pattern: `main`
6. Configure the following rules:
   - ✅ **Restrict deletions** - Prevent branch deletion
   - ✅ **Block force pushes** - Prevent force pushes
   - ✅ **Require a pull request before merging**
     - Required approvals: 1
   - ✅ **Require status checks to pass**
     - Add status check: `validate-source-branch`
     - Require branches to be up to date before merging: ✅
7. Leave **Bypass actors** empty (or configure as needed)
8. Click **Create**

#### Method B: GitHub CLI

```bash
gh api \
  --method POST \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  /repos/Life-Cockpit/lc-trading-services/rulesets \
  --input .github/main-branch-ruleset.json
```

#### Method C: GitHub REST API

```bash
curl -L \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/Life-Cockpit/lc-trading-services/rulesets \
  -d @.github/main-branch-ruleset.json
```

### Step 2: Verify the Setup

The workflow `validate-pr-source.yml` automatically runs when:
- A pull request targets the `main` branch
- It validates that the source branch is `develop`

## How It Works

### Branch Protection Rules

The ruleset enforces:
- **No direct pushes** to main branch
- **No force pushes** or branch deletion
- **Pull requests required** with at least 1 approval
- **Status check required**: `validate-source-branch` must pass
- **Branch must be up-to-date** before merging

### Source Branch Validation

The `validate-source-branch` workflow:
- Runs on every PR to `main`
- Checks if `github.head_ref == 'develop'`
- **Passes** if source is `develop` ✅
- **Fails** if source is any other branch ❌

### Result

This configuration ensures:
- ✅ All changes to `main` go through pull requests
- ✅ PRs require review and approval
- ✅ Only PRs from `develop` branch can be merged to `main`
- ✅ Feature branches must merge to `develop` first
- ✅ Enforces Git Flow branching strategy

## Branching Workflow

```
feature/xyz → develop → main
     ✓          ✓        ✓
  (allowed) (allowed) (allowed)

feature/xyz → main
     ✗         ✗
           (blocked by validate-source-branch)
```

## Troubleshooting

### PR from feature branch to main is blocked

**Expected behavior**. Merge your feature branch to `develop` first, then create a PR from `develop` to `main`.

```bash
# Correct workflow:
git checkout develop
git pull
git merge feature/your-feature
git push

# Then create PR: develop → main
```

### Status check "validate-source-branch" not found

Ensure the workflow file `.github/workflows/validate-pr-source.yml` exists and has run at least once. The status check appears after the first workflow run.

## Maintenance

To update the ruleset:
1. Modify `main-branch-ruleset.json`
2. Re-apply using GitHub UI or API
3. Note: Rulesets created via API need to be updated via API

For the source branch validation:
- Edit `.github/workflows/validate-pr-source.yml`
- Changes take effect on next PR to main
