# Current Architecture Decision: Parallel Code Fork First

**Update date:** 2026-06-01 13:32:40 UTC
**Status:** Retained architecture reference; not authoritative for MVP
interfaces, safety guarantees, or implementation order. Use `README.md`,
`Goal.md`, `Plan.md`, and OpenSpec for current delivery decisions.

```text
Parallel Code fork first.
Reuse/import Electron UI, task/session views, worktree flow, diff/review surfaces, and local CLI process model.
Add role-aware task classification, workflow recipes, conductor state, structured artifacts, scheduler, health/retry/escalation, and human gates.
Keep editor integration optional.
```

---

# Parallel Code with Agent Conductor Architecture

**Update date:** 2026-06-01 13:30:34 UTC
**Current status:** This document has been realigned away from a Zed-first architecture.

The MVP is **not** a future editor-native path. The MVP is a **Parallel Code fork** amended into Parallel Code with Agent Conductor.

Use this as a reference model only; current delivery authority is defined in
`README.md`, `Goal.md`, `Plan.md`, and OpenSpec:

```text
Parallel Code fork
  → import/reuse Electron UI, task/session views, worktree flow, diff/review surfaces, and local CLI process model
  → add role-aware task classification
  → add workflow recipes
  → add conductor run state
  → add structured artifact handoff
  → add subscription-aware scheduler
  → add health/retry/escalation
  → keep editor integration optional
```

Zed, ACP, and desktop integration are later options only.

---

# Parallel Code with Agent Conductor Architecture

## Purpose

This document drafts an architecture for a Parallel Code fork that adds a **meta-orchestrator** between heterogeneous coding agents such as Codex, Claude, and Gemini/Antigravity.

The goal is not to replace Codex, Claude Code, Gemini, or Parallel Code. The goal is to add a thin orchestration layer above Parallel Code’s existing local desktop/task/worktree/CLI capabilities so that one user request can become a coordinated role-aware multi-agent workflow.

The intended operating model is:

```text
Claude thinks.
Codex builds.
Gemini or Antigravity designs / visually verifies.
Claude reviews.
Codex fixes.
User approves.
```

The orchestrator should preserve each provider’s native subscription, authentication, and usage path:

```text
Codex task              → uses Codex / ChatGPT auth
Claude task             → uses Claude Code / Claude Pro auth
Gemini/Antigravity task → uses Google / Gemini / Antigravity auth
Parallel Code fork      → does not proxy model calls
```

This avoids turning the Parallel Code fork into another pooled-credit platform.

---

## 1. High-Level Architecture

```text
User task
  ↓
Meta-Orchestrator
  ↓
Task Planner / Router
  ↓
Specialized agent threads
  ├── Claude: planning / architecture / review
  ├── Codex: implementation / tests / fixes
  └── Gemini or Antigravity: UI / browser / visual verification
  ↓
Worktree Manager
  ↓
Diff Review / Test Gate / Merge Proposal
  ↓
Human approval
```

The Parallel Code fork should behave as a **workflow-aware local CLI conductor**.

It should:

```text
- know available agents
- know their roles
- create isolated worktrees
- send structured context packs
- capture artifacts
- route plans, diffs, screenshots, reviews, and test results
- enforce permissions
- keep the human as final approver
```

The fork should not simply add more chat windows. It should add a workflow layer over those windows.

---

## 2. Product Concept: Parallel Code with Agent Conductor

A possible product name:

```text
Parallel Code with Agent Conductor
```

The main user-facing feature should be:

```text
New Conductor Thread
```

This would appear alongside ordinary agents in Zed’s Agent Panel:

```text
Agent selector:
  Zed Agent
  Codex
  Claude Agent
  Gemini / Antigravity
  Conductor
```

A Conductor thread is not a normal chat thread. It is a workflow controller.

Example user prompt:

```text
Build a student dashboard.

Use Claude to plan the architecture.
Use Codex to implement.
Use Gemini or Antigravity to propose/verify the UI.
Use Claude to review the final diff.
Ask me before merging.
```

The Conductor should render a live workflow board:

