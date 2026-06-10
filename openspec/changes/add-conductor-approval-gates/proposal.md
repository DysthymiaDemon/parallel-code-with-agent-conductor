## Why

The human stays the final authority. The whole point of the conductor over a
free-running swarm is that risky operations stop and wait for a person: approve
the plan before implementation, approve fixes before merge, and never
commit/push/merge/install packages/run migrations/write protected paths without
an explicit gate. This is the safety layer the project runbook (§2, §4) and the
feature spec (§14, §20.13–15, §50) require, and it is what makes the earlier
changes safe to connect to real agent launches.

## What Changes

- Add a human-approval gate mechanism keyed off the `approval` policy in
  `conductor.yaml` (`before_first_write`, `before_commit`, `before_merge`,
  `before_push`, `before_package_install`, `before_database_migration`,
  `before_delete`, `before_touching_protected_paths`).
- Two mandatory workflow gates: **plan approval** before implementation and
  **final approval** before commit/merge.
- Block the gated operation until an explicit approve; a reject or timeout
  leaves the operation undone.
- Couple with `conductor-worktrees`: an `ask`-classified protected path triggers
  a gate; a `deny`-classified path is refused outright (no gate can authorize
  it in MVP).

## Capabilities

### New Capabilities

- `conductor-approval-gates`: The human-in-the-loop gate layer — pausing a run
  for explicit approval before plan implementation, final merge, and any
  risky/protected operation, and refusing denied operations outright.

## Impact

- **Code (new):** `electron/conductor/approvals.ts`, and an approval prompt
  surface in `src/conductor/`. New IPC channels `ConductorRequestApproval` and
  `ConductorResolveApproval` on the `IPC` enum + preload allowlist; payload
  types in `src/ipc/types.ts`.
- **Depends on:** `add-conductor-config` (approval policy),
  `add-conductor-run-store` (manifest, gate, and effect persistence),
  `add-conductor-worktrees` (protected-path classification), and
  `add-conductor-artifacts` (plan/final artifacts the gates reference).
- **Behavioral guarantee:** no brokered conductor commit, push, merge, package
  install, migration, delete, or protected-path write proceeds without its
  required approve result.
