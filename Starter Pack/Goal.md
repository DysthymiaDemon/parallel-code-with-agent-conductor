# Codex /goal Entry Point: Conductor MVP

## /goal Command

```text
/goal Implement the MVP Guided Role-Aware Conductor for Parallel Code.
Read Starter Pack/README.md, Goal.md, Plan.md, and
openspec/conductor-governance.json first. Implement the ten OpenSpec changes in
dependency order. Validate governance and OpenSpec before implementation.
```

## Objective

Turn the existing Parallel Code Electron app into a safe guided conductor. A
user describes one task; the app deterministically previews a role-to-agent
workflow without side effects, freezes the approved run manifest, and executes
it through provider-specific adapters, enforceable role sandboxes, a
transactional run store, structured artifacts, consumer-conservative admission,
and human-authorized privileged operations.

## Stop Condition

Stop only when all are demonstrable:

1. A conduct request deterministically selects a fixed workflow and resolves
   registered agents/adapters without launching or writing.
2. Dry-run shows workflow, role/agent/adapter assignments, capability limits,
   auth posture, capacity plan, worktree plan, artifact contracts, permissions,
   gates, and manifest digest.
3. Approval transactionally creates the run and freezes an immutable manifest;
   cancel creates no run, worktree, process, or artifact.
4. Provider adapters prefer structured interfaces; PTY fallback is explicit
   and fails closed when a required capability is absent.
5. Writable/read-only roles use enforceable macOS/Linux sandbox profiles and
   minimal child environments. A worktree is never claimed as a sandbox.
6. One transactional store owns runs, steps, queue, gates, artifact metadata,
   append-only events, and immutable effect intents.
7. Roles exchange only declared, verified artifacts; the conductor synthesizes
   the canonical `final-summary.md`.
8. Privileged conductor effects are authorized at final backend entrypoints;
   ambiguous effects are reconciled and never blindly retried.
9. Auth posture never assumes subscription from absent keys, never silently
   changes billing route, and never exposes secret values.
10. Existing manual task flows remain unchanged and all validation passes or
    blockers are recorded.

## MVP Scope

- Four fixed workflows: `simple-codex`, `plan-implement-review`,
  `ui-build-verify`, `bug-hunt`.
- Default bindings: planner/reviewer `claude-code`; implementer/fixer `codex`;
  UI verifier `antigravity` with `gemini` fallback.
- Consumer-conservative admission: target 3 active agents, hard cap 6.
- Auth key-name inspection includes `OPENAI_API_KEY`, explicit
  `CODEX_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, and `GOOGLE_API_KEY`.
- Canonical artifacts: `plan.md`, `accepted-plan.md`,
  `implementation.diff`, `test-report.json`, `code-review.md`, optional
  `ui-review.md`/screenshots, and conductor-owned `final-summary.md`.
- Human authorization for commit, merge, push, install, migration, delete, and
  protected-path operations.

Out of scope: adaptive workflow marketplaces, swarms, enterprise billing
optimization, cloud collaboration, editor forks, and long-term agent memory.

## Delivery Map

1. `add-conductor-config`
2. `add-conductor-agent-adapters`
3. `add-conductor-auth-inspector`
4. `add-conductor-scheduler`
5. `add-conductor-run-store`
6. `add-conductor-dry-run`
7. `add-conductor-worktrees`
8. `add-conductor-artifacts`
9. `add-conductor-execution-adapter`
10. `add-conductor-approval-gates`

The detailed dependency graph and invariant IDs are authoritative in
`openspec/conductor-governance.json`.

## Non-Negotiables

- Spec before code; no install or migration without a human gate.
- Strict TypeScript, existing Electron IPC conventions, macOS/Linux only.
- Secret values never enter logs, events, results, artifacts, or persistence.
- Dry-run has zero side effects.
- Approved manifests and effect intents are immutable.
- Provider state cannot supersede conductor durable state.
- Manual Parallel Code behavior remains unchanged.

## Validation

```bash
npm run check:governance
npm run check:spec
npm run typecheck
npm test
npm run lint:arch
npm run lint:dead
```
