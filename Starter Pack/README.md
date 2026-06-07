# Starter Pack

This directory contains product intent, the living MVP plan, safety policy, and
supporting research for the Role-Aware Conductor. It is deliberately smaller
than the original discovery bundle: completed alignment reports and the raw
chat-context bundle were removed after their durable decisions were folded into
this index and `Plan.md`.

## Authority Order

Resolve conflicts in this order:

1. Current repository behavior and constraints.
2. `Goal.md` for the durable MVP outcome, scope, and stop condition.
3. `openspec/changes/add-conductor-*/` for executable requirements and tasks.
4. `Plan.md` for implementation order, discoveries, decisions, and progress.
5. `project-runbook-safe-ai-agent-development.md` for development safety policy.
6. The feature specification for broader product intent.
7. Architecture, rationale, and research documents for background only.

OpenSpec capability specs win over `Plan.md` on behavior and interfaces.
Neither may silently expand the scope fixed by `Goal.md`.

## Read First

1. `Goal.md`
2. `Plan.md`
3. The relevant `openspec/changes/add-conductor-*/` change
4. `project-runbook-safe-ai-agent-development.md` for safety-sensitive work

The ten current conductor changes, in dependency order, are:

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

The machine-readable dependency graph and invariant registry live at
`openspec/conductor-governance.json`; `npm run check:governance` checks this
index, `Goal.md`, `Plan.md`, change directories, and identical agent guidance.

## Durable Decisions

- Build on the existing Parallel Code Electron/SolidJS/Node application.
- Reuse the existing task, worktree, PTY, diff, and MCP coordinator plumbing,
  but add a conductor-specific restricted execution boundary.
- Keep manual Parallel Code task flows unchanged.
- Use Claude for conceptual architecture, UI direction, and readable initial
  planning; require Codex to pressure-test non-trivial plans against the actual
  repository before implementation.
- Use deterministic fixed workflows before any adaptive router or marketplace.
- Consumer-conservative scheduling defaults to 3 active agents and a hard cap
  of 6; it is a local safety policy, not measured provider quota.
- Provider-specific adapters prefer structured control interfaces and expose
  PTY fallback limitations.
- One transactional run store owns lifecycle, approvals, event history, and
  external-effect intents.
- Approval freezes an immutable versioned run manifest.
- Dry-run has zero side effects.
- Never claim a worktree is a filesystem sandbox.
- Never merge, push, install, migrate, or perform a conductor-initiated
  protected operation without its required human gate.
- Never log or persist secret values.
- Keep editor-native integration, swarms, enterprise billing, and long-term
  agent memory outside the MVP.

## Retained Reference Documents

- `role-aware-conductor-feature-with-antfarm-and-gas-town-and-subscription-capacity-constraint.md`
  preserves the broad product specification. It is not the delivery plan.
- `meta_orchestrator_architecture.md` and `meta_orchestrator_rationale.md`
  preserve architectural options and rationale. They are not MVP instructions.
- `online_research_agent_orchestrator_consensus_and_products.md` and
  `Deep Research/` are dated research snapshots. Verify time-sensitive claims
  before using them.

## Removed As Superseded

- `context.md` and `agent_conductor_full_chat_context.md`: raw conversation
  bundles that duplicated the retained documents.
- `alignment-review.md` and `codebase-alignment-report.md`: completed review
  snapshots whose current decisions now live here and in `Plan.md`.
- `conductor-mvp-roadmap.md`: duplicated the delivery sequence now maintained in
  `Plan.md` and OpenSpec.

Tracked removed snapshots remain recoverable from Git history. The untracked
raw context bundle was intentionally discarded.
