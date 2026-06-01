# Role-Aware Conductor — MVP Roadmap & Backlog

**Date:** 2026-06-01
**Owner:** Human Lead (Ameen)
**Source of intent:** `role-aware-conductor-feature-with-antfarm-and-gas-town-and-subscription-capacity-constraint.md`
**Source of truth for delivery:** `openspec/changes/add-conductor-*`
**Safety protocol:** `project-runbook-safe-ai-agent-development.md`

This roadmap sequences the MVP (feature spec §29A, first-build tickets §52)
into the repository's OpenSpec change units. It is the bridge between product
intent (Starter Pack) and executable, human-gated delivery (OpenSpec).

---

## 1. Principles

- **Spec before code.** No conductor behavior is implemented before its
  OpenSpec change is proposed, scenario-tested on paper, and validated with
  `openspec validate --all --strict`.
- **Small, ordered diffs.** One change at a time, in dependency order. Each
  ships behind the human approval gates the runbook requires.
- **Subscription-aware by default.** Consumer Subscription mode, 3 active
  agents normal / 6 hard cap, medium effort default. No agent swarms.
- **Deterministic and auditable.** Fixed JSON/YAML recipes, structured
  artifacts, no ML router on day one.

## 2. Dependency Order

```text
add-conductor-config        (foundation: nothing else works without it)
  ├─ add-conductor-auth-inspector
  ├─ add-conductor-scheduler
  └─ add-conductor-dry-run            (needs config; consumes scheduler + auth)
        └─ add-conductor-worktrees
              └─ add-conductor-artifacts
                    └─ add-conductor-approval-gates  (human gates + basic run states)
```

Rationale: config is the spine (role resolver + preset). Auth inspector and
scheduler are independent of each other but both feed the dry-run preview.
Dry-run is the first user-visible behavior and must exist before any real
agent launches. Worktrees precede artifacts (artifacts are written into the
run dir created alongside the worktree). Approval gates are last because they
wrap the write/commit/merge operations introduced by worktrees + artifacts.

## 3. Phases

### Phase 0 — Foundation (no agents launched yet)

| Change | MVP item (§29A / ticket §52) | Capability spec |
|---|---|---|
| `add-conductor-config` | 4, 5 / Ticket 2 | `conductor-config` |
| `add-conductor-auth-inspector` | 13 / Ticket 3 | `conductor-auth-inspector` |
| `add-conductor-scheduler` | 14 | `conductor-scheduler` |

Exit criteria: `conductor.yaml` + `roles.yaml` load and validate; Ameen's
Default preset resolves roles→agents; API-key env vars are detected and warned;
capacity caps (3/6) are enforced as pure policy with no agents running.

### Phase 1 — Planning surface (still no writes)

| Change | MVP item | Capability spec |
|---|---|---|
| `add-conductor-dry-run` | 6, 7, 11 / Ticket 4 | `conductor-dry-run` |

Exit criteria: `/conduct <task> --dry-run` classifies the task, selects a
workflow (`plan-implement-review` vs `ui-build-verify`), and shows the agents,
worktrees, permissions, expected artifacts, capacity plan, and auth warnings —
then waits for explicit approve/cancel. No agent is launched.

### Phase 2 — Isolated execution + handoff

| Change | MVP item | Capability spec |
|---|---|---|
| `add-conductor-worktrees` | 9 / Ticket 5 | `conductor-worktrees` |
| `add-conductor-artifacts` | 10 / Ticket 6 | `conductor-artifacts` |

Exit criteria: writable roles run in `.worktrees/`; protected paths are
deny/ask-enforced; each run gets `.parallel-code/artifacts/runs/<run-id>/` and
the plan→implementation→review→final artifacts move between steps as files,
not transcripts.

### Phase 3 — Human gates (closes the loop)

| Change | MVP item | Capability spec |
|---|---|---|
| `add-conductor-approval-gates` | 15 / Ticket 6 | `conductor-approval-gates` |

Exit criteria: plan approval before implementation; fix approval before merge;
no commit/push/merge/package-install/migration/protected-path write without an
explicit human gate. The run exposes basic states: `ready-for-review`,
`ready-for-merge`, `blocked`, `failed`, `needs-human`, and `retry-once`.
The §52 "first real workflow" runs end to end.

## 4. Acceptance Traceability

Feature-spec acceptance criteria (§20) and capacity criteria (§45) map to
changes as follows. Each criterion becomes one or more WHEN/THEN scenarios in
the relevant `spec.md`.

| Acceptance criterion (abbrev.) | Change |
|---|---|
| Reads `.parallel-code/conductor.yaml` (§20.1) | config |
| Bind Codex/Claude/Gemini to roles (§20.2) | config |
| `/conduct` creates a run + resolves workflow (§20.3–4) | dry-run |
| Worktrees per policy (§20.5) | worktrees |
| Planner→Implementer→Reviewer→Fixer artifacts (§20.7–11) | artifacts |
| Artifacts under `runs/<run-id>/` (§20.12) | artifacts |
| Per-run role/agent/task/artifact traceability | artifacts |
| Approve plan + final merge (§20.13) | approval-gates |
| Ready-for-review / ready-for-merge states | approval-gates |
| Warn on API keys bypassing subscription (§20.14) | auth-inspector |
| Block/ask before protected operations (§20.15) | worktrees + approval-gates |
| Consumer Subscription mode, max 6, warn >6, block 20–30 (§45.1–4) | scheduler |
| Per-role effort defaults, routine=low, approval for high (§45.5–8) | scheduler |
| Queue excess; show capacity plan before large runs (§45.9–10) | scheduler + dry-run |
| Basic blocked/failed/needs-human/retry-once states | approval-gates |

## 5. Explicitly Out of MVP Scope

Carried from feature spec §29A / §53 — do **not** build until the core loop is
proven: remote workflow registry/marketplace, 20–30 agent swarms, autonomous
cron/patrol agents, bors-style bisecting merge queue, persistent long-term
memory beyond safe summaries, editor-native (Zed) path, VS Code extension,
cloud sync, team collaboration, hosted billing / model proxy, enterprise API
budget mode.

MVP keeps the narrow versions only: consumer 3/6 scheduler, fixed recipe
schema/presets, per-run role traceability, basic run states, and
human-approved review/merge readiness.

P1 follow-ons (after MVP, separate future changes): problems view, activity
feed, workflow recipe manager UI, persistent long-term agent identity
summaries, resume interrupted runs, nudge/handoff/reassign, workflow-pack
security review, autonomous or batched merge queues, prime-context recovery.

## 6. Definition of Done (per change)

1. `proposal.md`, `tasks.md`, `specs/<cap>/spec.md` present and focused.
2. `openspec validate --all --strict` passes.
3. Implementation matches scenarios; `npm run typecheck` clean; unit tests for
   the new IPC/logic pass.
4. Human approval obtained at the gates the runbook requires.
5. Change archived into `openspec/specs/` on ship.
