## Why

Writable conductor work (implementer, fixer) must never run directly on the
user's branch and must never silently edit sensitive files. The conductor needs
to create an isolated git worktree per writable task, keep read-only roles
(planner, reviewer) out of write mode, and enforce protected-path rules so an
agent cannot touch secrets, lockfiles, infra, or migrations without a gate.
Parallel Code already creates worktrees for manual tasks; the conductor needs a
policy-driven wrapper that ties worktree creation to role mode and protected
paths.

## What Changes

- Create an isolated worktree under `.worktrees/` for writable roles, named
  `{workflow}-{role}-{slug}-{timestamp}`, on a fresh branch.
- Bind worktree writability to role mode: `implementer`/`fixer` get a writable
  worktree; `fixer` reuses the implementer's worktree; `planner`/`reviewer` are
  read-only and get no writable worktree.
- Enforce a protected-paths policy
  (`.parallel-code/policies/protected-paths.yaml`): `deny_write` paths (`.env*`,
  `secrets/**`, `credentials/**`, `infra/prod/**`, deploy workflows) are blocked;
  `ask_before_write` paths (`package.json`, lockfiles, `migrations/**`, `k8s/**`,
  `terraform/**`) require a gate.
- Handle a dirty repo and worktree-creation failure explicitly (don't proceed
  silently).
- Provide "Open Worktree in Editor" using the generic editor bridge.

## Capabilities

### New Capabilities

- `conductor-worktrees`: Policy-driven git-worktree isolation for conductor
  runs — creating per-task writable worktrees for writable roles, keeping review
  roles read-only, and enforcing protected-path deny/ask rules on writes.

## Impact

- **Code (new):** `electron/conductor/worktrees.ts`,
  `electron/conductor/protected-paths.ts`. Reuses existing git plumbing in
  `electron/ipc/git.ts`. New IPC channels `ConductorCreateWorktree`,
  `ConductorCleanupWorktree`, and `ConductorCheckProtectedPath` on the `IPC`
  enum + preload allowlist; `WorktreeRef` and payload types in
  `src/ipc/types.ts`.
- **Depends on:** `add-conductor-config` (worktree + protected-path policy).
- **Filesystem:** creates branches and directories under `.worktrees/`.
- **Approval coupling:** the `ask_before_write` gate and the no-merge/no-push
  rule are enforced jointly with `add-conductor-approval-gates`.
