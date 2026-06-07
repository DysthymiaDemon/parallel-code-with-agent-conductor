## Why

The conductor requires run, step, queue, approval, artifact, and operation state
to change atomically and recover after crashes. Separate JSON files cannot
provide one credible atomic boundary across those records. Traceability also
requires more than current snapshots: the conductor needs an ordered event
history and explicit effect intents so ambiguous external effects are
reconciled rather than blindly retried.

## What Changes

- Add one transactional local conductor control store with schema migrations.
- Record append-only versioned events and materialized current-state
  projections in the same transaction.
- Separate deterministic workflow decisions from external effects.
- Persist an immutable effect intent before execution and reconcile ambiguous
  outcomes before any retry.
- Keep large artifact contents as files while storing their metadata and hashes
  transactionally.

## Capabilities

### New Capabilities

- `conductor-run-store`: Transactional durable control state, append-only event
  history, schema migration, and effect reconciliation for conductor runs.

## Impact

- **Code (new):** `electron/conductor/run-store/`.
- **Depends on:** `add-conductor-config`.
- **Consumed by:** worktrees, artifacts, execution adapter, and approval gates.
- **Migration:** generated conductor state is versioned and migrated; committed
  config remains outside the store.
