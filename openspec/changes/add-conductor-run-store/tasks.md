## 1. Store and migrations

- [ ] 1.1 Select and verify the embedded transactional database against the
      packaged Electron Node runtime before installing a dependency.
- [ ] 1.2 Add schema migrations and transactional projections for runs, steps,
      queue entries, operations, approvals, and artifact metadata.
- [ ] 1.3 Add an append-only versioned run-event table.

## 2. Lifecycle and effects

- [ ] 2.1 Define orthogonal run lifecycle fields: phase, execution, outcome,
      readiness, and retry policy.
- [ ] 2.2 Persist immutable external-effect intent before execution.
- [ ] 2.3 Reconcile ambiguous effects after restart and never blindly retry a
      non-reconcilable effect.

## 3. Approved manifest

- [ ] 3.1 Persist a versioned immutable approved run manifest and its digest.
- [ ] 3.2 Require execution to consume the approved manifest rather than
      re-resolving mutable config or policy.

## 4. Verification

- [ ] 4.1 Test atomic event/projection commits, migrations, replay equivalence,
      duplicate effect resolution, and ambiguous-effect recovery.
- [ ] 4.2 Add deterministic clock/id generators and crash injection around
      durable writes and external effects.
- [ ] 4.3 `npm run check:spec`, `npm run typecheck`, and `npm test` pass.
