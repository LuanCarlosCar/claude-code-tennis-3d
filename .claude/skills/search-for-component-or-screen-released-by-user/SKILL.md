---
name: search-for-component-or-screen-released-by-user
description: Manually-invoked skill (do NOT auto-trigger) that locates every portal screen whose `config_file` references a given renderer/component and returns the users who currently have access to those screens. Only run when the user explicitly asks for it (e.g. "use the search-for-component-or-screen-released-by-user skill", "find which users have access to pages using renderCheckbox", "list users allowed on screens with <component>"). Output is intentionally minimal: only `id_usuario` and the URL in the format `/table-report?idLayout=<id_layout>`.
---

# Search for Component or Screen Released by User

Find every screen (row in `portal_tbl_layout_relatorio`) whose JSON `config_file` references a specific frontend component/renderer (e.g. `renderCheckbox`, `renderSelect`, `renderDatePicker`), and list the users who are authorized to access those screens. Both the screen and the permission must be active.

## When to use

Only when the user explicitly invokes this skill. Do **not** auto-fire on generic questions like "who has access to page X". The user will name the skill or say something equivalent to "search for a component and the user that has it released".

## Input

The user provides (free-form; ask only for what's missing):

- `component` — required. The renderer name exactly as it appears in `config_file` (e.g. `renderCheckbox`).
- `idEmpresa` — optional. Restrict to a single company.
- `idLayout` — optional. Restrict to a single layout (skips the component search step).
- `includeMobile` — optional, default `false`. If `true`, also search `mobile_config_file`.
- `includeGroupAccess` — optional, default `false`. If `true`, also resolve group-based permissions via `portal_tbl_grupo_usuario_layout` (see Step 3b caveat).

If the user did not give a `component`, ask for it before running any query.

## How to query the database

Use `node ace db:query -s "<SQL>"` for **every** DB call — never open a raw MySQL connection, never edit data, never use another CLI. Exactly the same mechanism as the `analyze-dataset` skill.

**Parallelize.** Whenever two queries have no dependency, dispatch them in the same message using multiple Bash tool calls in parallel. Never serialize queries that could run together.

If `node ace db:query` fails because the local Node version does not satisfy `engines.node` in `package.json` (AdonisJS refuses to boot), stop and report the Node version mismatch to the user — do NOT silently fall back to another connection method in this skill.

## Steps — execute in order

### Step 1: Find screens that reference the component

If the user passed an explicit `idLayout`, skip to Step 2 and use that id directly.

Otherwise run:

```bash
node ace db:query -s "
  SELECT id_layout, id_empresa, relatorio, descricao, rota
  FROM portal_tbl_layout_relatorio
  WHERE flag_status = 1
    AND CAST(config_file AS CHAR) LIKE '%<component>%'
    <AND id_empresa = <idEmpresa>>      -- only if provided
"
```

If `includeMobile = true`, also run in parallel:

```bash
node ace db:query -s "
  SELECT id_layout, id_empresa, relatorio, descricao, rota
  FROM portal_tbl_layout_relatorio
  WHERE flag_status = 1
    AND CAST(mobile_config_file AS CHAR) LIKE '%<component>%'
    <AND id_empresa = <idEmpresa>>
"
```

Merge the two result sets by `id_layout` (dedupe).

Notes:
- `config_file` and `mobile_config_file` are JSON columns. The `CAST(... AS CHAR) LIKE '%<component>%'` pattern is the correct way to text-search inside them.
- `flag_status = 1` means the screen is active — never drop this filter.
- The `rota` column is almost always `/table-report`. This skill assumes that route; if the query returns a different `rota`, surface it in the output but still build the URL with `/table-report?idLayout=<id>` (that is the canonical query-param form used by the frontend).

If the result set is empty, stop and tell the user no active screens match the component.

### Step 2: Find users with direct access to those layouts

Collect all matching `id_layout` values from Step 1 (or the one provided by the user) into an `IN (...)` list, then run:

```bash
node ace db:query -s "
  SELECT ur.id_usuario,
         ur.id_layout,
         ur.id_empresa
  FROM tbl_usuario_relatorio ur
  JOIN tbl_usuario u ON u.id_usuario = ur.id_usuario
  WHERE ur.flag_status = 1
    AND u.flag_status = 1
    AND ur.id_layout IN (<layout_ids_csv>)
"
```

`tbl_usuario_relatorio` is the table that grants a user direct access to a specific layout (or a specific `id_pagina`). Both `ur.flag_status` and `u.flag_status` must be `1` — otherwise the user is deactivated or the permission is revoked.

### Step 3a: (Default) Skip group-based access

By default, do not query group-based access. `tbl_usuario_relatorio` is the authoritative direct grant and is sufficient for the common question "who can open this screen".

### Step 3b: (Optional) Include group-based access — only if `includeGroupAccess = true`

Group access flows through:

- `portal_tbl_grupo_usuario` — groups per company (`id`, `id_empresa`, `grupo`, `flag_status`).
- `portal_tbl_grupo_usuario_layout` — links a group to one or more `id_layout` (`id_grupo_usuario`, `id_layout`, `flag_status`).
- A third table linking `usuario → grupo_usuario` that has NOT yet been confirmed in this schema (it is **not** `tbl_usuario_grupo_ad`, which is AD-specific). Before running this branch, list tables with:

  ```bash
  node ace db:query -s "SHOW TABLES LIKE '%usuario%grupo%'"
  node ace db:query -s "SHOW TABLES LIKE '%grupo%usuario%'"
  ```

  Then `DESCRIBE` candidates and pick the one with both `id_usuario` and `id_grupo_usuario` columns. If no such table is found, stop this step and note the gap in the output — do not guess.

Once the linking table is known, fetch group-granted users:

```bash
node ace db:query -s "
  SELECT DISTINCT ug.id_usuario,
                  gul.id_layout
  FROM portal_tbl_grupo_usuario_layout gul
  JOIN portal_tbl_grupo_usuario gu    ON gu.id = gul.id_grupo_usuario
  JOIN <usuario_grupo_table> ug       ON ug.id_grupo_usuario = gu.id
  JOIN tbl_usuario u                  ON u.id_usuario = ug.id_usuario
  WHERE gul.flag_status = 1
    AND gu.flag_status  = 1
    AND u.flag_status   = 1
    AND gul.id_layout IN (<layout_ids_csv>)
"
```

Union the result with Step 2 (dedupe by `(id_usuario, id_layout)`).

### Step 4: Build the output

Transform every `(id_usuario, id_layout)` pair into:

| Column | Value |
|---|---|
| `id_usuario` | Raw id from the query |
| `url` | `/table-report?idLayout=<id_layout>` |

Sort by `id_usuario` ASC, then `id_layout` ASC. Dedupe exact duplicates.

## Output format

**Only two columns.** Do not include name, email, company, relatorio, descricao, flag_status, or any other field unless the user explicitly asks for them afterwards.

```
## Users with access to screens using `<component>`

Matched layouts: <count>   Users found: <count>

| id_usuario | url |
|---|---|
| 17   | /table-report?idLayout=181 |
| 396  | /table-report?idLayout=181 |
| 713  | /table-report?idLayout=181 |
```

If no users are found after Step 2 (and Step 3b, if enabled), say so explicitly:

```
No active users currently have access to screens using `<component>`.
Matched layouts: <count> (none granted to any active user).
```

If Step 1 returned many layouts (say, more than ~15), mention the count in the header and ask the user whether to narrow by `idEmpresa` or a specific `id_layout` before computing users — otherwise the list can be huge. Do not truncate silently.

## Rules

- Read-only. This skill never INSERTs, UPDATEs, or DELETEs.
- All filters on `flag_status = 1` are mandatory — on the screen, on the permission, and on the user.
- Never replace the output columns. `id_usuario` and `url` only.
- The URL format is `/table-report?idLayout=<id_layout>` (query param, not path param). This matches the frontend route for layout-based table reports.
- Use `node ace db:query -s "..."` for every query; parallelize independent queries in a single tool message.
- Do not cache results across invocations — the permission tables change.
