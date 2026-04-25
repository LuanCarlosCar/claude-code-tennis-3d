
## Critical rules
- NEVER commit automatically — only when explicitly requested by the user
- After any successful code implementation, dispatch the `code-reviewer` agent to review the changes; present its findings to the user before proposing next steps
- NEVER use native HTML elements — always use components from `src/components/`
- NEVER hardcode px/colors — always use `theme.space`, `theme.colors`, `theme.fontSizes`, `theme.newRadius`
- Always use function declaration, not arrow functions, for components


## References (read when relevant)
- Component usage and form patterns → `.claude/rules/component-guidelines.md`
- Code style (imports, naming, declarations) → `.claude/rules/code-style.md`


