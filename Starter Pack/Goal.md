# Codex /goal Entry Point — Conductor MVP

## /goal Command

```
/goal Implement the MVP Guided Role-Aware Conductor for Parallel Code.
      Read Starter Pack/Plan.md before starting. Implement in the 7-phase
      dependency order defined there. Run openspec validate --all --strict
      before writing any implementation code. Stop only when the Stop
      Condition below is fully satisfied.
```

This file is the durable Codex objective for the MVP Guided Role-Aware
Conductor. It is the source of truth for the Codex `/goal` run. When this file
and any research doc disagree, this file wins; when this file and the
`openspec/changes/add-conductor-*` proposals disagree on *how*, the OpenSpec
changes win (they are the executable delivery unit), but they must not expand
scope beyond this file.

---

## Objective

Turn the existing Parallel Code app from manual, per-task agent launching into a
safe **guided workflow conductor**. The user describes one task; the app picks
the right role→agent workflow, shows the full plan before anything runs, and
only launches agents after explicit approval — reusing existing Parallel Code
task, worktree, diff, and MCP plumbing. Add role presets, fixed workflow
presets, a conduct dry-run, worktree-backed launch, structured artifact capture,
auth/billing warnings, and human gates on risky actions.

---

## Preflight (do before any implementation code)

These three fixes must be done first. They unblock all later phases.

1. **Fix agent-id drift.** The `add-conductor-config` proposal/tasks/spec bind
   roles to `claude` and `google_visual`, which are not in
   `electron/ipc/agents.ts`. Replace with real ids: `planner→claude-code`,
   `implementer→codex`, `reviewer→claude-code`, `ui_verifier→antigravity`
   (fallback `gemini`), `fixer→codex`.
2. **Resolve the `.parallel-code/` ignore.** `.gitignore` currently ignores all
   of `.parallel-code/` and `.worktrees/`. Narrow it: create
   `.parallel-code/.gitignore` containing `state/\nartifacts/\nworktrees/\nagents/`
   so committed config (`conductor.yaml`, `roles.yaml`, `workflows/`,
   `policies/`) is trackable while runtime state stays ignored.
3. **Confirm the YAML dependency.** `yaml` appears only as a transitive entry in
   `package-lock.json`. Add it as a direct `dependencies` entry (human-gated
   install) before importing it; do not rely on the transitive copy.

---

## Stop Condition

Stop only when **all** of the following are true and demonstrable:

1. A user enters one task and the app deterministically selects a workflow
   preset and role→agent bindings **without launching anything**.
2. A dry-run screen shows, before any side effect: selected workflow, role→agent
   assignments, planned worktrees, capacity plan (active vs. queued),
   auth/billing warnings, expected artifact list, and the approval gates that
   will apply.
3. No agent, worktree, branch, or artifact is created until the user approves
   the dry-run.
4. On approval, agents launch through the **existing** Parallel Code
   task/worktree plumbing (`createTask` → `createWorktree`); writable work lands
   in `.worktrees/`.
5. Each run produces `.parallel-code/artifacts/runs/<run-id>/` containing the
   role artifacts that its workflow defines (subset of the six MVP artifact
   files below).
6. The run records per-step traceability: `run step → role → agent → task id
   → artifact`.
7. Auth/billing warnings appear when any of the listed API-key env vars are
   present — **without ever logging or persisting the secret value**.
8. Merge, push, package install, migration, and destructive filesystem actions
   are blocked behind an explicit human gate; the run surfaces the basic states
   below.
9. The existing manual Parallel Code task flow is unchanged and still works.
10. Validation has been run (see Validation section) or every blocker is
    documented in `final-summary.md`.

**Command-verifiable criteria:** `npx openspec validate --all --strict` passes,
`npm run typecheck` passes, `npx vitest run` green (or blockers recorded), all
four workflow preset YAMLs exist under `.parallel-code/workflows/`, the conduct
dialog renders a dry-run preview for a sample task, and human gates block merge
and push.

---

## In Scope

- **Role preset:** `Ameen's Default — Subscription Aware`.
- **Fixed workflow presets only:** `simple-codex`, `plan-implement-review`,
  `ui-build-verify`, `bug-hunt`. Fixed recipe schema; **no** editor or
  marketplace.
- **Conduct dry-run** screen (deterministic selection, zero side effects).
- **Consumer scheduling:** 3 active agents normal, 6 hard cap, queue the excess,
  show a capacity plan.
