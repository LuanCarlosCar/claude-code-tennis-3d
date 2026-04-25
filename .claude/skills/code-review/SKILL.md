---
name: code-review
description: Review code changes against gescorpgo-web standards. Dispatches the `code-reviewer` subagent so the full rules list does not inflate the main conversation context. Supports spec/plan review, working-tree review, full branch-diff review, or an explicit list of paths.
---

# Code Review

This skill is a thin **trigger** — the real review runs in the `code-reviewer` subagent (`.claude/agents/code-reviewer.md`). Keeping the rules load out of the main context is the whole point.

## Usage

Identify the scope from the user's request, then dispatch the agent via the `Agent` tool with `subagent_type: code-reviewer`. Pass the scope in the prompt using one of these shapes:

| User says | Pass to agent |
|---|---|
| "review my changes" / "review working tree" (default) | `working-tree` |
| "review the branch" / "review everything on this branch" | `branch-diff` |
| "review the spec at X" / "review this plan" | `spec: <path>` |
| "review these files: a.tsx, b.ts" | `paths: [a.tsx, b.ts]` |

If the user's intent is unclear, ask which scope before dispatching.

## What the agent returns

A markdown report grouped by severity:

```
## Critical (N)
## Warning (N)
## Suggestion (N)
## Summary
```

Each item includes `file:line`, the problem, and a suggested fix. The agent does **not** apply fixes.

## After the agent replies

1. Present the report to the user as-is (it is already concise).
2. Ask which items they want addressed.
3. Apply the selected fixes yourself (main agent), or dispatch other agents if the work is large.

## Standards

The subagent reads `.claude/rules/*.md` at runtime. Do not duplicate rule content here.
