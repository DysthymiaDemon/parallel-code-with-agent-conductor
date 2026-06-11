# Codex /goal Entry Points: Conductor MVP (Milestone-Sequenced)

## Milestone Goals

The ten OpenSpec changes are delivered as **five milestone goals**, each its own
`/goal` run with a single, evidence-based stop condition. Kick off one milestone
at a time, in order — the dependency DAG in
`openspec/conductor-governance.json` makes M1 → M2 → M3 → M4 → M5 the only safe
sequence, and the side-effect level rises monotonically across them. The shared
Objective, Overall Stop Condition, MVP Scope, Delivery Map, Non-Negotiables, and
Validation below apply to **every** milestone and are not repeated per goal.

Every milestone goal first reads `Starter Pack/README.md`, `Goal.md`, `Plan.md`,
and `openspec/conductor-governance.json`; validates governance and OpenSpec
before implementing; and updates the `Plan.md` Progress, Surprises, and Decision
Log (the cross-goal memory) as it lands.

### M1 — Foundation

- **Covers:** preflight baseline, `add-conductor-config`, `add-conductor-run-store`.
- **Side-effect level:** zero runtime side effects — no agent launches, no
  working-tree mutation; durable config/state confined to `.parallel-code/`.

```text
/goal Land the conductor foundation milestone (M1). Read Starter Pack/README.md,
Goal.md, Plan.md, and openspec/conductor-governance.json first. Validate
governance and OpenSpec, then implement add-conductor-config and
add-conductor-run-store in dependency order. Update Plan.md Progress/Surprises/
Decision Log. Stop when the milestone stop condition is met.
```

- **Stop condition:** baseline checks pass, a missing config resolves
  **Ameen's Default** in memory with a deterministic role resolver, explicit
  initialization can persist it without overwriting existing config, and the
  single transactional run store persists append-only events and immutable
  manifests — with no writes outside `.parallel-code/`.

### M2 — Resolution (read-only)

- **Covers:** `add-conductor-agent-adapters`, `add-conductor-auth-inspector`,
  `add-conductor-scheduler` (the three siblings on top of config).
- **Side-effect level:** zero runtime side effects — structured resolution only,
  no launches and no provider calls.

```text
/goal Land the conductor resolution milestone (M2). Read Starter Pack/README.md,
Goal.md, Plan.md, and openspec/conductor-governance.json first. Requires M1.
Validate governance and OpenSpec, then implement add-conductor-agent-adapters,
add-conductor-auth-inspector, and add-conductor-scheduler in dependency order.
Update Plan.md Progress/Surprises/Decision Log. Stop when the milestone stop
condition is met.
```

- **Stop condition:** adapters preserve installed-CLI subscription routes
  before selecting structured or PTY control, auth posture is secret-safe and
  subscription-only by default, and admission is a pure function holding the
  consumer-conservative target of 3 active agents / hard cap 6.

### M3 — Preview (first human demo gate)

- **Covers:** `add-conductor-dry-run`.
- **Side-effect level:** zero runtime side effects by contract — preview only;
  this is the **first human demo gate**, where a person inspects the plan before
  anything can launch.

```text
/goal Land the conductor dry-run milestone (M3). Read Starter Pack/README.md,
Goal.md, Plan.md, and openspec/conductor-governance.json first. Requires M1 and
M2. Validate governance and OpenSpec, then implement add-conductor-dry-run.
Update Plan.md Progress/Surprises/Decision Log. Stop when the milestone stop
condition is met.
```

- **Stop condition:** a described task deterministically selects a fixed
  workflow and renders the full preview (roles/agents/adapters, capacity plan,
  auth warnings, worktree plan, artifact contracts, gates, manifest digest) with
  an approve/cancel decision that produces **zero** side effects on cancel.

### M4 — Isolation + handoff

- **Covers:** `add-conductor-worktrees`, `add-conductor-artifacts` (siblings on
  config + run store).
- **Side-effect level:** git/filesystem scaffolding only — worktree creation and
  artifact storage; still **no agent launches** and no provider execution.

```text
/goal Land the conductor isolation-and-handoff milestone (M4). Read
Starter Pack/README.md, Goal.md, Plan.md, and
openspec/conductor-governance.json first. Requires M1. Validate governance and
OpenSpec, then implement add-conductor-worktrees and add-conductor-artifacts in
dependency order. Update Plan.md Progress/Surprises/Decision Log. Stop when the
milestone stop condition is met.
```

- **Stop condition:** worktrees provide isolation under an enforced
  protected-path policy without claiming a worktree as a sandbox, and roles
  exchange only declared, digest-verified artifacts.

### M5 — Execution + gates (mandatory human gate)

- **Covers:** `add-conductor-execution-adapter`, `add-conductor-approval-gates`.
- **Side-effect level:** **first real launches and mutations** — sandboxed agent
  execution, privileged broker, commit/merge/push/install/migrate/delete. A
  **mandatory human gate** precedes this milestone; it is the highest-risk run.

