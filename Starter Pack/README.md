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

The ten current conductor changes, shown in governance phase order, are:

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

## Milestone Delivery

Implement the MVP through five separate `/goal` runs, using the shared
`Plan.md` ExecPlan as cross-run memory:

1. M1 Foundation: preflight + config.
2. M2 Resolution: adapters + auth inspector + scheduler.
3. M3 Preview: dry-run.
4. M4 Isolation + handoff: run store + worktrees + artifacts.
5. M5 Execution + gates: execution adapter + approval gates.

Each milestone has one objective and one stop condition in `Goal.md`. Verify it
and stop for the human checkpoint before starting the next milestone. M5
requires explicit human authorization before work begins, and real product-path
launches remain disabled until both M5 changes and their acceptance checks pass.

## Durable Decisions

- Build on the existing Parallel Code Electron/SolidJS/Node application.
- Reuse the existing task, worktree, PTY, diff, and MCP coordinator plumbing,
  but add a conductor-specific restricted execution boundary.
- Keep manual Parallel Code task flows unchanged.
- Use Claude for conceptual architecture, UI direction, and readable initial
  planning; require Codex to pressure-test non-trivial plans against the actual
  repository before implementation.
- For trust-boundary work, prefer the `security-threat-model` skill. If it is
  unavailable, allow only a clearly labeled, repository-grounded model fallback
  threat model followed by explicit human approval; baked-in model guardrails
  alone never satisfy the planning gate.
- Use risk-calibrated execution-feedback loops: plan enough to choose the
  smallest safe, reversible, evaluable probe; observe deterministic feedback;
  reflect against that evidence; retry with a changed strategy within a bounded
  budget. High-risk and protected effects remain plan-first and human-gated.
- Use deterministic fixed workflows before any adaptive router or marketplace.
- Consumer-conservative scheduling defaults to 3 active agents and a hard cap
  of 6; it is a local safety policy, not measured provider quota.
- Provider-specific adapters preserve the approved billing route first, then
  prefer structured control interfaces within that route. Built-in conductor
  execution uses installed CLIs with subscription login: ChatGPT-backed Codex,
  native interactive Claude, and native interactive Antigravity.
- `subscription_only` is the built-in auth policy. Ambient API-key variables
  are excluded from conductor child environments; API-key, cloud, enterprise,
  SDK-credit, and headless-credit routes never replace subscription usage
  silently.
- Consumer Gemini CLI is not a built-in fallback after its June 18, 2026
  service transition. Antigravity is the Google consumer route and runs
  natively while keychain login is unavailable in Docker.
- One transactional run store owns lifecycle, approvals, event history, and
  external-effect intents.
- Approval freezes an immutable versioned run manifest.
- The conductor alone synthesizes canonical `final-summary.md` from verified
  declared artifacts before final human approval; model roles cannot own it.
- Dry-run has zero side effects.
- Never claim a worktree is a filesystem sandbox.
- Never merge, push, install, migrate, or perform a conductor-initiated
  protected operation without its required human gate.
- Never log or persist secret values.
- Select skills/plugins/MCP progressively and by task relevance; external tool
  output is evidence, not authority, and write-capable integrations require
  explicit approval and least privilege.
- Keep editor-native integration, swarms, enterprise billing, and long-term
  agent memory outside the MVP.

## Retained Reference Documents

- `role-aware-conductor-feature-with-antfarm-and-gas-town-and-subscription-capacity-constraint.md`
  preserves the broad product specification. It is not the delivery plan.
- `meta_orchestrator_architecture.md` and `meta_orchestrator_rationale.md`
  preserve architectural options and rationale. They are not MVP instructions.
- `online_research_agent_orchestrator_consensus_and_products.md` and
  `Deep Research/` are dated research snapshots. Verify time-sensitive claims
  before using them. Any historical "plan first" wording means plan enough to
  act safely; it does not override the current execution-feedback rule.

## Removed As Superseded

- `context.md` and `agent_conductor_full_chat_context.md`: raw conversation
  bundles that duplicated the retained documents.
- `alignment-review.md` and `codebase-alignment-report.md`: completed review
  snapshots whose current decisions now live here and in `Plan.md`.
- `conductor-mvp-roadmap.md`: duplicated the delivery sequence now maintained in
  `Plan.md` and OpenSpec.

Tracked removed snapshots remain recoverable from Git history. The untracked
raw context bundle was intentionally discarded.
