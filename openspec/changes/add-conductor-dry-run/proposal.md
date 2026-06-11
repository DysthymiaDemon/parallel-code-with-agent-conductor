## Why

This is the first user-visible conductor behavior and the riskiest thing to get
wrong: deciding _which_ workflow and agents a described task triggers. Doing
that wrong while also launching agents would waste subscription capacity and
possibly touch the working tree. The mitigation is a **dry run** — the app
classifies the task, selects a workflow, resolves roles to agents, and shows the
full plan (agents, worktrees, permissions, expected artifacts, capacity plan,
auth warnings) and then stops for explicit approval. Nothing is launched and
nothing is written until the user approves.

The classifier is intentionally deterministic (keyword/heuristic rules), not an
ML model — feature spec §4 and §29A require an explicit, auditable router on day
one.

## What Changes

- Add a conduct dialog/request entry point with task text plus explicit
  workflow and role-override fields.
- Add a deterministic task classifier that maps a task to one of the four fixed
  workflows: UI-leaning tasks → `ui-build-verify`; bug/regression tasks →
  `bug-hunt`; feature/backend tasks → `plan-implement-review`; unmatched
  single-agent tasks → `simple-codex` (fallback).
- Use four built-in workflow presets in memory when files are absent; persist
  them only through an explicit initialize action.
- Compose the dry-run preview by combining: resolved roles (from
  `conductor-config`), the auth posture (from `conductor-auth-inspector`), and
  the capacity plan (from `conductor-scheduler`).
- Show and freeze approved installed-CLI subscription routes, adapter kind,
  native-versus-sandbox launch profile, and excluded credential-variable names;
  never preview an implicit API-key or provider fallback.
- For retry-capable steps, preview and freeze the evaluator, bounded attempt
  budget, and stop or escalation condition.
- Make `plan-implement-review` the explicit secure design-to-approval workflow,
  including Codex repository validation/testing/fixing, Claude security review,
  conductor-owned final synthesis, and final human approval.
- Disclose threat-model skill provenance or labeled model fallback; model
  guardrails alone do not satisfy trust-boundary planning.
- Require an explicit approve/cancel decision before anything proceeds; on
  cancel, no side effects occur.

## Capabilities

### New Capabilities

- `conductor-dry-run`: Task classification and dry-run preview —
  turning a described task into a selected workflow, resolved role→agent
  assignments, a capacity plan, and auth warnings, presented for explicit
  approval before any agent launches or files change.

## Impact

- **Code (new):** `electron/conductor/classify.ts`, `electron/conductor/dry-run.ts`,
  and a `src/conductor/` view surface for the preview. New IPC channel
  `ConductorDryRun` on the `IPC` enum + preload allowlist; payload types in
  `src/ipc/types.ts`.
- **Depends on:** `add-conductor-config`, `add-conductor-agent-adapters`,
  `add-conductor-auth-inspector`, `add-conductor-scheduler`.
- **No agent launches, no worktree creation, no file writes** — preview only.
- **Workflow templates** — all four presets (`simple-codex`,
  `plan-implement-review`, `ui-build-verify`, `bug-hunt`) are read as data and
  generated from defaults when absent; their execution belongs to later changes.
