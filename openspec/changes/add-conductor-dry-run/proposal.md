## Why

This is the first user-visible conductor behavior and the riskiest thing to get
wrong: deciding *which* workflow and agents a described task triggers. Doing
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

- Add the `/conduct <task>` entry point with a `--dry-run` mode (and
  `--workflow=` / role overrides like `--implementer=codex`).
- Add a deterministic task classifier that maps a task to a workflow: UI-leaning
  tasks → `ui-build-verify`; backend/feature/bug tasks → `plan-implement-review`.
- Compose the dry-run preview by combining: resolved roles (from
  `conductor-config`), the auth posture (from `conductor-auth-inspector`), and
  the capacity plan (from `conductor-scheduler`).
- Require an explicit approve/cancel decision before anything proceeds; on
  cancel, no side effects occur.

## Capabilities

### New Capabilities

- `conductor-dry-run`: The `/conduct` task-classification and dry-run preview —
  turning a described task into a selected workflow, resolved role→agent
  assignments, a capacity plan, and auth warnings, presented for explicit
  approval before any agent launches or files change.

## Impact

- **Code (new):** `electron/conductor/classify.ts`, `electron/conductor/dry-run.ts`,
  and a `src/conductor/` view surface for the preview. New IPC channel
  `ConductorDryRun` on the `IPC` enum + preload allowlist; payload types in
  `src/ipc/types.ts`.
- **Depends on:** `add-conductor-config`, `add-conductor-auth-inspector`,
  `add-conductor-scheduler`.
- **No agent launches, no worktree creation, no file writes** — preview only.
- **Workflow templates** referenced (`plan-implement-review`, `ui-build-verify`)
  are read as data; their execution belongs to later changes.
