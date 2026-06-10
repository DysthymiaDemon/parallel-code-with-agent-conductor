# ADR 0002: Transactional Run Store

- Status: Accepted
- Date: 2026-06-07

## Decision

Use one transactional local store for conductor runs, steps, queue entries,
approvals, artifact metadata, append-only events, and external-effect intents.
Do not split authority across JSON counters or state files.

## Rationale

State transitions, events, gates, and effect intents must commit atomically to
recover safely from crashes. Ambiguous external effects require reconciliation,
not blind retry.

## Consequences

The implementation must verify the selected embedded-store dependency against
Electron packaging and macOS/Linux distribution before installation. SQLite is
the preferred candidate, not a pre-approved dependency.
