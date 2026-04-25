# Git Conventions

## Branch naming
- `feat/<short-description>` — new feature
- `fix/<short-description>` — bug fix
- `chore/<short-description>` — maintenance, deps, config
- `refactor/<short-description>` — code restructuring, no behavior change

## Commit format (Conventional Commits)
`<type>(<scope>): <description>`

Types: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`

Examples:
- `feat(auth): add JWT refresh token support`
- `fix(modal): correct z-index stacking on mobile`
- `chore(deps): update adonis to 5.9`

## Rules
- NEVER commit directly to `main` or `master`
- Branch from `main`, PR back to `main`
- Squash or rebase before merging to keep history linear
- Delete branch after merge
