---
name: clickup-add-card-comment
description: Add a comment to an existing ClickUp card via the ClickUp MCP. Use when the user asks to comment on a ClickUp card/task (e.g. "adiciona um comentário no card do clickup", "comenta no card", "add comment to clickup card"). Extracts the card ID from the current git branch name (pattern `CU-<id>-...`), asks the user to confirm the target card, and only then posts the comment. If no matching branch is found in the current directory, asks the user for a different directory path or for the card ID directly.
---

# ClickUp: Add Card Comment

Posts a comment to an existing ClickUp card using the `mcp__clickup__clickup_create_task_comment` tool. Branches in this project follow the convention `CU-<cardId>-<slug>` (e.g. `CU-86a53z1kx-Alterar-o-tipo-da-coluna-key-da-tabela-navegacao`), so the card ID can be inferred from the branch name instead of being pasted by the user.

## Workflow

Follow these steps in order. Do not skip the confirmation step.

### 1. Detect the card ID from the current branch

Read `<path>/.git/HEAD` directly (do not run `git` commands, do not `cd`). The file contains a line like `ref: refs/heads/<branch>` — extract `<branch>` from it.

- Match the branch against `^CU-([A-Za-z0-9]+)`. If it matches, the captured group is the card ID.
- If `.git/HEAD` does not exist, or the branch does not match, go to step 2.

### 2. Handle the fallback when no card ID is found

Ask the user (in their language, Portuguese by default on this project):

> "Não encontrei uma branch com padrão `CU-<id>-...` neste diretório. Você pode me passar o caminho de outro diretório para eu procurar, ou me enviar o ID do card diretamente?"

Accept either answer:

- **Directory path** → retry step 1 using that path (read `<path>/.git/HEAD`).
- **Card ID** (with or without `CU-` prefix) → normalize by stripping the prefix and continue to step 4.

Never guess the card ID or search ClickUp by keyword in this skill — stay scoped to branch detection / explicit ID.

### 3. Confirm the target card with the user

Before posting anything, confirm:

> "Encontrei a branch `<branch>`. Vou adicionar o comentário no card `CU-<id>` — confirma?"

Do not post the comment without an explicit confirmation. If the user rejects, fall back to step 2 (ask for directory or card ID).

### 4. Collect the comment content

If the user has not provided the comment text yet, ask for it. Keep the content verbatim — do not rewrite, translate, or "polish" the user's message.

### 5. Post the comment

Call `mcp__clickup__clickup_create_task_comment` with the normalized card ID (no `CU-` prefix — the MCP expects the raw ID, e.g. `86a53z1kx`).

### 6. Report the result

Return the card URL and a one-line confirmation. Do not summarize the comment back to the user.

## Notes

- The ClickUp MCP accepts task IDs without the `CU-` prefix. Always strip it before calling the tool.
- Read `<path>/.git/HEAD` directly to find the current branch — do not run `git` commands or change directories.
- This skill only adds comments to existing cards. For creating a card, use a different flow.
