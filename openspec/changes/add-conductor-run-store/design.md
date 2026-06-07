# Design - Conductor Run Store

## Transactional Boundary

Use one embedded transactional database for conductor control state. SQLite is
the preferred implementation candidate, subject to Electron packaging and
runtime verification before dependency installation.

Tables/projections include runs, steps, queue entries, operations, approvals,
artifact metadata, and schema migrations. An append-only `run_events` history
is written in the same transaction as affected projections.

Large artifacts remain files. Their schema version, content digest, size,
producer, inputs, and path are recorded transactionally.

## Effect Protocol

1. Persist immutable intent and idempotency/reconciliation metadata.
2. Execute the external effect.
3. Persist the observed result.
4. After restart, reconcile observable reality before retrying.

Exactly-once execution is not promised. Non-reconcilable ambiguous effects
block for human recovery.

## Lifecycle

Do not overload one flat state union. Persist orthogonal lifecycle fields:
phase, execution state, outcome, readiness, and retry policy.