- **Artifact files (the full MVP set; a given workflow uses the subset it
  needs):** `plan.md`, `implementation.diff`, `test-report.json`, `ui-review.md`,
  `code-review.md`, `final-summary.md`.
- **Per-run traceability:** run step → role → agent → task id → artifact.
- **Auth warnings** for: `OPENAI_API_KEY`, `CODEX_API_KEY`, `ANTHROPIC_API_KEY`,
  `GEMINI_API_KEY`, `GOOGLE_AI_API_KEY`.
- **Human gates** for: merge, push, package install, migration, destructive
  filesystem actions, and writes to protected paths.
- **Basic run states:** `ready-for-review`, `ready-for-merge`, `blocked`,
  `failed`, `needs-human`, `retry-once`.

## Out Of Scope

- Zed fork; full ACP rewrite.
- Autonomous merge queue — MVP only tracks human-approved review/merge
  readiness.
- 20+ agent / swarm scheduler — MVP supports only 3-normal / 6-hard-cap
  consumer scheduling.
- Complex retry/escalation engine — MVP supports only the basic states above
  (`retry-once`, not N-retry).
- Persistent long-term agent identity/memory — MVP records only per-run
  traceability.
- General workflow DSL editor or recipe marketplace — MVP ships fixed presets
  only.
- Enterprise/API budget mode — MVP supports consumer subscription mode plus
  API-env warnings only.
- VS Code/editor-native integration, cloud sync, team collaboration, hosted
  billing.

---

## Role → Agent Bindings

Roles bind to agent **ids that already exist** in `electron/ipc/agents.ts`.
Do not invent ids. The default preset is:

| Role | Primary agent id | Fallback agent id |
|---|---|---|
| `planner` | `claude-code` | — |
| `implementer` | `codex` | — |
| `reviewer` | `claude-code` | — |
| `ui_verifier` | `antigravity` | `gemini` |
| `fixer` | `codex` | — |

Capacity defaults: `mode: consumer_subscription`, `target_active_agents: 3`,
`max_active_agents: 6`, `default_effort: medium`.

---

## Delivery Map (authoritative "how")

Implement in dependency order; each row is one OpenSpec change under
`openspec/changes/`:

1. `add-conductor-config` — config root, validation, `Ameen's Default` preset,
   role resolver. (Foundation; unblocks all.)
2. `add-conductor-auth-inspector` — API-key detection + subscription warnings
   (no secret values).
3. `add-conductor-scheduler` — 3/6 consumer concurrency caps + capacity plan
   (pure policy, no launches).
4. `add-conductor-dry-run` — task classifier, workflow selection, dry-run
   preview (first user-visible surface; still no writes).
5. `add-conductor-worktrees` — worktree launch via existing plumbing +
   protected-path policy.
6. `add-conductor-artifacts` — `.parallel-code/artifacts/runs/<run-id>/` + role
   artifact handoff + traceability.
7. `add-conductor-approval-gates` — human gates + the basic run states; closes
   the loop.

---

## Constraints & Non-Negotiables

- **Stack:** existing Electron / SolidJS (functional components, signals/stores)
  / strict TypeScript (`strict: true`, no `any`) / Node. Published for
  **macOS and Linux only** — no Windows-specific assumptions.
- **Reuse first:** prefer existing task, agent (`AgentDef`), worktree, diff, and
  MCP plumbing over new abstractions. New conductor logic lives under
  `electron/conductor/`; shared types in `src/ipc/types.ts`; IPC channels in
  `electron/ipc/channels.ts` with preload allowlist entries in
  `electron/preload.cjs`.
- **Spec before code:** each capability ships as its `openspec/changes/
  add-conductor-*` change; `openspec validate --all --strict` must pass before
  implementation and before archive.
- **`.parallel-code/` split:** durable committed config (`conductor.yaml`,
  `roles.yaml`, `workflows/`, `policies/`) must be separate from generated
  runtime state (`state/`, `artifacts/`, `agents/`).
- **Safety:** never merge, push, install, migrate, or write a protected path
  without a human gate. Never log or persist secret values. Dry-run has no side
  effects.
- **Preserve** the existing manual Parallel Code task flow end to end.

---

## Validation

Run and record results (or document blockers) before declaring done:

- `npx openspec validate --all --strict`
- `npm run typecheck`
- `npx vitest run` (unit + integration for new conductor logic)
- Manual smoke: one task → dry-run → approve → existing task/worktree launch →
  artifacts written → `ready-for-review` / `ready-for-merge` gate; and confirm
  the manual task flow still works.
