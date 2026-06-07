## Why

The existing coordinator and PTY plumbing can launch agents, but its autonomous
landing defaults and broad process authority do not satisfy conductor gates.
The conductor needs one execution boundary that translates approved steps into
provider-adapter launches and mediates privileged effects.

## What Changes

- Execute only an immutable approved run manifest.
- Launch through `AgentAdapter`; use structured provider interfaces when
  available and identify PTY fallback limitations.
- Add a privileged-operation broker at final backend effect entrypoints for
  writes, Git mutation, installs, migrations, deletes, and pushes.
- Enforce strict child environments, sender validation, sandbox profiles, and
  fail-closed read-only roles.
- Reconcile provider sessions, PTYs, worktrees, and effects against the
  transactional run store after restart.
- Keep the existing manual task flow unchanged.

## Capabilities

### New Capabilities

- `conductor-execution-adapter`: Approved-manifest execution, provider-adapter
  launch, privileged-effect mediation, sandbox enforcement, and reconciliation.

## Impact

- **Code:** `electron/conductor/execution-adapter.ts`, privileged broker and
  sandbox profiles, plus guarded coordinator/PTY/Git entrypoints.
- **Depends on:** agent adapters, scheduler, run store, dry-run, worktrees, and
  artifacts; approval gates authorize brokered effects.