```text
/goal Land the conductor execution-and-gates milestone (M5). Read
Starter Pack/README.md, Goal.md, Plan.md, and
openspec/conductor-governance.json first. Requires M1 through M4. Validate
governance and OpenSpec, then implement add-conductor-execution-adapter and
add-conductor-approval-gates in dependency order. Update Plan.md Progress/
Surprises/Decision Log. Stop when the milestone stop condition is met.
```

- **Stop condition:** writable/read-only roles execute under enforceable
  sandbox profiles, every privileged effect is authorized at a final backend
  entrypoint against a persisted immutable intent (never blindly retried), and
  the conductor synthesizes verified final evidence before a bound final human
  approval gate governs every commit/merge/push/install/migration/delete/
  protected-path operation.

## Objective

Turn the existing Parallel Code Electron app into a safe guided conductor. A
user describes one task; the app deterministically previews a role-to-agent
workflow without side effects, freezes the approved run manifest, and executes
it through provider-specific adapters, enforceable role sandboxes, a
transactional run store, structured artifacts, consumer-conservative admission,
and human-authorized privileged operations.

## Required Secure Workflow

Security-sensitive `plan-implement-review` runs follow:

```text
Claude secure design
-> Codex repository validation
-> human/spec approval where required
-> Codex small implementation
-> deterministic tests/security checks
-> Codex evidence-grounded fixes
-> Claude intent/security review
-> conductor synthesizes final evidence summary
-> human final approval
```

`security-threat-model` is preferred for trust-boundary design. If unavailable,
Claude may produce a clearly labeled repository-grounded fallback threat model,
but baked-in model guardrails alone never satisfy the planning gate and fallback
use requires explicit human approval before writable implementation.

## Overall Stop Condition

This is the umbrella definition of done for the whole MVP; each clause maps to a
milestone's per-goal stop condition above. The conductor MVP is complete only
when all are demonstrable:

1. A conduct request deterministically selects a fixed workflow and resolves
   registered agents/adapters without launching or writing.
2. Dry-run shows workflow, role/agent/adapter assignments, capability limits,
   auth posture, capacity plan, worktree plan, artifact contracts, permissions,
   gates, and manifest digest.
3. Approval transactionally creates the run and freezes an immutable manifest;
   cancel creates no run, worktree, process, or artifact.
4. Provider adapters preserve the approved billing route first, prefer
   structured interfaces only within that route, and fail closed when a
   required capability or approved route is unavailable.
5. Writable/read-only roles use enforceable macOS/Linux sandbox profiles and
   minimal child environments. A worktree is never claimed as a sandbox.
6. One transactional store owns runs, steps, queue, gates, artifact metadata,
   append-only events, and immutable effect intents.
7. Roles exchange only declared, verified artifacts; the conductor synthesizes
   the canonical `final-summary.md` from secure design, repository validation,
   implementation, test/security-check, and Claude review evidence before final
   human approval.
8. Privileged conductor effects are authorized at final backend entrypoints;
   ambiguous effects are reconciled and never blindly retried.
9. Auth posture never assumes subscription from absent keys, never silently
   changes billing route, and never exposes secret values. Built-in
   `subscription_only` launches installed CLIs, excludes detected API-key
   variables, and permits provider-owned interactive login.
10. Existing manual task flows remain unchanged and all validation passes or
    blockers are recorded.
11. Safe, reversible steps use evidence-grounded bounded retries; each retry
    changes strategy, inputs, or preconditions, while ambiguous or protected
    effects stop for reconciliation or human authorization.

## MVP Scope

- Four fixed workflows: `simple-codex`, `plan-implement-review`,
  `ui-build-verify`, `bug-hunt`.
- Default bindings: planner/reviewer `claude-code`;
  validator/implementer/tester/fixer `codex`; UI verifier `antigravity`.
- Default execution routes: Codex App Server with managed ChatGPT login or
  native Codex PTY fallback; native interactive Claude subscription OAuth;
  native interactive Antigravity account login.
- Default auth policy: `subscription_only`; API-key, cloud, enterprise,
  SDK-credit, and headless-credit routes require explicit non-default policy.
- Consumer Gemini CLI is unavailable as a built-in fallback after June 18, 2026.
- Consumer-conservative admission: target 3 active agents, hard cap 6.
- Auth key-name inspection includes `OPENAI_API_KEY`, explicit
  `CODEX_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, and `GOOGLE_API_KEY`.
- Canonical artifacts: `security-design.md`, `plan.md`,
  `repository-validation.md`, `accepted-plan.md`, `implementation.diff`,
  `test-report.json`, `security-check-report.json`, `code-review.md`, optional
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
- Reflection and retry are grounded in recorded external feedback, bounded, and
  never used to bypass a gate or repeat an ambiguous effect.
- Baked-in model guardrails are defense-in-depth only, not a substitute for a
  reviewable threat model and required human approval.
- No model role writes canonical `final-summary.md`; the conductor synthesizes
  it from verified declared artifacts before final approval.
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
