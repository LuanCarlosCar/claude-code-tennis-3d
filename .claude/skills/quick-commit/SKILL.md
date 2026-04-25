---
name: quick-commit
description: Quick commit and push workflow with Husky bypass. Use when the user says "/commit", "commit this", "commit and push", or wants to quickly commit changes without running pre-commit hooks. Generates Conventional Commits format messages and automatically pushes to remote.
---

# Quick Commit

Generate a commit message using Conventional Commits format and push to remote, bypassing Husky hooks with `-n` flag.

## Workflow

1. **Check status and changes**
   ```bash
   git status
   git diff --staged
   git diff
   ```

2. **Stage changes** - Add specific files (avoid `git add -A` or `git add .`)
   ```bash
   git add <specific-files>
   ```

3. **Generate commit message** using Conventional Commits format:
   - `feat`: New feature
   - `fix`: Bug fix
   - `refactor`: Code refactoring
   - `style`: Formatting, styling changes
   - `docs`: Documentation
   - `test`: Tests
   - `chore`: Maintenance tasks

   Format: `type(scope): description`

4. **Commit with Husky bypass**
   ```bash
   git commit -n -m "$(cat <<'EOF'
   type(scope): concise description

   Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
   EOF
   )"
   ```

5. **Push to remote**
   ```bash
   git push
   ```

## Examples

```bash
# Feature addition
git commit -n -m "feat(auth): add logout button to navbar"

# Bug fix
git commit -n -m "fix(api): handle null response in user service"

# Refactoring
git commit -n -m "refactor(components): extract modal logic to custom hook"

# Style changes
git commit -n -m "style(UserCard): update spacing and colors"
```

## Important

- Always use `-n` flag to bypass Husky pre-commit hooks
- Stage specific files, not everything
- Keep commit messages concise (under 72 chars for subject line)
- Always push after committing