```text
Task: Student dashboard

[✓] Claude Plan
[●] Codex Implementation
[ ] Gemini UI Pass
[ ] Claude Review
[ ] Codex Fixes
[ ] Final Human Approval
```

---

## 3. Existing Parallel Code Substrate

Parallel Code already has many of the required MVP primitives:

```text
- Electron/SolidJS desktop UI
- local CLI process spawning
- task/session panes
- git branch and worktree isolation
- diff review surfaces
- remote/mobile monitoring
- coordinator MCP backend
- Antigravity/Codex/Claude/Gemini-style agent registry
```

Zed remains useful research context because its documentation describes external agents through ACP and parallel agent threads. Those references support the market direction, but they are not the implementation base for this MVP.

Relevant references:

- [Zed external agents documentation](https://zed.dev/docs/ai/external-agents)
- [Zed parallel agents documentation](https://zed.dev/docs/ai/parallel-agents)
- [Agent Client Protocol GitHub repository](https://github.com/agentclientprotocol/agent-client-protocol)

The missing layer is explicit orchestration:

```text
- automatic or semi-automatic task routing
- cross-thread messaging
- role-based agent assignment
- workflow templates
- artifacts
- test gates
- permission gates
- budget-aware routing
- human approval checkpoints
```

---

## 4. New Module Group: `conductor`

Add a new conductor module group:

```text
electron/conductor/
src/conductor/
src/ipc/conductor-types.ts
```

Suggested module layout:

```text
electron/conductor/
  config.ts
  router.ts
  workflow.ts
  dispatcher.ts
  context-pack.ts
  artifact-store.ts
  permissions.ts
  scheduler.ts
  health.ts

src/conductor/
  ConductorDashboard.tsx
  RoleSettings.tsx
  RunTimeline.tsx
  ArtifactViewer.tsx
```

This module should not implement Codex, Claude, or Gemini itself. It should call into the fork’s local CLI process runner and worktree/task infrastructure.

The architecture should keep the core separable:

```text
Parallel Code fork integration:
  UI, threads, worktrees, diffs, permissions

Standalone orchestrator core:
  workflow graph, routing, policies, artifact store
```

That keeps open the possibility of running the same orchestration core later as:

```text
- a Zed feature
- a standalone CLI
- an ACP agent
- a daemon
- a headless CI-style orchestrator
```

---

## 5. Role Registry

The orchestrator should route by **role**, not by hard-coded provider names.

Default roles:

```text
Planner       → Claude
Implementer   → Codex
UI Designer   → Gemini / Antigravity
Reviewer      → Claude
Fixer         → Codex
Tester        → Codex
Explainer     → Claude or Codex
```

The user can override these defaults.

Example config:

```toml
[orchestrator.roles.planner]
preferred_agents = ["claude"]
fallback_agents = ["codex"]
description = "Architecture, decomposition, edge cases, plan review"

[orchestrator.roles.implementer]
preferred_agents = ["codex"]
fallback_agents = ["claude"]
description = "Code changes, tests, refactors, bug fixes"

[orchestrator.roles.ui_designer]
preferred_agents = ["antigravity", "gemini"]
fallback_agents = ["claude"]
description = "UI variants, visual checks, browser verification"

[orchestrator.roles.reviewer]
preferred_agents = ["claude"]
fallback_agents = ["codex"]
description = "Diff review, risk analysis, security, maintainability"
```

Possible TypeScript/Electron model:

```rust
type AgentRole {
    Planner,
    Implementer,
    UiDesigner,
    Reviewer,
    Tester,
    Fixer,
    Explainer,
}

interface AgentCapabilityProfile {
    agent_id: AgentId,
    provider: Provider,
    roles: Vec<AgentRole>,
    supports_file_edits: bool,
    supports_terminal: bool,
    supports_browser: bool,
    supports_images: bool,
    supports_worktrees: bool,
    max_context_hint: Option<u64>,
    cost_class: CostClass,
    auth_mode: AuthMode,
}
```

This prevents the architecture from becoming brittle. The defaults can reflect the preferred model split, but the system should support other configurations.

---

## 6. Workflow DSL

A small workflow DSL should define repeatable multi-agent workflows.

Start with YAML or TOML.

Example:

```yaml
name: feature_build_review
trigger: manual

roles:
  planner: claude
  implementer: codex
  ui_designer: antigravity
  reviewer: claude
  fixer: codex

steps:
  - id: plan
    role: planner
    mode: read_only
    prompt: |
      Read AGENTS.md and the task. Produce an implementation plan,
      acceptance criteria, risk list, and test plan.
    outputs:
      - plan.md
      - acceptance_criteria.md

  - id: implement
    role: implementer
    worktree: new_branch
    depends_on: [plan]
    prompt: |
      Implement the accepted plan. Keep the diff small.
      Run lint, typecheck, and tests.
    outputs:
      - diff
      - test_report

  - id: ui_review
    role: ui_designer
    condition: "task.labels contains 'ui'"
    worktree: same_as_implement
    prompt: |
      Review the UI. Propose improvements or visual fixes.
      Use browser verification if available.
    outputs:
      - ui_notes.md
      - screenshots

  - id: code_review
    role: reviewer
    mode: read_only
    depends_on: [implement]
    prompt: |
      Review the diff against main.
      Return blocking issues first.
    outputs:
      - review.md

  - id: fix
    role: fixer
    depends_on: [code_review]
    condition: 'review.blocking_issues > 0'
    prompt: |
      Fix only the accepted blocking issues.
      Re-run checks.
    outputs:
      - final_diff
      - final_test_report

  - id: human_gate
    type: approval
    prompt: 'Approve final diff for merge?'
```

Built-in workflows:

```text
/plan-implement-review
/two-minds-review
/ui-build-verify
/bug-hunt
/refactor-safe
/test-gap-analysis
/security-review
```

---

## 7. Task Graph Engine

The workflow engine should compile DSL definitions into a DAG.

Possible TypeScript/Electron structures:

```rust
interface TaskGraph {
    nodes: Vec<TaskNode>,
    edges: Vec<TaskEdge>,
}

interface TaskNode {
    id: TaskNodeId,
    role: AgentRole,
    agent: Option<AgentId>,
    worktree_policy: WorktreePolicy,
    context_policy: ContextPolicy,
    permission_policy: PermissionPolicy,
    prompt_template: PromptTemplate,
    outputs: Vec<ArtifactKind>,
    status: TaskStatus,
}
```

Task statuses:

```rust
type TaskStatus {
    Pending,
    WaitingForApproval,
    Running,
    WaitingForPeer,
    Failed,
    Cancelled,
    Completed,
    NeedsHumanDecision,
}
```

The task graph engine should support:

```text
- sequential execution
- parallel execution
- fan-out review
- fan-in synthesis
- human gates
- retry with fallback agent
- timeout / cancel
- checkpoint / rollback
```

Example fan-out workflow:

```text
Codex implements feature
  ↓
Claude reviews correctness
Gemini reviews UI
Codex reviews tests
  ↓
Conductor synthesizes all findings
```

---

## 8. Cross-Thread Messaging

Cross-thread messaging is the most important primitive.

The system should allow:

```text
@Claude plan this
@Codex implement Claude's plan
@Gemini review the UI
@Claude review Codex's diff
```

But the real power is internal:

```text
Conductor → Claude: produce plan
Conductor → Codex: implement plan
Conductor → Claude: review diff
Conductor → Codex: fix accepted comments
```

Proposed interface:

```rust
interface ThreadBridge {
    fn create_thread(&self, spec: ThreadSpec) -> Result<ThreadId>;
    fn post_message(&self, thread_id: ThreadId, msg: OrchestratorMessage) -> Result<MessageId>;
    fn subscribe(&self, thread_id: ThreadId) -> Stream<ThreadEvent>;
    fn cancel(&self, thread_id: ThreadId) -> Result<()>;
    fn collect_artifacts(&self, thread_id: ThreadId) -> Result<Vec<Artifact>>;
}
```

The fork should support primitives similar to:

```text
create_thread(agent, worktree, context_pack)
post_to_thread(thread_id, message)
post_to_new_thread(agent, message)
wait_for_peer_replies(thread_ids)
list_agents_and_models()
collect_thread_outputs(thread_id)
```

This directly solves the current manual workflow problem: copying text from Claude into Codex, then from Codex back into Claude.

---

## 9. Context Pack System

The orchestrator should not dump the entire repo into every agent. It should coninterface **context packs** according to role.

Possible structure:

```rust
interface ContextPack {
    task_spec: String,
    repo_rules: Vec<FileRef>,       // AGENTS.md, CLAUDE.md, etc.
    architecture_docs: Vec<FileRef>,
    relevant_files: Vec<FileRef>,
    symbols: Vec<SymbolRef>,
    recent_diff: Option<Diff>,
    test_results: Option<TestReport>,
    previous_outputs: Vec<ArtifactRef>,
}
```

Suggested context policies:

```text
planner:
  AGENTS.md + architecture docs + relevant files + task spec

implementer:
  accepted plan + AGENTS.md + exact files + tests

ui_designer:
  screenshot artifacts + component files + design system docs

reviewer:
  task spec + plan + diff + tests + risk notes

fixer:
  review comments + diff + exact failing tests
```

Benefits:

```text
- lower token usage
- less duplicated repo discovery
- fewer hallucinated assumptions
- better role separation
- cleaner handoffs
```

---

## 10. Worktree Manager

Every writable implementation task should get an isolated worktree.

```rust
type WorktreePolicy {
    ReadOnlyMain,
    NewBranch { prefix: String },
    SameAs(TaskNodeId),
    Scratch,
}
```

Example layout:

```text
main
  ├── .worktrees/feat-dashboard-codex
  ├── .worktrees/ui-dashboard-gemini
  └── .worktrees/review-dashboard-claude
```

Default rules:

```text
Claude planning/review threads default to read-only.
Codex implementation threads get writable worktrees.
Gemini UI threads get either a scratch UI worktree or same implementation branch.
No two writable agents share the same files unless explicitly approved.
```

The operating rule should remain:

```text
One branch, one writable agent, one task.
```

This prevents merge noise and accidental conflicts.

---

## 11. Conflict and Merge Model

The orchestrator should never auto-merge directly to main.

Use a staged merge model:

```text
Agent output
  ↓
Patch capture
  ↓
Static checks
  ↓
Conflict detector
  ↓
Human review
  ↓
Optional squash/commit
```

Add file leases:

```rust
interface FileLease {
    path: PathBuf,
    holder: TaskNodeId,
    mode: LeaseMode, // Read, Write, ExclusiveWrite
    expires_at: Instant,
}
```

Before an agent edits, the orchestrator checks:

```text
Does any running task have an exclusive write lease on this file?
```

If yes:

```text
block
queue
or ask human to allow shared edits
```

This is the difference between safe parallelism and chaos.

---

## 12. Permission Model

The orchestrator needs explicit permissions.

Permission categories:

```text
file_read
file_write
terminal_readonly
terminal_safe_command
terminal_mutating_command
network
browser
package_install
database_migration
secret_access
git_commit
git_push
```

Default policy example:

```toml
[orchestrator.permissions.codex]
file_write = "ask_once_per_task"
terminal_safe_command = "allow"
package_install = "ask"
git_commit = "ask"
git_push = "deny"

[orchestrator.permissions.claude]
file_write = "deny_by_default"
terminal_safe_command = "ask"
git_commit = "deny"

[orchestrator.permissions.gemini_or_antigravity]
file_write = "ask"
browser = "allow_for_localhost"
network = "allowlist"
```

Human gates should be required before:

```text
- first write
- package install
- database migration
- deleting files
- committing
- merging
- pushing
- touching secrets
- running destructive commands
```

---

## 13. Budget and Quota Awareness

The user wants to preserve subscription economics:

```text
Use Codex heavily.
Use Claude sparingly.
Use Gemini/Antigravity aggressively for UI while the student entitlement lasts.
```

Add budget policies:

```rust
interface BudgetPolicy {
    max_parallel_expensive_agents: usize,
    prefer_cheaper_for_review: bool,
    codex_daily_soft_limit: Option<u64>,
    claude_daily_soft_limit: Option<u64>,
    gemini_daily_soft_limit: Option<u64>,
    fallback_order: Vec<AgentId>,
}
```

UI examples:

```text
Estimated cost/usage:
  Codex: high
  Claude: medium
  Gemini: low/free entitlement
```

Routing examples:

```text
Small implementation       → Codex only
Ambiguous architecture     → Claude plan first
Frontend visual task       → Gemini/Antigravity first
Security-sensitive change  → Claude review required
Large refactor             → Claude plan + Codex implementation + Claude review
```

This keeps Claude Pro from being wasted as a second full-time implementer.

---

## 14. Gemini / Antigravity Adapter Abstraction

Do not hard-code Gemini CLI only.

Google has been transitioning Gemini CLI users toward Antigravity CLI for individual consumer-style usage. The architecture should therefore abstract the Google-side agent.

Suggested model:

```rust
type GoogleAgentBackend {
    GeminiCli,
    AntigravityCli,
    AntigravitySdk,
}
```

Role-level config should say:

```text
ui_designer = google_visual_agent
```

not:

```text
ui_designer = gemini_cli
```

Provider adapter layout:

```text
ProviderAdapter
  ├── CodexAcpAdapter
  ├── ClaudeAcpAdapter
  ├── GeminiAcpAdapter
  ├── AntigravityAdapter
  └── CustomAcpAdapter
```

---

## 15. Artifact Store

Each agent should produce structured outputs, not just chat text.

Artifact types:

```rust
type ArtifactKind {
    Plan,
    Diff,
    Review,
    Screenshot,
    TestReport,
    BrowserTrace,
    RiskLog,
    DecisionRecord,
    Patch,
}
```

Suggested storage layout:

```text
.parallel-code/
  runs/
    2026-06-01T10-15-dashboard/
      workflow.yaml
      plan.md
      codex.diff
      test-report.json
      claude-review.md
      gemini-ui-notes.md
      screenshots/
      final-summary.md
```

The UI should render artifacts as tabs:

```text
Plan | Diff | Tests | UI Screenshots | Reviews | Risks | Final PR Summary
```

---

## 16. Evaluators and Gates

The orchestrator should run deterministic evaluators before using another model to reason.

Possible trait:

```rust
interface Evaluator {
    fn evaluate(&self, worktree: &Path) -> EvaluationResult;
}
```

Built-in evaluators:

```text
git diff --check
cargo test
pnpm lint
pnpm typecheck
pnpm test
pytest
go test ./...
npm run build
```

Model-based evaluators:

```text
Claude architecture review
Codex test-gap review
Gemini visual review
```

Gate logic:

```text
If tests fail       → route back to Codex.
If UI issue         → route to Gemini/Antigravity.
If architecture risk→ route to Claude.
If no blockers      → request human approval.
```

---

## 17. Planner / Router Heuristics

Start deterministic. Do not overcomplicate with ML.

Example:

```rust
fn route(task: &TaskSpec) -> WorkflowTemplate {
    if task.has_label("ui") || task.mentions(["layout", "responsive", "design", "component"]) {
        return WorkflowTemplate::UiBuildVerify;
    }

    if task.mentions(["architecture", "migration", "refactor", "security", "auth"]) {
        return WorkflowTemplate::PlanImplementReview;
    }

    if task.mentions(["bug", "failing test", "regression"]) {
        return WorkflowTemplate::BugHunt;
    }

    WorkflowTemplate::SimpleCodexImplementation;
}
```

Default routing table:

```text
Bug fix:
  Codex diagnose + implement
  Claude review if auth/security/data involved

New backend feature:
  Claude plan
  Codex implement
  Claude review

UI feature:
  Claude or Codex creates functional plan
  Gemini/Antigravity designs/verifies UI
  Codex integrates/cleans
  Claude reviews if complex

Large refactor:
  Claude plan
  Codex implements in slices
  Claude reviews each slice
  tests gate every slice

Test generation:
  Codex writes tests
  Claude reviews edge-case coverage
```

---

## 18. Human Interaction Model

The human remains the merge authority.

The orchestrator should ask concise approval questions:

```text
Claude recommends changing auth middleware and session schema.
Codex can implement this in a new branch.

Approve?
[Approve plan] [Edit plan] [Ask Claude for alternatives] [Cancel]
```

Human approval should be required before:

```text
- accepting a plan with schema changes
- writing to protected files
- installing packages
- changing migrations
- committing
- merging
- pushing
- touching secrets
```

The final decision always belongs to the user.

---

## 19. Internal Event Bus

Use an event-sourced design.

Events:

```rust
type OrchestratorEvent {
    RunCreated,
    WorkflowCompiled,
    TaskStarted,
    AgentThreadCreated,
    AgentMessageSent,
    AgentMessageReceived,
    ArtifactProduced,
    PermissionRequested,
    PermissionGranted,
    CommandStarted,
    CommandFinished,
    DiffProduced,
    TestFailed,
    TestPassed,
    TaskCompleted,
    HumanApprovalRequested,
    RunCompleted,
}
```

Benefits:

```text
- replay
- auditability
- crash recovery
- explainability
- debugging
- telemetry
```

---

## 20. Minimal Database Schema

A simple SQLite schema would be enough for an MVP.

```sql
runs(
  id,
  project_id,
  workflow_name,
  status,
  created_at,
  completed_at
);

tasks(
  id,
  run_id,
  role,
  agent_id,
  status,
  worktree_path,
  created_at,
  completed_at
);

threads(
  id,
  task_id,
  zed_thread_id,
  agent_id,
  surface,
  status
);

artifacts(
  id,
  run_id,
  task_id,
  kind,
  path,
  summary,
  created_at
);

events(
  id,
  run_id,
  task_id,
  kind,
  payload_json,
  created_at
);

permissions(
  id,
  run_id,
  task_id,
  category,
  decision,
  created_at
);

file_leases(
  id,
  run_id,
  task_id,
  path,
  mode,
  expires_at
);
```

---

## 21. Historical Architecture Phase Sketch

### Phase 1: Manual Cross-Thread Routing

Goal: remove copy-paste.

Features:

```text
@Claude
@Codex
@Gemini
send selected text/diff/thread output to another agent thread
reply attribution
thread linking
basic artifact capture
```

This solves the first major workflow pain: transferring Claude plans to Codex, Codex diffs to Claude, and Gemini UI notes back into the implementation thread.

### Phase 2: Workflow Templates

Goal: one command launches a common chain.

Commands:

```text
/conductor plan-implement-review
/conductor ui-build-verify
/conductor bug-hunt
/conductor review-current-diff
```

No complex AI router yet. Use deterministic templates.

### Phase 3: Worktree and Permission Integration

Goal: safe parallelism.

Features:

```text
automatic worktree creation
file leases
read-only review threads
test gates
human approval gates
rollback
```

### Phase 4: Adaptive Router

Goal: natural-language task to workflow.

Features:

```text
task classification
role assignment
budget-aware routing
fallback agents
workflow graph editing
artifact dashboard
```

---

## 22. Killer Feature: `/conduct`

The core command:

```text
/conduct
```

Example:

```text
/conduct Build a responsive onboarding flow.
Use Claude to plan, Codex to implement, Gemini/Antigravity to verify UI,
then Claude to review. Do not merge without approval.
```

The Conductor dashboard renders:

```text
Conductor Run: Responsive onboarding flow

Plan
  Agent: Claude
  Status: Completed
  Artifact: plan.md

Implementation
  Agent: Codex
  Branch: feat/onboarding-flow
  Status: Running

UI Verification
  Agent: Antigravity
  Status: Waiting for implementation

Review
  Agent: Claude
  Status: Pending

Human Gate
  Status: Pending
```

This is the product-level expression of the architecture.

---

## 23. Example End-to-End Workflow

User prompt:

```text
/conduct Build a student dashboard with responsive cards, course progress,
deadlines, and a clean mobile layout. Use Claude to plan, Codex to implement,
Gemini/Antigravity to verify the UI, Claude to review, and ask me before merge.
```

Execution:

```text
1. Conductor creates run.
2. Router classifies task as UI + feature implementation.
3. Worktree Manager creates feat/student-dashboard.
4. Claude receives context pack and creates plan.
5. User approves or edits plan.
6. Codex receives approved plan and implements.
7. Evaluator runs lint/typecheck/tests/build.
8. Gemini/Antigravity receives UI context and performs visual/browser check.
9. Claude receives diff, test report, and UI notes for review.
10. Conductor synthesizes findings.
11. Codex fixes accepted blockers.
12. Evaluator reruns checks.
13. User reviews final diff.
14. User approves merge or sends back for another pass.
```

---

## 24. Security and Safety Defaults

The orchestrator should assume agents are powerful and occasionally wrong.

Security defaults:

```text
- deny secret access
- deny git push by default
- ask before package installs
- ask before migrations
- ask before deleting files
- allow only localhost browser access by default
- show all generated diffs before commit
- require human approval before merge
```

Network policy:

```toml
[orchestrator.network]
default = "deny"
allow = [
  "localhost",
  "127.0.0.1",
  "::1"
]
```

Protected paths:

```toml
[orchestrator.protected_paths]
deny_write = [
  ".env",
  ".env.*",
  "secrets/**",
  "infra/prod/**",
  ".github/workflows/deploy.yml"
]
ask_before_write = [
  "migrations/**",
  "package.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "Cargo.toml",
  "Cargo.lock"
]
```

---

## 25. Default Policy for This User’s Preferences

The default policy should be:

```text
Claude = planner / reviewer / risk analyst
Codex = main implementer / test fixer
Gemini or Antigravity = UI designer / visual verifier
Parallel Code with Agent Conductor = cockpit / diff surface / workflow state machine
Git = source of truth
Human = merge authority
```

Budget priorities:

```text
1. Use Codex heavily because ChatGPT Pro is already available.
2. Use Claude Pro selectively for planning, architecture, and review.
3. Use Gemini/Antigravity aggressively for UI while student entitlement remains available.
4. Do not pay for pooled aggregator usage unless the workflow benefit clearly justifies it.
```

---

## 26. Licensing Note

Zed licensing is relevant only if a later editor-native path forks or embeds Zed code. The MVP is a Parallel Code fork and must follow Parallel Code’s repository license obligations.

Reference:

- [Zed source repository](https://github.com/zed-industries/zed)

---

## 27. Final Architecture Summary

The Parallel Code fork should become:

```text
A workflow-aware local CLI conductor.

It knows available agents.
It knows their roles.
It creates isolated worktrees.
It sends structured context packs.
It captures artifacts.
It routes plans, diffs, screenshots, reviews, and test results.
It enforces permissions.
It keeps the human as final approver.
```

The correct abstraction is not:

```text
one chat window with many models
```

It is:

```text
a workflow graph where each node is handled by the best available agent
```

The architecture should preserve the most important economic and workflow advantages:

```text
Codex through ChatGPT Pro
Claude through Claude Pro / Claude Code
Gemini or Antigravity through Google entitlement
Parallel Code with Agent Conductor as the neutral cockpit
Git as the safety boundary
Human as the final decision-maker
```

---

# Implementation Substrate Override

The architecture should be implemented in the Parallel Code fork’s TypeScript/Electron codebase.

Do not start with:

```text
Zed Rust crates
Zed Agent Panel internals
ACP-first thread abstractions
desktop UI assumptions
```

Start with:

```text
Parallel Code task/session model
Parallel Code worktree manager
Parallel Code local CLI runner
Parallel Code diff/review surfaces
Parallel Code Electron/SolidJS frontend
```

Then add:

```text
electron/conductor/*
src/conductor/*
src/ipc/conductor-types.ts
.parallel-code/conductor.yaml
.parallel-code/workflows/*.yaml
.parallel-code/artifacts/runs/*
```
