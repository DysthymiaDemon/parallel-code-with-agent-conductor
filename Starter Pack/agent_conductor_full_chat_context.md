# Full Chat Context: Parallel Code with Agent Conductor / Role-Aware Conductor

**Generated:** 2026-06-01 13:05:59 UTC
**Purpose:** Preserve the full project context from this conversation so it can be reused in future chats, agent sessions, GitHub issues, implementation planning, or repository documentation.
**Scope:** This document consolidates the reasoning, decisions, product direction, feature requirements, safety runbook, research findings, and generated Markdown artifacts from the chat.

---

## 0. How to Use This Context File

Use this file as the highest-level context handoff for the project.

Recommended use cases:

```text
1. Give this file to Codex before implementation work.
2. Give this file to Claude before planning/review work.
3. Give this file to Gemini/Antigravity before UI/product work.
4. Put it in the repository as docs/context/project-context.md.
5. Use it to regenerate issues, roadmap items, and implementation tickets.
```

Important precedence:

```text
1. The current primary feature spec is authoritative.
2. The runbook controls how development should be performed safely.
3. Research/supporting docs provide background and justification.
4. Older Zed-first docs are historical context, not the current MVP path.
```

Current primary feature file:

```text
role-aware-conductor-feature-with-antfarm-and-gas-town-and-subscription-capacity-constraint.md
```

Current safety/runbook file:

```text
project-runbook-safe-ai-agent-development.md
```

---

## Latest Alignment Update: Parallel Code Fork, No Zed Yet

**Update date:** 2026-06-01 13:32:40 UTC

```text
We are based on a Parallel Code fork.
We should import/reuse much of Parallel Code’s UI and local workflow machinery.
We should amend that base into a stronger frontend, task consumer/tracker, conductor, and dispatcher.
We do not want Zed editor integration yet.
```

Updated naming:

```text
Repo:      parallel-code-with-agent-conductor
App:       Parallel Code with Agent Conductor
Base:      Parallel Code fork
Config:    .parallel-code/conductor.yaml
Command:   /conduct
```

## 1. Project in One Sentence

Build a **local desktop Role-Aware Conductor** that runs real first-party coding CLIs — Codex, Claude Code, Gemini/Antigravity — assigns them to roles, dispatches them automatically through deterministic workflows, passes structured artifacts between them, isolates writable work in Git worktrees, preserves subscription-based CLI usage where possible, and uses the configured editor as an optional integration bridge.

---

## 2. Current Product Decision

The current implementation decision is:

```text
Start by forking Parallel Code.
Reuse/import much of its Electron UI, task/session layout, worktree flow, diff/review surfaces, and local CLI process model.
Amend that base into a role-aware task tracker, conductor, dispatcher, and run dashboard.
Use real local CLIs for Codex, Claude, and Gemini/Antigravity.
Use Git worktrees for isolated writable work.
Keep the MVP editor-neutral.
Do not build on Zed first.
```

The key reason is scope control.

The product risk is not building a better editor. The product risk is proving the **Role-Aware Conductor**:

```text
- task classification
- automatic role routing
- workflow selection
- CLI dispatch
- structured artifact handoff
- auth/billing safety
- subscription-aware scheduler
- health monitoring
- retry/escalation
- human approval gates
```

Zed remains strategically important, but as an integration target first:

```text
MVP:
  Electron conductor app + real CLIs + worktrees + Open in Editor.

Later:
  Zed extension, ACP bridge, or another editor-native path only if deeper editor integration becomes necessary.
```

---

## 3. Original User Goal and Constraints

The user wanted an agentic coding workflow that combines the strengths of several first-party model products without overpaying for usage through a pooled aggregator.

The user’s starting assumptions and constraints:

```text
- The user has ChatGPT Pro.
- The user may subscribe to Claude Pro.
- The user has Gemini Pro / Google student access still available.
- The user wants moderate-to-heavy coding usage, not light usage.
- The user wants first-party CLI/subscription entitlements preserved.
- The user does not want an extra weak credit pool to become the bottleneck.
- The user prefers Codex/Claude-like agent workspace UI.
- The user does not want Zed/editor integration yet; the immediate need is a good frontend, task consumer/tracker, conductor, dispatcher, and safe local CLI workflow based on a Parallel Code fork.
```

The recurring economic concern:

```text
Do not turn included subscription usage into API billing unless explicitly chosen.
```

This affects the architecture:

```text
Codex should use ChatGPT/Codex login where possible.
Claude should use Claude Code subscription login where possible.
Gemini/Antigravity should use Google account/student entitlement where possible.
The conductor should spawn real CLIs, not proxy everything through its own model API.
```

---

## 4. Core Model/Agent Role Split

The working role split is:

```text
Codex:
  default implementer / fixer / test runner / PR cleanup agent

Claude:
  planner / architect / reviewer / security reviewer / risk analyst / lead conductor

Gemini / Antigravity:
  UI designer / UI verifier / browser verifier / screenshot and visual workflow agent

DeepSeek / open models:
  optional future cheap reviewer, local/private fallback, or cost-control path
```

Important nuance:

```text
This is a default routing policy, not a permanent law.
The app must let the user change role assignments.
```

The default profile is:

```text
Ameen’s Default — Subscription Aware
```

Recommended default:

```text
Lead Conductor:      Claude
Planner:             Claude
Architect:           Claude
Implementer:         Codex
Fixer:               Codex
Reviewer:            Claude
Security Reviewer:   Claude
UI Designer:         Gemini / Antigravity
UI Verifier:         Gemini / Antigravity
Test Runner:         Codex
Docs Writer:         Claude
Fallback Agent:      Codex
```

---

## 5. What Makes the Product Different

Parallel Code-style products generally use this model:

```text
User describes task.
User manually selects Claude / Codex / Gemini.
Selected agent runs in a worktree.
User reviews result.
```

The target product should use this model:

```text
User describes task.
Conductor classifies task.
Conductor selects workflow.
Workflow resolves roles.
Roles resolve to configured agents.
App launches the right CLIs.
Artifacts move between role steps.
Scheduler enforces subscription-aware capacity.
Human approves gates.
```

One-line differentiator:

```text
Parallel Code asks the user to pick an agent.
Role-Aware Conductor lets the user describe the task and automatically dispatches the configured role-agent workflow.
```

---

## 6. Recommended Base Code

Ranking from the conversation:

```text
1. Fork Parallel Code first.
2. Build a fresh Electron app if Parallel Code internals/license/code quality are not suitable.
3. Use Antfarm as a workflow-design reference, not the first fork.
4. Use Gas Town as an operational-safety reference, not the first fork.
5. Treat Zed only as a later optional editor bridge or native integration target, not the first fork.
```

Reason:

```text
Parallel Code is closest to the required app shell:
  - Electron app
  - local CLI spawning
  - git worktrees
  - session/task dashboard
  - diff review
  - editor-independent workflow

The missing layer to add on top of Parallel Code is:
  - automatic role-aware dispatch
  - deterministic workflows
  - structured artifacts
  - subscription-aware scheduler
  - health/retry/escalation
  - optional editor bridge
```

---

## 7. Product Landscape Summary

### Parallel Code

Useful because:

```text
- closest Electron/local CLI/worktree base
- runs actual terminal CLIs
- supports Claude Code, Codex CLI, Gemini CLI, Copilot CLI
- creates branches/worktrees
- keeps user in preferred editor
```

Missing versus target:

```text
- automatic role routing
- Lead Conductor
- Ameen’s Default
- structured role handoff graph
- subscription-aware 3–6 agent scheduler
- health monitor / problems view
- Antfarm-style deterministic pipelines
- Gas Town-style operations safety
```

### Antfarm

Useful reference because it validates:

```text
- deterministic workflows
- planner/developer/verifier/tester/reviewer role separation
- fresh context per step
- YAML/Markdown workflow definitions
- retry and escalation
- dashboard/state semantics
- workflow security review
```

Do not fork first because:

```text
- not the intended desktop app shell
- not focused on first-party Codex/Claude/Gemini CLI subscription preservation
- better as a workflow-engine reference
```

### Gas Town

Useful reference because it validates:

```text
- Mayor/top coordinator pattern
- durable work units
- persistent work state
- persistent agent identity with fresh sessions
- scheduler/capacity control
- health monitoring
- nudge/handoff/retry/reassign
- problems view
- activity feed
- merge queue discipline
```

Do not fork first because:

```text
- too heavy for the starting MVP
- designed around larger-scale agent operations
- user cannot realistically run 20–30 agents on Plus/Pro-style subscriptions
- better as an operational-safety reference
```

### Zed

Useful because:

```text
- strong future desktop target
- external agents / ACP
- parallel agent threads
- worktree support
- fast native editor
- desirable final cockpit
```

Do not fork first because:

```text
- too large a Rust/GPUI codebase
- product risk is conductor logic, not editor internals
- current MVP can use Zed as editor bridge
```

### Cursor

Useful but not aligned with the economic goal:

```text
- strong AI IDE
- polished UX
- agents/worktrees/cloud features
```

Main issue:

```text
It is its own usage/billing layer or BYOK/API model,
not a first-party CLI subscription-preserving conductor.
```

### Warp / Oz

Useful but not the center:

```text
- strong terminal-first agentic environment
- can run CLIs
```

Main issue:

```text
Terminal-first and credit-based/usage-layer concerns.
The user wants local CLI entitlements and editor/worktree conductor behavior.
```

### Google Antigravity

Useful for:

```text
- browser/UI/visual verification
- screenshots
- recordings
- artifacts
- UI agent workflows
```

Main issue:

```text
Google-centric, not neutral Codex + Claude + Gemini conductor.
```

### Conductor

Relevant because:

```text
- parallel Codex + Claude workspaces
- isolated workspaces/worktrees
- polished commercial direction
```

Main issue:

```text
Does not appear to provide the exact cross-provider role-aware router with Gemini/Antigravity,
subscription-aware capacity, and configurable role presets.
```

---

## 8. Public Implementation Check

A review was performed for whether anyone had already forked Parallel Code, Antfarm, Gas Town, Zed, or similar tools into the exact Role-Aware Conductor product.

Finding:

```text
No reviewed public implementation appears to combine the exact target:
local Electron-style desktop app
+ real first-party Codex / Claude / Gemini-Antigravity CLIs
+ automatic task classification
+ role-aware routing
+ configurable role presets such as Ameen’s Default
+ deterministic workflow recipes
+ structured artifact handoff
+ subscription-aware 3–6 agent scheduler
+ optional editor bridge
+ human approval gates
```

This does **not** prove non-existence. A private/internal project or differently named public repo could exist.

Current practical conclusion:

```text
Proceed as if the product gap is real.
Keep watching Parallel Code, Antfarm, Gas Town, Zed, Conductor, Cursor, Warp/Oz, Antigravity, and GitHub Agent HQ.
```

---

## 9. Subscription Capacity Constraint

The conductor must not default to 20–30 agent swarms.

User constraint:

```text
On Plus/Pro/Max-style consumer subscriptions, scaling to 20–30 active agents is not realistic.
The user is comfortable with around 6 active agents at reduced reasoning size,
using medium or low effort rather than x-high/max.
```

Default capacity:

```text
Normal target active agents: 3
Default hard maximum: 6
20–30 agents: out of scope unless future API/enterprise mode is explicitly enabled
```

Default effort policy:

```text
Medium effort for planning/review/implementation.
Low effort for routine tester/verifier/fixer steps.
High/max effort requires approval.
```

Consumer Subscription mode:

```yaml
subscription_capacity:
  mode: consumer_subscription
  target_active_agents: 3
  max_active_agents: 6
  default_reasoning_effort: medium
  heavy_reasoning_effort: ask
  low_effort_for_routine_steps: true
  prevent_agent_swarms: true
```

Scheduler defaults:

```text
Lead Conductor: max 1
Claude Planner/Reviewer: max 1 active Claude role by default
Codex Implementer/Fixer/Test Runner: max 2 active Codex roles by default
Gemini/Antigravity UI Verifier: max 1 active visual role by default
```

---

## 10. Role-Aware Conductor Feature Summary

The Role-Aware Conductor should include:

```text
- settings page
- presets
- role dropdowns
- YAML-backed config
- automatic dispatch
- deterministic workflow recipes
- artifact store
- worktree manager
- agent inventory
- auth/billing inspector
- scheduler/capacity control
- health monitor
- problems view
- activity feed
- retry/escalation
- human approval gates
- optional editor bridge
```

Primary config directory:

```text
.parallel-code/
```

Primary config file:

```text
.parallel-code/conductor.yaml
```

Primary command:

```text
/conduct
```

Example:

```text
/conduct Build a responsive onboarding flow.
```

The app should determine:

```text
- task class
- workflow
- required roles
- configured agents
- worktree policy
- artifact flow
- approval gates
```

---

## 11. Lead Conductor / “Top Guy”

The system needs a top-level coordinator.

Name:

```text
Lead Conductor
```

Recommended default:

```text
Claude
```

Practical implementation:

```text
Hybrid: local deterministic classifier first, Claude fallback for ambiguous/complex tasks.
```

Responsibilities:

```text
- interpret user goal
- classify task
- choose workflow
- decide if planning is required
- decide if UI verification is required
- decide if security review is required
- decompose work into steps if needed
- supervise run progress
- escalate blockers
- summarize status for user
```

---

## 12. Settings UX

Suggested settings hierarchy:

```text
Settings
  → Agent Workflows
    → Role-Aware Conductor
```

Settings line items:

```text
Preset
Lead Conductor
Planner
Architect
Implementer
Fixer
Reviewer
Security Reviewer
UI Designer
UI Verifier
Test Runner
Documentation Writer
Fallback Agent
Routing Mode
Approval Mode
Auth Mode
Artifact Mode
Worktree Mode
Capacity Mode
Default Effort
```

Example:

```text
Preset:              Ameen’s Default — Subscription Aware
Lead Conductor:      Claude
Planner:             Claude
Architect:           Claude
Implementer:         Codex
Fixer:               Codex
Reviewer:            Claude
Security Reviewer:   Claude
UI Designer:         Gemini / Antigravity
UI Verifier:         Gemini / Antigravity
Test Runner:         Codex
Docs Writer:         Claude
Fallback Agent:      Codex
Capacity Mode:       Consumer Subscription
Target Agents:       3
Max Agents:          6
Default Effort:      Medium
Routine Effort:      Low
High/Max Effort:     Ask First
```

Dropdown values should only enable installed/configured agents:

```text
Auto
Claude
Codex
Gemini
Antigravity
Copilot
DeepSeek
Local Model
None
```

---

## 13. Workflow Recipes

Core workflows:

```text
plan-implement-review
ui-build-verify
bug-hunt
refactor-safe
security-sensitive-change
docs-update
test-gap-analysis
dependency-upgrade
auth-change-review
```

MVP workflows:

```text
plan-implement-review
ui-build-verify
```

Workflow example:

```text
Backend feature:
  Claude plan
  Human approve plan
  Codex implement in worktree
  Codex run checks
  Claude review
  Human select review items
  Codex fix
  Human final approval

UI feature:
  Claude plan
  Human approve plan
  Codex implement
  Gemini/Antigravity visual verify
  Human select visual fixes
  Codex fix
  Claude review if needed
  Human final approval
```

---

## 14. Structured Artifact Handoff

Agents should not pass raw chat transcripts.

They should pass typed artifacts.

Artifact sequence:

```text
PlanArtifact
  Claude → Codex

ImplementationArtifact
  Codex → Claude
  Codex → Gemini/Antigravity

UiReviewArtifact
  Gemini/Antigravity → Codex

CodeReviewArtifact
  Claude → Codex

FinalSummaryArtifact
  Codex/Conductor → Human
```

Artifact paths:

```text
.parallel-code/artifacts/runs/<run-id>/
  run.json
  classification.json
  role-map.yaml
  plan.md
  accepted-plan.md
  implementation.diff
  test-report.json
  ui-review.md
  screenshots/
  browser-recording/
  code-review.md
  accepted-review-items.md
  final.diff
  final-test-report.json
  final-summary.md
```

---

## 15. Fresh Context Per Step

Antfarm inspired rule:

```text
Each role step starts with a fresh agent session unless continuity is explicitly needed.
```

The agent should receive:

```text
- required artifacts
- relevant files
- exact step prompt
- current run metadata
```

The agent should not receive by default:

```text
- full prior chat transcript
- unrelated raw logs
- stale context from earlier iterations
```

Config:

```yaml
context_policy:
  default_session_mode: fresh_per_step
  handoff_mode: artifacts_only
  include_full_transcript_by_default: false
  prime_context_enabled: true
```

---

## 16. Health Monitoring and Recovery

Gas Town inspired rules:

Agent health states:

```text
healthy
working
idle
stalled
blocked
zombie
failed
needs_human
```

Recovery actions:

```text
Nudge:
  send short status prompt to same agent

Handoff:
  stop current attempt and start fresh session with current artifacts

Retry:
  rerun same step from last stable artifact

Reassign:
  give step to fallback agent

Escalate:
  ask human to decide
```

Problems view should show:

```text
State
Run
Step
Agent
Suggested action
```

---

## 17. Scheduler and Capacity Control

The scheduler should enforce:

```text
- max active agents
- per-provider concurrency
- expensive-agent caps
- queue when capacity exceeded
- pause on repeated auth/rate-limit failures
```

Default:

```yaml
scheduler:
  enabled: true
  mode: consumer_subscription
  target_active_agents: 3
  max_active_agents: 6
  max_parallel_claude: 1
  max_parallel_codex: 2
  max_parallel_google_visual: 1
  max_parallel_lead_conductor: 1
  queue_when_capacity_exceeded: true
  pause_when_limits_near: true
  auto_downgrade_effort_for_queue: true
```

---

## 18. Worktree Policy

Default:

```text
one writable worktree per task
```

Role permissions:

```text
Lead Conductor:
  no direct writes

Planner:
  read-only

Architect:
  read-only

Implementer:
  writable worktree

Fixer:
  same writable worktree as implementer

Reviewer:
  read-only

Security Reviewer:
  read-only

UI Designer:
  browser/read-only by default

UI Verifier:
  browser/read-only by default

Test Runner:
  terminal-limited in implementation worktree
```

Rule:

```text
Never let two writable agents edit the same branch at the same time.
```

---

## 19. Safety Runbook Summary

The project runbook exists because empirical studies of AI coding tools found failures around:

```text
- API/integration/configuration errors
- terminal problems
- command failures
- tool invocation failures
- command execution failures
- out-of-scope actions
- dependency/reproducibility gaps
- IDE/agent security boundary issues
```

Default operating model:

```text
Claude plans and reviews.
Codex implements and fixes.
Gemini/Antigravity verifies UI.
Human approves high-risk changes and merge.
```

Non-negotiable rules:

```text
1. No agent gets direct push access.
2. No agent merges to main.
3. No agent edits protected files without approval.
4. No agent installs packages without approval.
5. No agent changes auth/billing/secrets/env handling without human review.
6. No agent changes shell command execution logic without security review.
7. No agent performs broad refactors unless the plan was approved first.
8. No agent runs destructive git commands without approval.
9. Every implementation task must have clear acceptance criteria.
10. Every merge must have final human review.
```

Protected areas include:

```text
.env
.env.*
secrets/**
credentials/**
src/main/agent-runner/**
src/main/process/**
src/main/shell/**
src/main/ipc/**
src/main/auth/**
src/main/git/**
src/main/worktrees/**
src/main/config/**
package.json
lockfiles
CI/deployment workflows
```

---

## 20. Auth and Billing Policy

The app must inspect environment variables and warn before an agent run.

Codex warning variables:

```text
CODEX_API_KEY
OPENAI_API_KEY
```

Claude warning variable:

```text
ANTHROPIC_API_KEY
```

Google warning variables:

```text
GEMINI_API_KEY
GOOGLE_AI_API_KEY
```

Required behavior:

```text
- show warning if API key may override subscription mode
- allow "unset for this run"
- allow "use API key once"
- allow cancel
- log selected auth mode in run metadata
```

---

## 21. Shell and Process Safety

Process-spawning rules:

```text
- resolve executable path safely
- validate executable exists
- do not run shell through `sh -c` unless unavoidable
- pass args as arrays
- set cwd to task worktree
- set timeout
- capture stdout/stderr
- capture exit code
- support cancellation
- kill process tree on cancel
- never run in repository root unless task explicitly permits
```

Shell command handling:

```text
- use argument arrays, not string concatenation
- never interpolate user text directly into shell commands
- escape paths safely
- log command, cwd, env diff, exit code, stdout, stderr
- enforce timeout
- redact secrets from logs
```

---

## 22. Naming

Recommended repo/product naming stack:

```text
Repo:              local-agent-conductor
App name:          Parallel Code with Agent Conductor
Base:              Parallel Code fork
Feature name:      Role-Aware Conductor
Default profile:   Ameen’s Default — Subscription Aware
Config dir:         .parallel-code/
Main config:        .parallel-code/conductor.yaml
Command:            /conduct
```

Rationale:

```text
The name keeps the local conductor workflow identity,
while the implementation remains a local Electron sidecar first.
```

---

## 23. First Build Tickets

### Ticket 1: Project Baseline

```text
Goal:
  Establish Electron app baseline or Parallel Code fork baseline.

Acceptance:
  - app launches
  - project can be selected
  - git repo is detected
  - Zed open command can be configured
```

### Ticket 2: Role Profile Config

```text
Goal:
  Add `.parallel-code/conductor.yaml` with Ameen’s Default.

Acceptance:
  - config loads
  - config validates
  - invalid config shows useful error
  - role dropdown data model exists
```

### Ticket 3: Agent Inventory

```text
Goal:
  Detect Codex, Claude, and Gemini/Antigravity CLIs.

Acceptance:
  - installed/missing/auth-unknown states display
  - API-key warning variables are detected
  - no secrets are logged
```

### Ticket 4: Dry-Run Dispatcher

```text
Goal:
  User enters task, app classifies it, selects workflow, and shows planned dispatch without running agents.

Acceptance:
  - plan-implement-review selected for backend feature
  - ui-build-verify selected for UI feature
  - capacity plan shown
  - user can approve or cancel
```

### Ticket 5: Worktree Manager

```text
Goal:
  Create isolated worktree for implementation.

Acceptance:
  - worktree path created under configured root
  - branch created safely
  - dirty repo state handled
  - Open in Editor works
```

### Ticket 6: First Real Workflow

```text
Goal:
  Run plan-implement-review end to end.

Acceptance:
  - Claude produces plan artifact
  - user approves plan
  - Codex receives accepted plan
  - Codex produces diff/test artifact
  - Claude reviews diff
  - final summary is shown
```

---

## 24. Do Not Build Yet

Defer:

```text
- remote workflow marketplace
- autonomous cron agents
- bors-style bisecting merge queue
- persistent long-term memory beyond safe summaries
- full Parallel Code fork
- cloud sync
- team collaboration
- paid model proxy
- hosted billing
- 20–30 agent swarms
- enterprise/API-budget mode
```

---

## 25. Generated Markdown Files

This chat produced or updated these Markdown files.

Current primary docs:

```text
role-aware-conductor-feature-with-antfarm-and-gas-town-and-subscription-capacity-constraint.md
project-runbook-safe-ai-agent-development.md
```

Supporting docs:

```text
gemini_claude_codex_strengths_architecture_handoff.md
online_research_agent_orchestrator_consensus_and_products.md
zed_meta_orchestrator_rationale.md
zed_meta_orchestrator_architecture.md
```

Superseded/historical docs:

```text
roadmap.md
role-aware-conductor-feature.md
```

---

## 26. Chronology of Major Decisions

1. The user asked about Warp and whether it could replace separate Claude/Codex subscriptions.
2. The conclusion was that Warp may be useful but credit-bucket economics are not ideal for moderate-to-heavy usage.
3. The user explored tying together ChatGPT Pro, Claude Pro, and Gemini student access.
4. Zed was considered because of external agents, ACP, and desktop workflow.
5. The initial idea was a Parallel Code fork/meta-orchestrator.
6. The role split was established: Codex implements, Claude plans/reviews, Gemini/Antigravity handles UI/visual/browser work.
7. A feature spec was created for Role-Aware Conductor.
8. The user clarified that it should be a feature spec, not roadmap.md.
9. The user clarified the need for a “top guy” / Lead Conductor.
10. Settings/presets/dropdowns/YAML-backed config were added.
11. Parallel Code was identified as an Electron app and close base.
12. The recommendation shifted from Parallel Code fork first to Electron/Parallel Code first.
13. Antfarm and Gas Town were reviewed and incorporated as references.
14. Subscription capacity constraints were added: 3 normal, 6 max, no 20–30 agent swarms on Plus/Pro.
15. The final base-code recommendation became: fork Parallel Code first, borrow Antfarm workflows, borrow Gas Town safety, use optional editor bridge.
16. A public implementation check found no reviewed public project matching the exact target.

---

## 27. Source and Research References Mentioned

Important sources referenced during the chat included:

```text
Parallel Code:
  https://parallelcode.app/
  https://parallelcode.app/blog/multi-agent-coding-tools-2026/

Antfarm:
  https://github.com/snarktank/antfarm

Gas Town:
  https://github.com/gastownhall/gastown

Zed:
  https://zed.dev/docs/ai/external-agents
  https://zed.dev/docs/ai/parallel-agents
  https://zed.dev/blog/chatgpt-subscription-in-zed
  https://github.com/zed-industries/zed

OpenAI Codex:
  https://developers.openai.com/codex/auth
  https://developers.openai.com/codex/pricing
  https://developers.openai.com/codex/subagents

Claude Code:
  https://code.claude.com/docs/en/agents
  https://code.claude.com/docs/en/agent-teams
  https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan
  https://support.claude.com/en/articles/12304248-manage-api-key-environment-variables-in-claude-code

Google Antigravity / Gemini:
  https://antigravity.google/docs/home
  https://antigravity.google/docs/artifacts
  https://antigravity.google/docs/screenshots
  https://developers.googleblog.com/

Benchmarks/research:
  https://www.tbench.ai/leaderboard/terminal-bench/2.1
  https://arxiv.org/abs/2603.20847
  https://arxiv.org/abs/2605.18583
  https://arxiv.org/abs/2604.22750
  https://arxiv.org/abs/2602.17100
```

---

## 28. Key Caveats

```text
- Public implementation search is not proof of non-existence.
- Private projects or differently named repos may exist.
- Model rankings can change quickly.
- Vendor CLI auth behavior can change.
- Gemini/Antigravity product direction may keep shifting.
- The first implementation should avoid claiming too much.
- The correct product claim is a practical product-gap claim, not a formal novelty claim.
```

---

## 29. Best Next Action

The immediate next action should be:

```text
Fork or inspect Parallel Code.
Assess architecture, license, code quality, and coupling to manual agent selection.
Create branch: feat/role-aware-conductor-mvp
Add `.parallel-code/conductor.yaml`
Implement dry-run dispatcher before running any agents.
```

Recommended first Codex task:

```text
Read the codebase and identify where tasks, agents, worktrees, and process spawning are implemented.
Do not change code.
Produce an architecture map and propose the smallest insertion point for a Role-Aware Conductor dry-run mode.
```

Recommended first Claude task:

```text
Review the Role-Aware Conductor feature spec and project runbook.
Create a phased implementation plan for adding the conductor to a Parallel Code fork.
Focus on risk boundaries: process spawning, auth/env handling, worktrees, and config validation.
```

---

# Appendices

The following appendices include the generated Markdown artifacts from the conversation. The current primary spec appears first, followed by the runbook, then supporting and historical documents.



---

# Appendix: role-aware-conductor-feature-with-antfarm-and-gas-town-and-subscription-capacity-constraint.md — CURRENT PRIMARY FEATURE SPEC

```text
File path: /mnt/data/role-aware-conductor-feature-with-antfarm-and-gas-town-and-subscription-capacity-constraint.md
Size: 81600 bytes
```

# Feature Specification: Role-Aware Conductor

**Feature name:** Role-Aware Conductor
**Suggested file name:** `role-aware-conductor-feature-with-antfarm-and-gas-town-and-subscription-capacity-constraint.md`
**Project context:** Parallel Code-style Electron app first; optional editor bridge or Parallel Code fork later
**Feature type:** Local desktop multi-agent CLI orchestration with editor bridge
**Status:** Draft feature specification
**Date:** 2026-06-01

---

## 0. Starting Baseline Decision

This file is the starting specification for the first build.

The current implementation decision is:

```text
Start with a Parallel Code-style Electron desktop app.
Use real local CLIs for Codex, Claude, and Gemini/Antigravity.
Use git worktrees for isolated writable work.
Use the configured editor as an optional integration via "Open in Editor" and editor-bridge actions.
Do not build on Zed first.
```

The reason is scope control. The differentiator is not a new editor. The differentiator is the **Role-Aware Conductor**:

```text
automatic task classification
role routing
workflow selection
agent dispatch
structured artifact handoff
subscription-aware capacity limits
health monitoring
retry/escalation
human approval gates
```

Zed remains strategically important, but as an integration target first:

```text
MVP:
  Electron conductor app + real CLIs + worktrees + Open in Editor.

Later:
  Zed extension, ACP bridge, or Parallel Code fork if deep desktop integration becomes necessary.
```

This corrects the earlier Parallel Code-first language in older documents. When this file says “editor cockpit,” the MVP interpretation is:

```text
the conductor app is the workflow cockpit
the configured editor is optional and external
Git is the source of truth
```

The future local desktop version should be treated as a later product path, not the first implementation.


## 1. Feature Summary

The **Role-Aware Conductor** is a local desktop orchestration feature that lets the user assign external coding agents to explicit roles, then execute structured multi-agent workflows through real first-party CLIs. The first implementation should be an Electron/Parallel Code-style sidecar app, with editor integration kept optional. A Parallel Code fork remains a later option, not the starting base.

The feature should support agents such as:

```text
Codex
Claude Code / Claude Agent
Gemini CLI / Antigravity
future ACP-compatible agents
```

The feature should allow the user to define role assignments such as:

```text
planner      → Claude
implementer  → Codex
reviewer     → Claude
ui_verifier  → Gemini / Antigravity
fixer         → Codex
```

Then, when the user runs a task, the Conductor should route each step to the correct agent, preserve first-party CLI/subscription auth, manage worktrees, pass structured artifacts between agents, enforce workflow policy, and require human approval for risky operations.

The core concept:

```text
Claude plans.
Codex implements.
Gemini / Antigravity verifies UI.
Claude reviews.
Codex fixes.
Human approves.
```

This is not a generic chatbot feature. It is a workflow controller for role-specialized external agents.

---

## 2. Problem Statement

Current tools split the problem. Parallel Code-style tools can run real local CLI agents in worktrees, but the user still manually chooses which agent to use. Zed can host external agent threads, but it does not yet provide the Role-Aware Conductor layer. The first product should therefore start as a local desktop conductor and integrate with Zed through an editor bridge.

Current manual workflow:

```text
1. Ask Claude to plan.
2. Copy Claude’s plan into Codex.
3. Ask Codex to implement.
4. Copy Codex’s diff/test result into Claude.
5. Ask Gemini/Antigravity to check UI.
6. Copy UI notes back into Codex.
7. Manually track whether tests passed.
8. Manually decide what to approve.
```

This is inefficient and fragile.

The problems are:

```text
- no durable role assignment
- no automatic handoff
- no shared workflow state
- no structured artifacts
- no automatic worktree policy
- no auth/billing inspection
- no standard approval gates
- no way to enforce "Claude reviews but does not edit"
- no way to enforce "Codex implements but does not merge"
```

The Role-Aware Conductor exists to make this workflow explicit, repeatable, and safe.

---

## 3. Goals

The feature should:

```text
1. Let users assign agents to roles with YAML config.
2. Route workflow steps by role, not by hard-coded provider.
3. Preserve first-party CLI/subscription usage where possible.
4. Detect API-key configurations that may bypass subscriptions.
5. Create and manage worktrees for writable tasks.
6. Keep review/planning roles read-only by default.
7. Pass structured artifacts between agents.
8. Enforce permissions and protected-path rules.
9. Require human approval before risky operations.
10. Present all workflow state inside the editor cockpit.
```

---

## 4. Non-Goals

The first version should not:

```text
- create a new model provider
- proxy all model calls through a central billing layer
- replace Codex, Claude Code, Gemini CLI, or Antigravity
- auto-merge without human approval
- auto-push without human approval
- guarantee agent correctness
- implement a complex ML-based task router on day one
- support every possible external agent immediately
```

The first implementation should be deterministic, explicit, and auditable.

---

## 5. Reality Alignment

This feature is aligned with current tooling.

Zed already supports external agents through ACP, including Codex, Claude Agent, Gemini CLI, GitHub Copilot, and configurable agents. Zed also supports multiple independent agent threads, and each thread can use a different agent. External-agent billing remains between the user and the provider rather than Zed.

Relevant current assumptions:

```text
- Zed can host external agents.
- Zed can run multiple independent threads.
- Codex can use ChatGPT subscription auth or API-key auth.
- Claude Code can use subscription login or API-key configuration.
- Gemini CLI / Antigravity should be abstracted as a Google visual agent because Google’s agent tooling is changing.
```

This feature should build on those realities instead of replacing them.

---

## 6. Core User Story

As a developer using a local desktop conductor with the configured editor as an optional integration, I want to define which AI agent performs which role, so that I can run a coordinated multi-agent coding workflow without manually copying plans, diffs, screenshots, and review comments between tools.

Example user command:

```text
/conduct Build the responsive onboarding screen.
```

Expected behavior:

```text
1. Conductor reads project config.
2. Conductor resolves role bindings.
3. Claude receives the planning task.
4. User approves the plan.
5. Codex receives the approved plan.
6. Codex implements in an isolated worktree.
7. Gemini/Antigravity verifies the UI.
8. Claude reviews the diff.
9. Codex fixes accepted blockers.
10. User approves final result.
```

---

## 7. Project File Layout

The feature should use a dedicated project-local directory:

```text
.parallel-code/
  conductor.yaml
  roles.yaml
  workflows/
    plan-implement-review.yaml
    ui-build-verify.yaml
    bug-hunt.yaml
    refactor-safe.yaml
  policies/
    permissions.yaml
    protected-paths.yaml
    budget.yaml
  artifacts/
    runs/
      <run-id>/
        plan.md
        accepted-plan.md
        implementation.diff
        test-report.json
        ui-review.md
        screenshots/
        code-review.md
        final-summary.md
  state/
    runs.sqlite
    leases.json
```

This feature spec is separate from a future `roadmap.md`.

A future roadmap may reference this feature file, but the feature itself should be specified independently.

---

## 7A. Base-Code Strategy

The first implementation should use one of two base-code approaches:

```text
Preferred if code quality/license fit is good:
  fork Parallel Code and add the Role-Aware Conductor layer.

Fallback:
  build a fresh Electron app with the same local CLI/worktree architecture.
```

Do **not** start by forking Zed.

### 7A.1 Why Parallel Code or Electron first

The MVP needs these primitives immediately:

```text
- local desktop UI
- CLI process spawning
- worktree creation
- task/session dashboard
- diff review
- artifact storage
- "open in editor" integration
```

Those are closer to a Parallel Code-style Electron app than to Zed internals.

### 7A.2 What must be added beyond Parallel Code

Parallel Code-style manual selection should be upgraded into automatic role-aware dispatch:

```text
Parallel Code-style flow:
  user describes task
  user manually chooses Claude/Codex/Gemini
  selected agent works

Role-Aware Conductor flow:
  user describes task
  conductor classifies task
  conductor selects workflow
  workflow resolves roles
  roles resolve to configured CLIs
  conductor launches the right agents
  artifacts move between steps
  human approves gates
```

Required additions:

```text
- Ameen’s Default preset
- role dropdowns
- Lead Conductor role
- task classifier
- deterministic workflow recipes
- fresh-context-per-step policy
- structured artifact handoff
- scheduler/capacity limits
- health monitor
- retry/escalation
- problems view
- activity feed
- auth/billing inspector
- merge queue discipline
```

### 7A.3 optional editor integration path

The Electron app should include editor bridge actions:

```text
Open Worktree in Editor
Open Changed File in Editor
Open Diff in Editor
Copy Artifact Path
Reveal Artifact Folder
```

The app should not assume Zed-specific internals in the MVP. It should work with a generic editor bridge, with any editor configured by the user:

```yaml
editor_bridge:
  preferred_editor: configurable
  commands:
    open_project: "{editor_command} {worktree_path}"
    open_file: "{editor_command} {file_path}"
```


## 8. Main Config: `.parallel-code/conductor.yaml`

This is the main machine-readable configuration for the feature.

Example:

```yaml
schema: agent-conductor/v1

project:
  name: example-app
  default_branch: main
  artifact_root: .parallel-code/artifacts/runs
  state_db: .parallel-code/state/runs.sqlite

agents:
  codex:
    type: external_agent
    adapter: codex-acp
    provider: openai
    preferred_auth: chatgpt_subscription
    disallow_api_by_default: true
    env_api_keys:
      - CODEX_API_KEY
      - OPENAI_API_KEY
    executable_hint: codex

  claude:
    type: external_agent
    adapter: claude-acp
    provider: anthropic
    preferred_auth: claude_subscription
    disallow_api_by_default: true
    env_api_keys:
      - ANTHROPIC_API_KEY
    executable_hint: claude

  google_visual:
    type: external_agent
    adapter: google-visual
    provider: google
    preferred_auth: google_account
    backend_priority:
      - antigravity-cli
      - gemini-cli
    env_api_keys:
      - GEMINI_API_KEY
      - GOOGLE_AI_API_KEY

roles:
  planner:
    primary: claude
    fallback:
      - codex
    mode: read_only
    purpose: "Architecture, planning, decomposition, risk analysis."

  implementer:
    primary: codex
    fallback:
      - claude
    mode: writable
    purpose: "Implementation, test repair, bug fixing, PR preparation."

  reviewer:
    primary: claude
    fallback:
      - codex
    mode: read_only
    purpose: "Code review, security review, maintainability review."

  ui_verifier:
    primary: google_visual
    fallback:
      - claude
    mode: browser_or_read_only
    purpose: "UI verification, screenshots, browser checks, responsive review."

  fixer:
    primary: codex
    fallback:
      - claude
    mode: writable
    purpose: "Apply accepted review fixes only."

workflow:
  default: plan-implement-review
  templates_dir: .parallel-code/workflows
  require_plan_approval: true
  require_final_approval: true
  allow_parallel_review: true

worktrees:
  enabled: true
  root: .worktrees
  naming: "{workflow}-{role}-{slug}-{timestamp}"
  writable_roles:
    - implementer
    - fixer
  read_only_roles:
    - planner
    - reviewer
  cleanup:
    after_merge: ask
    after_cancel: ask

artifacts:
  required:
    - plan
    - accepted_plan
    - implementation_diff
    - test_report
    - code_review
    - final_summary
  optional:
    - ui_review
    - screenshots
    - browser_recording
    - risk_log

approval:
  before_first_write: true
  before_package_install: true
  before_database_migration: true
  before_delete: true
  before_commit: true
  before_merge: true
  before_push: true
  before_touching_protected_paths: true

auth_policy:
  warn_on_api_keys: true
  block_api_keys_unless_explicit: true
  prefer_subscription_auth: true
  codex_preferred_login: chatgpt
  claude_preferred_login: claude_pro_or_max
  google_preferred_login: google_account

budget_policy:
  use_codex_heavily: true
  use_claude_selectively: true
  use_google_visual_for_ui: true
  max_parallel_expensive_agents: 2
```

---

## 9. Role Binding Model

A role is a durable assignment between a workflow responsibility and an agent.

A role has:

```text
- name
- primary agent
- fallback agents
- permission mode
- purpose
- expected input artifacts
- expected output artifacts
```

Default roles:

```text
planner
implementer
reviewer
ui_verifier
fixer
```

Default role map:

```text
planner      → Claude
implementer  → Codex
reviewer     → Claude
ui_verifier  → Gemini / Antigravity
fixer         → Codex
```

Role resolution order:

```text
1. explicit command override
2. .parallel-code/conductor.yaml
3. .parallel-code/roles.yaml
4. built-in defaults
```

Example command override:

```text
/conduct Fix login bug --planner=claude --implementer=codex --reviewer=claude
```

---

## 10. Workflow Templates

Workflow templates define the order of execution and the handoff between roles.

### 10.1 `plan-implement-review.yaml`

```yaml
schema: agent-conductor-workflow/v1
name: plan-implement-review
description: "Claude plans, Codex implements, Claude reviews, Codex fixes."

steps:
  - id: plan
    type: agent
    role: planner
    mode: read_only
    context_pack: planner_context
    prompt: |
      Produce an implementation plan.
      Include assumptions, affected files, risks, acceptance criteria, and test plan.
      Do not edit files.
    outputs:
      - plan
      - risk_log
      - test_plan

  - id: approve_plan
    type: human_approval
    depends_on:
      - plan
    prompt: "Approve this plan for implementation?"

  - id: implement
    type: agent
    role: implementer
    mode: writable
    depends_on:
      - approve_plan
    worktree: new
    context_pack: implementer_context
    prompt: |
      Implement the approved plan exactly.
      Do not expand scope.
      Run configured checks.
    outputs:
      - implementation_diff
      - test_report

  - id: review
    type: agent
    role: reviewer
    mode: read_only
    depends_on:
      - implement
    context_pack: reviewer_context
    prompt: |
      Review the diff against the accepted plan.
      Return blocking issues first.
      Do not edit files.
    outputs:
      - code_review
      - blocking_issues
      - merge_recommendation

  - id: accept_review_items
    type: human_approval
    depends_on:
      - review
    prompt: "Select which blocking issues Codex should fix."

  - id: fix
    type: agent
    role: fixer
    mode: writable
    depends_on:
      - accept_review_items
    worktree: same_as:implement
    context_pack: fixer_context
    prompt: |
      Fix only the accepted review items.
      Do not refactor unrelated code.
      Re-run checks.
    outputs:
      - final_diff
      - final_test_report

  - id: final_approval
    type: human_approval
    depends_on:
      - fix
    prompt: "Approve final diff for commit/merge?"
```

### 10.2 `ui-build-verify.yaml`

```yaml
schema: agent-conductor-workflow/v1
name: ui-build-verify
description: "Codex implements UI, Google Visual verifies, Claude reviews if needed."

steps:
  - id: plan
    type: agent
    role: planner
    mode: read_only
    prompt: |
      Produce a concise UI implementation plan.
      Include responsive behavior, states, and acceptance criteria.
    outputs:
      - plan
      - acceptance_criteria

  - id: approve_plan
    type: human_approval
    depends_on:
      - plan

  - id: implement
    type: agent
    role: implementer
    mode: writable
    worktree: new
    depends_on:
      - approve_plan
    prompt: |
      Implement the UI plan.
      Do not change backend APIs unless explicitly approved.
      Run checks.
    outputs:
      - implementation_diff
      - test_report

  - id: visual_verify
    type: agent
    role: ui_verifier
    mode: browser_or_read_only
    depends_on:
      - implement
    prompt: |
      Verify the UI in browser.
      Check layout, visual hierarchy, responsiveness,
      empty/loading/error states, and accessibility basics.
      Return screenshots and specific fixes.
    outputs:
      - ui_review
      - screenshots
      - browser_recording

  - id: fix_visual_issues
    type: agent
    role: fixer
    mode: writable
    worktree: same_as:implement
    depends_on:
      - visual_verify
    prompt: |
      Apply only accepted UI fixes from the UI review.
      Re-run checks.
    outputs:
      - final_diff
      - final_test_report

  - id: final_review
    type: agent
    role: reviewer
    mode: read_only
    depends_on:
      - fix_visual_issues
    condition: "change_size != small"
    prompt: |
      Review the final UI code for maintainability and correctness.
    outputs:
      - code_review

  - id: final_approval
    type: human_approval
    depends_on:
      - fix_visual_issues
```

---

## 11. Structured Handoff

Agents should exchange structured artifacts, not raw chat transcripts.

Bad handoff:

```text
Copy all of Claude’s chat into Codex.
Copy all of Codex’s chat into Claude.
```

Good handoff:

```text
Claude PlanArtifact → Codex
Codex ImplementationArtifact → Claude
Gemini UiReviewArtifact → Codex
Claude CodeReviewArtifact → Codex
Codex FinalSummaryArtifact → Human
```

### 11.1 PlanArtifact

Produced by:

```text
planner
```

Default agent:

```text
Claude
```

Path:

```text
.parallel-code/artifacts/runs/<run-id>/plan.md
```

Required fields:

```text
- assumptions
- files likely involved
- implementation steps
- acceptance criteria
- risks
- test plan
```

### 11.2 ImplementationArtifact

Produced by:

```text
implementer
```

Default agent:

```text
Codex
```

Paths:

```text
.parallel-code/artifacts/runs/<run-id>/implementation.diff
.parallel-code/artifacts/runs/<run-id>/test-report.json
```

Required fields:

```text
- files changed
- diff
- commands run
- test results
- known risks
```

### 11.3 UiReviewArtifact

Produced by:

```text
ui_verifier
```

Default agent:

```text
Gemini / Antigravity
```

Paths:

```text
.parallel-code/artifacts/runs/<run-id>/ui-review.md
.parallel-code/artifacts/runs/<run-id>/screenshots/
```

Required fields:

```text
- visual verdict
- responsive behavior notes
- screenshots
- browser recording if available
- accepted / rejected state
- specific fixes
```

### 11.4 CodeReviewArtifact

Produced by:

```text
reviewer
```

Default agent:

```text
Claude
```

Path:

```text
.parallel-code/artifacts/runs/<run-id>/code-review.md
```

Required fields:

```text
- blocking issues
- non-blocking suggestions
- security concerns
- missing tests
- maintainability concerns
- merge recommendation
```

### 11.5 FinalSummaryArtifact

Produced by:

```text
fixer or conductor
```

Default agent:

```text
Codex + Conductor synthesis
```

Path:

```text
.parallel-code/artifacts/runs/<run-id>/final-summary.md
```

Required fields:

```text
- final files changed
- tests passed
- issues fixed
- issues deferred
- risks
- recommended PR title/body
```

---

## 12. Context Packs

The Conductor should create role-specific context packs.

### 12.1 Planner Context

```yaml
context_packs:
  planner_context:
    include:
      - AGENTS.md
      - CLAUDE.md
      - docs/architecture.md
      - relevant_files
      - diagnostics
    exclude:
      - secrets
      - node_modules
      - target
      - dist
```

### 12.2 Implementer Context

```yaml
context_packs:
  implementer_context:
    include:
      - accepted_plan
      - AGENTS.md
      - relevant_files
      - acceptance_criteria
      - test_commands
    exclude:
      - non_task_files
      - protected_paths
```

### 12.3 UI Verifier Context

```yaml
context_packs:
  ui_verifier_context:
    include:
      - task_spec
      - route_or_page
      - component_files
      - design_system_docs
      - dev_server_url
      - screenshots
    exclude:
      - backend_internals_unless_needed
```

### 12.4 Reviewer Context

```yaml
context_packs:
  reviewer_context:
    include:
      - original_task
      - accepted_plan
      - implementation_diff
      - test_report
      - ui_review
      - risk_log
    exclude:
      - unrelated_repo_files
```

---

## 13. Worktree Policy

Writable tasks should run in isolated worktrees.

Default policy:

```text
Codex implementer:
  writable worktree

Codex fixer:
  same writable worktree as implementation

Claude planner:
  read-only

Claude reviewer:
  read-only

Gemini / Antigravity UI verifier:
  browser/read-only by default
  writable only if explicitly approved
```

Example worktree layout:

```text
.worktrees/
  plan-implement-review-implementer-login-bug-20260601/
  ui-build-verify-implementer-dashboard-20260601/
```

Rules:

```text
1. Never let two writable agents edit the same branch at the same time.
2. Never let review roles write by default.
3. Never auto-merge.
4. Never auto-push.
5. Keep final merge under human control.
```

---

## 14. Permission Policy

Default permissions:

```yaml
permissions:
  planner:
    file_read: allow
    file_write: deny
    terminal: ask
    browser: deny
    git_commit: deny
    git_push: deny

  implementer:
    file_read: allow
    file_write: allow_in_worktree
    terminal_safe_command: allow
    terminal_mutating_command: ask
    package_install: ask
    database_migration: ask
    git_commit: ask
    git_push: deny

  ui_verifier:
    file_read: allow
    file_write: ask
    browser_localhost: allow
    browser_external: ask
    terminal: ask
    git_commit: deny
    git_push: deny

  reviewer:
    file_read: allow
    file_write: deny
    terminal: ask
    browser: ask
    git_commit: deny
    git_push: deny

  fixer:
    file_read: allow
    file_write: allow_in_worktree
    terminal_safe_command: allow
    terminal_mutating_command: ask
    git_commit: ask
    git_push: deny
```

---

## 15. Protected Paths

File:

```text
.parallel-code/policies/protected-paths.yaml
```

Example:

```yaml
protected_paths:
  deny_write:
    - .env
    - .env.*
    - secrets/**
    - credentials/**
    - infra/prod/**
    - .github/workflows/deploy.yml

  ask_before_write:
    - package.json
    - pnpm-lock.yaml
    - yarn.lock
    - Cargo.toml
    - Cargo.lock
    - migrations/**
    - db/schema/**
    - terraform/**
    - k8s/**
```

---

## 16. Auth Inspector

The feature should include an auth inspection step before launching agent threads.

### 16.1 Codex

Check:

```text
CODEX_API_KEY
OPENAI_API_KEY
Codex login state
```

If subscription auth is preferred and API keys are detected:

```text
Warning:
Codex may use API billing instead of ChatGPT subscription access.

Options:
[Use ChatGPT login]
[Use API key once]
[Cancel]
```

### 16.2 Claude

Check:

```text
ANTHROPIC_API_KEY
Claude Code login state
```

If `ANTHROPIC_API_KEY` is detected:

```text
Warning:
ANTHROPIC_API_KEY is set. Claude Code may use API configuration instead of plan allocation.

Options:
[Unset for this run]
[Use API key once]
[Cancel]
```

### 16.3 Gemini / Antigravity

Check:

```text
GEMINI_API_KEY
GOOGLE_AI_API_KEY
Gemini CLI auth state
Antigravity CLI availability
```

If both Gemini CLI and Antigravity CLI are available:

```text
Prefer Antigravity for UI/browser verification unless config says otherwise.
```

---

## 17. Editor UI

The feature should add a new primary view:

```text
Conductor Run View
```

If the product later becomes a Parallel Code fork or Zed extension, this can map to a Zed `Conductor Thread`.

The Conductor Run View should show:

```text
- active task
- selected workflow
- role assignments
- selected agents
- auth mode
- worktree paths
- step status
- artifacts
- approval gates
- warnings
```

Example UI:

```text
Conductor Run: Build onboarding flow

Workflow: ui-build-verify

Roles:
  Planner: Claude
  Implementer: Codex
  UI Verifier: Antigravity
  Reviewer: Claude
  Fixer: Codex

Steps:
  [✓] Load config
  [✓] Claude plan
  [✓] Human approve plan
  [●] Codex implement
  [ ] Antigravity visual verification
  [ ] Claude review
  [ ] Codex fix
  [ ] Final human approval

Artifacts:
  plan.md
  implementation.diff
  test-report.json
```

---

## 18. Commands

### 18.1 Main command

```text
/conduct <task>
```

Example:

```text
/conduct Build the responsive onboarding flow
```

### 18.2 Explicit role override

```text
/conduct <task> --planner=claude --implementer=codex --ui=google_visual --reviewer=claude
```

### 18.3 Workflow override

```text
/conduct <task> --workflow=ui-build-verify
```

### 18.4 Dry run

```text
/conduct <task> --dry-run
```

Dry run should output:

```text
- selected workflow
- role assignments
- agents to be launched
- worktrees to be created
- permissions required
- likely artifacts
- auth warnings
```

---

## 19. Lifecycle

A Conductor Run should move through these states:

```text
Created
  ↓
ConfigLoaded
  ↓
RolesResolved
  ↓
AuthInspected
  ↓
WorkflowSelected
  ↓
ContextPacked
  ↓
WorktreeCreated
  ↓
AgentThreadsCreated
  ↓
PlanGenerated
  ↓
PlanApproved
  ↓
ImplementationRunning
  ↓
TestsRunning
  ↓
ReviewRunning
  ↓
FixesRunning
  ↓
FinalApprovalPending
  ↓
Completed
```

Possible failure states:

```text
ConfigInvalid
AuthFailed
AgentUnavailable
WorktreeFailed
PermissionDenied
TestsFailed
ReviewBlocked
UserCancelled
```

---

## 20. Acceptance Criteria

The feature is complete when:

```text
1. The app can read `.parallel-code/conductor.yaml`.
2. The user can bind Codex, Claude, and Gemini/Antigravity to roles.
3. `/conduct` creates a Conductor Run.
4. The run resolves a workflow template.
5. The run creates or selects worktrees according to policy.
6. The run creates external agent threads using role bindings.
7. The planner role produces a PlanArtifact.
8. The implementer role consumes the PlanArtifact and produces a diff/test report.
9. The UI verifier role can consume implementation artifacts and produce UI artifacts.
10. The reviewer role consumes diff/test/UI artifacts and produces a review artifact.
11. The fixer role applies accepted fixes only.
12. Artifacts are written to `.parallel-code/artifacts/runs/<run-id>/`.
13. The user must approve plan and final merge.
14. The app warns if API keys may bypass preferred subscription auth.
15. The app blocks or asks before protected operations.
```

---

## 21. Implementation Phases

### Phase 1: Config and Role Resolver

Deliver:

```text
- `.parallel-code/conductor.yaml` parser
- default config generator
- role-to-agent resolver
- command-level role overrides
```

### Phase 2: Auth Inspector

Deliver:

```text
- Codex API-key warning
- Claude API-key warning
- Gemini/Antigravity backend detection
- per-run auth decision
```

### Phase 3: Dry-Run Conductor

Deliver:

```text
- `/conduct --dry-run`
- workflow selection
- role display
- expected artifacts
- permission preview
```

### Phase 4: Thread Creation

Deliver:

```text
- create Codex thread for implementer/fixer
- create Claude thread for planner/reviewer
- create Google Visual thread for UI verifier where available
- link threads under one Conductor Run
```

### Phase 5: Structured Handoff

Deliver:

```text
- PlanArtifact
- ImplementationArtifact
- UiReviewArtifact
- CodeReviewArtifact
- FinalSummaryArtifact
```

### Phase 6: Worktree Automation

Deliver:

```text
- automatic worktree creation
- one writable worktree per implementation task
- read-only review mode
- protected path checks
```

### Phase 7: Approval Gates and UI

Deliver:

```text
- approve plan
- approve protected operation
- approve review items
- approve final merge
- Conductor Thread UI
- artifact tabs
- warning display
```

---

## 22. Suggested Electron/TypeScript Module Sketch

```text
src/conductor/
  src/
    lib.rs
    config.rs
    roles.rs
    workflows.rs
    runs.rs
    thread_bridge.rs
    auth_inspector.rs
    worktrees.rs
    artifacts.rs
    permissions.rs
    ui_model.rs
```

Key structs:

```rust
struct ConductorConfig {
    project: ProjectConfig,
    agents: HashMap<AgentId, AgentConfig>,
    roles: HashMap<RoleName, RoleBinding>,
    workflow: WorkflowConfig,
    worktrees: WorktreeConfig,
    artifacts: ArtifactConfig,
    approval: ApprovalConfig,
    auth_policy: AuthPolicy,
    budget_policy: BudgetPolicy,
}

struct RoleBinding {
    primary: AgentId,
    fallback: Vec<AgentId>,
    mode: RoleMode,
    purpose: String,
}

struct ConductorRun {
    id: RunId,
    task: String,
    workflow: WorkflowTemplate,
    role_assignments: HashMap<RoleName, AgentId>,
    status: RunStatus,
    artifacts: Vec<ArtifactRef>,
}
```

Agent bridge:

```rust
trait AgentThreadBridge {
    fn create_thread(&self, agent: AgentId, worktree: WorktreeRef) -> Result<ThreadId>;
    fn send_prompt(&self, thread: ThreadId, prompt: String, context: ContextPack) -> Result<()>;
    fn collect_artifacts(&self, thread: ThreadId) -> Result<Vec<Artifact>>;
}
```

---

## 23. Final Definition

The Role-Aware Conductor is:

```text
A local desktop workflow controller that assigns external coding agents to explicit roles,
routes task steps by those roles, preserves first-party CLI/subscription auth where possible,
runs writable work in isolated worktrees, passes structured artifacts between agents,
enforces workflow and permission policy, and keeps the human as final approval authority.
```

It is the missing conductor layer between:

```text
Codex
Claude
Gemini / Antigravity
ACP
Git worktrees
structured artifacts
desktop review
human approval
```


---

# Research Update: Antfarm and Gas Town Feature Delta

**Update date:** 2026-06-01
**Purpose:** Identify features, rules, and operating patterns present in Antfarm and Gas Town that are not present in Parallel Code and were not fully captured in the earlier Role-Aware Conductor spec.

This update is based on:

- Parallel Code article uploaded by the user: `Multi-Agent Coding Tools in 2026 | Parallel Code`
- Antfarm public README: https://github.com/snarktank/antfarm
- Gas Town public README: https://github.com/gastownhall/gastown

## 24. Revised Conclusion

The conclusion is now more precise:

```text
Parallel Code validates the local Electron + CLI + worktree model.

Antfarm validates deterministic role pipelines:
  planner → developer → verifier → tester → reviewer.

Gas Town validates long-running agent operations:
  top coordinator, worker identities, persistent work state,
  health monitoring, escalation, scheduling, and merge queues.

The Role-Aware Conductor should combine the useful parts:
  Parallel Code’s simple local desktop/worktree UX
  + Antfarm’s deterministic workflows, step contracts, retry/escalation
  + Gas Town’s coordinator, health monitoring, persistent state, scheduler, and merge discipline
  + this project’s unique role-routing defaults and first-party CLI subscription preservation.
```

The product gap is no longer simply:

```text
"nobody has role-aware agents"
```

The more accurate gap is:

```text
No current product appears to combine:
  - local desktop Electron UX,
  - real first-party CLI agents,
  - configurable role routing,
  - automatic dispatch,
  - structured artifact handoff,
  - worktree isolation,
  - first-party subscription preservation,
  - deterministic workflows,
  - health monitoring,
  - retry/escalation,
  - scheduler/rate-limit awareness,
  - safe merge discipline,
  - and a clean Codex/Claude/Gemini-Antigravity preset system.
```

## 25. What Parallel Code Has

Parallel Code already covers the core local parallel-agent base:

```text
- Electron desktop app
- real local CLI agents
- multiple agents in parallel
- separate branches
- git worktrees
- live tiled sessions
- diff review before merge
- user stays close to the work
- developer manually chooses which agent to run
```

Parallel Code is therefore a good base or reference for:

```text
- CLI process management
- task/session UI
- worktree creation
- diff review
- local-first workflow
- "open in editor" model
```

Parallel Code does **not** appear to provide:

```text
- automatic role routing
- deterministic multi-step role pipelines
- built-in verifier/tester/reviewer step contracts
- retry and escalation policy
- persistent agent identities
- agent health watchdogs
- scheduler/rate-limit capacity controls
- bors-style merge queue
- structured multi-agent status taxonomy
- top coordinator that decomposes tasks into work units
```

## 26. What Antfarm Has That Should Influence This Feature

Antfarm is important because it is much closer to deterministic role pipelines than Parallel Code.

Antfarm’s public README describes specialized agents such as:

```text
planner
developer
verifier
tester
reviewer
```

It describes workflows such as:

```text
feature-dev:
  plan → setup → implement → verify → test → PR → review

security-audit:
  scan → prioritize → setup → fix → verify → test → PR

bug-fix:
  triage → investigate → setup → fix → verify → PR
```

The Antfarm concepts that should be added or strengthened in the Role-Aware Conductor are below.

### 26.1 Deterministic Workflow Contract

Current spec status:

```text
Partially present.
```

The spec already has workflow templates, but Antfarm makes determinism a first-class selling point:

```text
same workflow
same steps
same order
clear acceptance criteria
no reliance on the agent remembering to test
```

Add to Role-Aware Conductor:

```yaml
workflow_policy:
  deterministic_by_default: true
  allow_agent_to_skip_steps: false
  allow_agent_to_reorder_steps: false
  require_step_contracts: true
```

Each workflow step should declare:

```text
- id
- role
- input artifacts
- output artifacts
- expected status marker
- acceptance criteria
- retry policy
- escalation policy
```

Example:

```yaml
steps:
  - id: verify
    role: verifier
    input_artifacts:
      - implementation_diff
      - accepted_plan
    expected_output:
      status_marker: "STATUS: verified"
      artifact: verification-report.md
    on_failure:
      retry: 1
      escalate_to: lead_conductor
```

### 26.2 Separate Verifier Role

Current spec status:

```text
Partially present.
```

The previous spec has `reviewer` and `ui_verifier`, but Antfarm separates verification from review.

Add a general `verifier` role:

```text
Verifier:
  checks whether implementation matches acceptance criteria.

Reviewer:
  evaluates code quality, maintainability, risks, and merge readiness.

Tester:
  runs or creates tests and validates reproducibility.
```

Updated default role map:

```text
Lead Conductor    → Claude
Planner           → Claude
Architect         → Claude
Implementer       → Codex
Verifier          → Codex or Claude
Tester            → Codex
Reviewer          → Claude
Security Reviewer → Claude
UI Designer       → Gemini / Antigravity
UI Verifier       → Gemini / Antigravity
Fixer             → Codex
```

Recommended default:

```text
Verifier: Claude for conceptual/acceptance verification.
Tester: Codex for test execution and failure repair.
```

### 26.3 Fresh Context Per Step

Current spec status:

```text
Not explicit enough.
```

Antfarm emphasizes fresh context for every step to avoid context-window bloat and hallucinated state.

Add rule:

```text
Each role step starts with a fresh agent session unless the workflow explicitly requests continuity.
```

The agent should receive:

```text
- required artifacts
- relevant files
- exact step prompt
- current run metadata
```

It should not receive:

```text
- the full prior chat transcript
- unrelated raw logs
- stale context from earlier iterations
```

Config:

```yaml
context_policy:
  default_session_mode: fresh_per_step
  preserve_raw_logs: true
  handoff_mode: artifacts_only
  include_full_transcript_by_default: false
```

### 26.4 Retry and Escalate

Current spec status:

```text
Partially present as failure states, but not formalized.
```

Antfarm explicitly retries failed steps and escalates when retries are exhausted.

Add:

```yaml
retry_policy:
  default_retries: 1
  max_retries: 2
  retry_backoff_seconds: 10
  escalate_after_exhaustion: true
```

Step example:

```yaml
on_failure:
  retry: 2
  retry_with_fresh_context: true
  fallback_agent: codex
  escalate_to: human
```

Escalation artifact:

```text
.parallel-code/artifacts/runs/<run-id>/escalation.md
```

Escalation must include:

```text
- failed step
- agent
- command or prompt used
- error summary
- artifacts produced
- suggested next action
```

### 26.5 Step Claiming and Durable State

Current spec status:

```text
Run lifecycle exists, but claim/polling/state ownership is not detailed.
```

Antfarm uses state tracking so agents can independently claim a step, do work, and pass context onward.

For this project, add a lighter version:

```text
Each workflow step has a durable state row.
Only one agent/process can own a step at a time.
A step lease expires if the process dies or stalls.
```

State fields:

```sql
workflow_steps(
  id,
  run_id,
  step_id,
  role,
  assigned_agent,
  status,
  lease_owner,
  lease_expires_at,
  started_at,
  completed_at,
  retry_count,
  input_artifacts_json,
  output_artifacts_json
);
```

Step statuses:

```text
pending
claimed
running
waiting_for_artifact
waiting_for_human
retrying
escalated
failed
completed
cancelled
```

### 26.6 Workflow Registry and Security Review

Current spec status:

```text
Weak / missing.
```

Antfarm’s README emphasizes that workflows are plain YAML/Markdown, curated, reviewed for prompt injection, and transparent before install.

Add:

```text
Workflow packs are untrusted by default.
Imported workflows require review before activation.
```

Workflow source types:

```text
built_in
local_project
imported_file
remote_registry
```

Security policy:

```yaml
workflow_registry:
  allow_remote_workflows: false
  require_human_review_for_imports: true
  prompt_injection_review_required: true
  show_full_yaml_before_install: true
  signed_workflows_required_for_remote: true
```

Workflow import UI:

```text
This workflow can:
  - start agents
  - run shell commands
  - write files
  - request package installs
  - create worktrees

Approve installation?
[Review YAML] [Install disabled] [Cancel]
```

### 26.7 Built-In Workflow Families

Current spec status:

```text
Present, but should be expanded.
```

Add Antfarm-inspired built-ins:

```text
feature-dev
bug-fix
security-audit
test-gap-analysis
refactor-safe
ui-build-verify
docs-update
dependency-upgrade
auth-change-review
```

Each should define:

```text
- roles
- steps
- artifacts
- retry policy
- approval gates
- protected path behavior
```

## 27. What Gas Town Has That Should Influence This Feature

Gas Town is important because it focuses on long-running agent operations at scale.

It is heavier than what this project should build first, but several ideas are valuable.

### 27.1 Top Coordinator: Mayor Pattern

Current spec status:

```text
Present as Lead Conductor, but can be strengthened.
```

Gas Town’s Mayor is the primary AI coordinator. The user tells the Mayor what to build; the Mayor creates a convoy, spawns/assigns agents, and monitors progress.

Add to Role-Aware Conductor:

```text
Lead Conductor is not just a classifier.
Lead Conductor owns run supervision.
```

Lead Conductor responsibilities:

```text
- interpret user goal
- decompose work into steps
- choose workflow
- decide whether subtasks can run in parallel
- create or approve task graph
- monitor run progress
- summarize status for the user
- escalate blockers
- decide when to request human intervention
```

Config:

```yaml
lead_conductor:
  mode: hybrid
  local_rules_first: true
  llm_fallback: claude
  can_decompose_tasks: true
  can_spawn_subruns: false
  require_human_approval_for_subruns: true
```

### 27.2 Work Tracker: Convoy / Bead Equivalent

Current spec status:

```text
Partially present as Conductor Run.
```

Gas Town uses `convoys` and `beads` as durable work tracking units.

This project should not copy the terminology unless desired, but it should add the concept:

```text
Run = a high-level user goal.
Work Item = a decomposed unit of work.
Step = one role-specific execution stage.
```

Suggested internal model:

```text
ConductorRun
  WorkItems[]
    Steps[]
      AgentAttempt[]
```

Equivalent mapping:

```text
Gas Town Convoy → Conductor Run
Gas Town Bead   → Work Item or Step
Gas Town Hook   → Worktree-backed persistent artifact state
```

Add:

```sql
work_items(
  id,
  run_id,
  title,
  status,
  assigned_worktree,
  risk_level,
  created_by,
  created_at,
  completed_at
);
```

### 27.3 Persistent Agent Identity

Current spec status:

```text
Missing.
```

Gas Town’s worker agents have persistent identity but ephemeral sessions. This lets the system track history without requiring one endless chat session.

Add:

```text
Agent identity should persist across runs.
Agent sessions may be fresh per step.
```

Example:

```yaml
agent_identities:
  codex_implementer:
    agent: codex
    role: implementer
    history_file: .parallel-code/agents/codex-implementer/history.md
    memory_scope: project_safe_summary

  claude_reviewer:
    agent: claude
    role: reviewer
    history_file: .parallel-code/agents/claude-reviewer/history.md
    memory_scope: review_patterns
```

Rules:

```text
- persistent identity stores summaries, not raw secrets
- persistent identity cannot override safety policy
- per-run prompt still uses fresh context and artifacts
```

### 27.4 Hooks: Persistent Work State Survives Crashes

Current spec status:

```text
Partially present through artifacts and state DB.
```

Gas Town’s Hooks are git-worktree-backed persistent storage that survives crashes and restarts.

Add explicit recovery requirement:

```text
A run must be recoverable after app restart.
```

Recovery state must include:

```text
- run status
- worktree paths
- active branches
- agent attempts
- artifacts produced
- pending approvals
- failed commands
- retry count
- next runnable step
```

Add command/UI action:

```text
Resume Run
Recover Interrupted Run
Mark Step Failed
Re-run Step
```

### 27.5 Agent Health Monitoring

Current spec status:

```text
Missing.
```

Gas Town has Witness/Deacon/Dogs watchdog roles and a health taxonomy.

Add a lighter health model:

```text
healthy
working
idle
stalled
blocked
zombie
failed
needs_human
```

Health rules:

```text
stalled:
  agent process alive but no output or artifact change for threshold

zombie:
  process dead but step still marked running

blocked:
  agent emitted blocker or command failed repeatedly

needs_human:
  approval required or escalation created
```

Config:

```yaml
health_monitor:
  enabled: true
  stall_timeout_minutes: 15
  zombie_check_interval_seconds: 30
  nudge_enabled: true
  auto_handoff_after_stall: false
```

### 27.6 Nudge and Handoff Recovery

Current spec status:

```text
Missing.
```

Gas Town’s problems view supports nudge and handoff/refresh-context behavior for stuck agents.

Add recovery actions:

```text
Nudge:
  send a short status prompt to the same agent.

Handoff:
  stop current attempt, create a fresh session with current artifacts.

Retry:
  rerun the same step from last stable artifact.

Reassign:
  give the step to fallback agent.

Escalate:
  ask human to decide.
```

UI actions:

```text
[Nudge Agent]
[Handoff to Fresh Session]
[Retry Step]
[Reassign to Fallback]
[Escalate to Human]
[Cancel Step]
```

### 27.7 Problems View

Current spec status:

```text
Missing.
```

Gas Town has a problems view grouping stuck agents by health condition.

Add a Problems tab:

```text
Problems

State       Run                        Step          Agent       Action
Stalled     Build onboarding flow       implement     Codex       Nudge / Handoff
Zombie      Auth warning feature        review        Claude      Re-run / Mark failed
Blocked     Dashboard UI                visual_verify Antigravity Escalate
Waiting     Refactor config parser      approve_plan  Human       Approve / Reject
```

Problem categories:

```text
No progress
Test failure
Repeated command failure
Auth failure
Missing CLI
API-key conflict
Protected path request
Human approval pending
Zombie process
Worktree dirty
Merge conflict
```

### 27.8 Activity Feed

Current spec status:

```text
Partially present as run dashboard, but not an event stream.
```

Gas Town has a real-time activity feed with an agent tree, convoy panel, and event stream.

Add:

```text
Activity Feed
```

Events:

```text
run.created
task.classified
workflow.selected
agent.spawned
step.started
artifact.created
command.started
command.failed
approval.requested
approval.granted
step.completed
step.stalled
step.retried
step.escalated
run.completed
```

UI panels:

```text
Agent Tree
Run/Workflow Panel
Event Stream
Problems Panel
```

### 27.9 Scheduler and Capacity Control

Current spec status:

```text
Missing.
```

Gas Town has a scheduler controlling dispatch capacity to prevent API rate limit exhaustion.

Add scheduler:

```yaml
scheduler:
  enabled: true
  max_parallel_runs: 3
  max_parallel_agents: 5
  max_parallel_expensive_agents: 2
  max_parallel_claude: 1
  max_parallel_codex: 3
  max_parallel_google_visual: 1
  queue_when_capacity_exceeded: true
```

Scheduling rules:

```text
- do not start all agents at once if not needed
- queue non-urgent steps
- prioritize human-unblocked runs
- pause on repeated auth/rate-limit failures
- expose queue in dashboard
```

### 27.10 Escalation Severity

Current spec status:

```text
Partially present, but not severity-based.
```

Gas Town supports escalations with severity and routes them upward.

Add escalation levels:

```text
LOW:
  non-blocking question or optional improvement

MEDIUM:
  step blocked, fallback available

HIGH:
  protected path, repeated failure, auth/billing risk, data loss risk

CRITICAL:
  suspected secret exposure, destructive command, corrupted repo, unsafe merge
```

Escalation routing:

```yaml
escalation:
  LOW: lead_conductor
  MEDIUM: lead_conductor_then_human
  HIGH: human_required
  CRITICAL: stop_run_and_human_required
```

### 27.11 Merge Queue / Refinery

Current spec status:

```text
Missing beyond human approval.
```

Gas Town’s Refinery uses a Bors-style merge queue that batches merge requests, runs verification gates, and bisects failures to isolate bad changes. It also states workers never push directly to main.

For this project, adopt a simpler version first:

```text
No direct main pushes.
Completed work enters a local merge queue.
Each queue item has verification gates.
Human approves merge.
```

Later advanced mode:

```text
Bors-style merge queue:
  - batch ready branches
  - test merged stack
  - if green, merge
  - if red, bisect to isolate failing branch
```

Config:

```yaml
merge_queue:
  enabled: true
  mode: human_approved
  direct_push_to_main: false
  require_checks:
    - lint
    - typecheck
    - test
    - build
  future:
    bors_style_bisect: true
```

### 27.12 Formulas: Repeatable Recipes

Current spec status:

```text
Partially present as workflow templates.
```

Gas Town has TOML formulas for predefined repeatable processes.

This project already has YAML workflows; strengthen them as named recipes:

```text
Recipe = workflow template + role map + gates + artifacts + checks.
```

Examples:

```text
recipe: feature-dev
recipe: bug-fix
recipe: ui-build-verify
recipe: security-audit
recipe: dependency-upgrade
recipe: release
```

The user should be able to run:

```text
/conduct --recipe security-audit "Review auth token handling"
```

### 27.13 Context Recovery / Prime

Current spec status:

```text
Missing.
```

Gas Town has context recovery concepts such as `gt prime`.

Add:

```text
Prime Context
```

Purpose:

```text
Rebuild context for a fresh agent session from current artifacts,
not from stale chat history.
```

UI action:

```text
[Prime New Session]
```

Generated context should include:

```text
- run summary
- current work item
- accepted plan
- latest diff
- test results
- known blockers
- pending approvals
```

## 28. Delta Table: What To Add To Role-Aware Conductor

| Source | Feature / Rule | Present in Parallel Code? | Present in Previous MD? | Add to This Project? | Priority |
|---|---|---:|---:|---:|---:|
| Antfarm | Deterministic workflow contracts | No | Partial | Yes | P0 |
| Antfarm | Planner/developer/verifier/tester/reviewer role separation | No | Partial | Yes | P0 |
| Antfarm | Fresh context per step | No | Weak | Yes | P0 |
| Antfarm | Retry and escalate | No | Weak | Yes | P0 |
| Antfarm | Step expected-output markers | No | No | Yes | P1 |
| Antfarm | YAML/Markdown workflow packs | No | Partial | Yes | P0 |
| Antfarm | Workflow registry security review | No | No | Yes | P1 |
| Antfarm | Dashboard for run progress/logs | Partial | Partial | Yes | P1 |
| Antfarm | Resume failed run | No | No | Yes | P1 |
| Gas Town | Top coordinator as primary interface | No | Partial | Yes | P0 |
| Gas Town | Work tracker: run/work item/step hierarchy | No | Partial | Yes | P0 |
| Gas Town | Persistent agent identity | No | No | Yes | P1 |
| Gas Town | Persistent work state survives crashes | Partial | Partial | Yes | P0 |
| Gas Town | Watchdog / health monitoring | No | No | Yes | P0 |
| Gas Town | Problems view | No | No | Yes | P1 |
| Gas Town | Nudge/handoff/retry/reassign recovery | No | No | Yes | P0 |
| Gas Town | Activity feed / event stream | No | Weak | Yes | P1 |
| Gas Town | Scheduler / concurrency cap | No | No | Yes | P0 |
| Gas Town | Severity-based escalation | No | Weak | Yes | P0 |
| Gas Town | Merge queue | No | No | Yes, simplified first | P1 |
| Gas Town | Bors-style bisecting merge queue | No | No | Later | P2 |
| Gas Town | Formulas/recipes | No | Partial | Yes | P1 |
| Gas Town | Context recovery / prime | No | No | Yes | P1 |

## 29. Updated MVP Based on Research

The previous MVP should be adjusted.

### P0 Must-Haves

```text
1. Role profile settings
2. Ameen’s Default preset
3. Automatic task classification
4. Deterministic workflow templates
5. Fresh context per step
6. Structured artifacts
7. Worktree isolation
8. Auth/billing inspector
9. Scheduler/concurrency limits
10. Health states: running/stalled/blocked/zombie/needs_human
11. Retry/escalate policy
12. Human approval gates
```

### P1 Strong Additions

```text
1. Problems view
2. Activity feed
3. Workflow recipes
4. Persistent long-term agent identity summaries
5. Resume failed/interrupted runs
6. Nudge/handoff/reassign actions
7. Workflow pack security review
8. Autonomous or batched merge queue
9. Prime context recovery
```

### P2 Later

```text
1. Bors-style bisecting merge queue
2. Remote workflow registry
3. Multi-project town/rig model
4. Dozens-of-agents scale
5. Autonomous background patrol agents
6. Full dashboard command palette
```

## 29A. Starting MVP Cutline

The first version should not try to implement the full Gas Town-scale system.

The starting MVP is:

```text
1. Electron app shell
2. project picker
3. agent inventory
4. Ameen’s Default role profile
5. YAML config read/write
6. deterministic task classifier
7. two workflows:
   - plan-implement-review
   - ui-build-verify
8. real CLI spawning for:
   - Codex
   - Claude
   - Gemini or Antigravity where available
9. git worktree creation
10. artifact folder per run
11. run dashboard
12. Open in Editor
13. auth/billing warnings
14. max 3 active agents by default, max 6 hard cap in Consumer Subscription mode
15. human approval before merge/push/protected operations
```

Explicitly defer:

```text
- remote workflow registry
- 20–30 agent swarms
- autonomous background patrol agents
- bors-style bisecting merge queue
- multi-project federation
- Parallel Code fork
- VS Code extension
- enterprise API-budget mode
```

The MVP should prove this one behavior:

```text
User describes a task.
The app chooses the workflow and role-agent sequence.
The app launches the right CLIs.
The app hands artifacts between steps.
The user can inspect everything and approve final output.
```


## 30. Updated Architecture

The Role-Aware Conductor should now be modeled as:

```text
Conductor App
  ├── Settings / Profiles
  ├── Task Classifier
  ├── Lead Conductor
  ├── Workflow Engine
  ├── Scheduler
  ├── Agent Registry
  ├── Agent Process Runner
  ├── Worktree Manager
  ├── Artifact Store
  ├── Health Monitor
  ├── Escalation Manager
  ├── Activity Feed
  ├── Problems View
  ├── Merge Queue
  └── Editor Bridge
```

Core flow:

```text
User describes task
  ↓
Task Classifier
  ↓
Lead Conductor verifies/decomposes if needed
  ↓
Workflow Engine selects recipe
  ↓
Scheduler decides when agents may start
  ↓
Agent Runner launches role agents
  ↓
Artifact Store captures outputs
  ↓
Health Monitor detects stalls/zombies/blockers
  ↓
Escalation Manager routes issues
  ↓
Merge Queue prepares safe final review
  ↓
Human approves merge
```

## 31. Updated YAML Configuration Additions

Add these fields to `.parallel-code/conductor.yaml`:

```yaml
context_policy:
  default_session_mode: fresh_per_step
  handoff_mode: artifacts_only
  include_full_transcript_by_default: false
  prime_context_enabled: true

scheduler:
  enabled: true
  max_parallel_runs: 3
  max_parallel_agents: 5
  max_parallel_expensive_agents: 2
  max_parallel_claude: 1
  max_parallel_codex: 3
  max_parallel_google_visual: 1
  queue_when_capacity_exceeded: true

health_monitor:
  enabled: true
  stall_timeout_minutes: 15
  zombie_check_interval_seconds: 30
  nudge_enabled: true
  handoff_enabled: true
  auto_handoff_after_stall: false

retry_policy:
  default_retries: 1
  max_retries: 2
  retry_with_fresh_context: true
  escalate_after_exhaustion: true

escalation:
  LOW: lead_conductor
  MEDIUM: lead_conductor_then_human
  HIGH: human_required
  CRITICAL: stop_run_and_human_required

merge_queue:
  enabled: true
  mode: human_approved
  direct_push_to_main: false
  require_checks:
    - lint
    - typecheck
    - test
    - build
  future:
    bors_style_bisect: true

workflow_security:
  allow_remote_workflows: false
  require_human_review_for_imports: true
  prompt_injection_review_required: true
  show_full_yaml_before_install: true
  signed_workflows_required_for_remote: true

agent_identity:
  enabled: true
  store_summaries_only: true
  forbid_secret_storage: true
  identity_root: .parallel-code/agents

activity_feed:
  enabled: true
  persist_events: true
  event_log: .parallel-code/state/events.jsonl
```

## 32. Updated Run State Model

Add these state tables or equivalents:

```sql
conductor_runs(
  id,
  title,
  workflow,
  profile,
  status,
  created_at,
  updated_at,
  completed_at
);

work_items(
  id,
  run_id,
  title,
  status,
  risk_level,
  worktree_path,
  branch_name,
  created_at,
  completed_at
);

workflow_steps(
  id,
  run_id,
  work_item_id,
  step_id,
  role,
  assigned_agent,
  status,
  lease_owner,
  lease_expires_at,
  retry_count,
  input_artifacts_json,
  output_artifacts_json,
  started_at,
  completed_at
);

agent_attempts(
  id,
  step_id,
  agent,
  session_id,
  status,
  command,
  cwd,
  started_at,
  completed_at,
  exit_code,
  log_path
);

agent_health(
  agent_id,
  run_id,
  step_id,
  state,
  last_output_at,
  last_artifact_at,
  detected_at,
  suggested_action
);

escalations(
  id,
  run_id,
  step_id,
  severity,
  summary,
  status,
  routed_to,
  created_at,
  acknowledged_at
);

merge_queue_items(
  id,
  run_id,
  branch_name,
  status,
  checks_json,
  approved_by_human,
  created_at,
  merged_at
);
```

## 33. Updated UI Requirements

Add these UI surfaces:

```text
1. Role Settings
2. Run Dashboard
3. Problems View
4. Activity Feed
5. Agent Inventory
6. Scheduler Queue
7. Artifact Viewer
8. Merge Queue
9. Escalations Panel
10. Workflow Recipe Manager
```

### Problems View

```text
Problems

Severity   State       Run                         Step          Agent       Action
HIGH       Stalled     Build onboarding flow        implement     Codex       Nudge / Handoff
MEDIUM     Blocked     Auth warning feature         review        Claude      Reassign / Escalate
LOW        Waiting     Dashboard UI                 approve_plan  Human       Approve / Reject
CRITICAL   Zombie      Shell runner safety          test          Codex       Stop / Recover
```

### Activity Feed

```text
[10:01] run.created: Build onboarding flow
[10:02] task.classified: ui_feature
[10:03] workflow.selected: ui-build-verify
[10:04] agent.spawned: Claude planner
[10:08] artifact.created: plan.md
[10:09] approval.requested: approve_plan
[10:12] agent.spawned: Codex implementer
[10:18] command.failed: pnpm typecheck
[10:19] step.retried: implement
```

### Scheduler Queue

```text
Queued Steps

Priority   Run                        Step             Agent       Reason
1          Auth bug                    implement        Codex       Ready
2          Dashboard UI                visual_verify    Antigravity Waiting for Codex
3          Refactor config             review           Claude      Claude concurrency cap reached
```

## 34. Adopt / Do Not Adopt

### Adopt From Antfarm

```text
- deterministic workflows
- explicit role pipelines
- fresh context per step
- verifier/tester/reviewer separation
- retry/escalation
- plain YAML/Markdown workflow definitions
- status/expected-output markers
- dashboard and resume semantics
- workflow security review
```

### Adopt From Gas Town

```text
- Lead Conductor as primary interface
- durable work tracker
- persistent agent identities with fresh sessions
- health monitoring
- problems view
- nudge/handoff/retry/reassign recovery
- activity feed
- scheduler/capacity control
- escalation severity
- safe merge queue model
- context recovery / prime
```

### Do Not Adopt Initially

```text
- Gas Town’s full town/rig/crew metaphor
- dozens-of-agents scale as an MVP requirement
- cron-based orchestration unless needed
- automatic merges to main
- remote workflow marketplace
- heavyweight supervisor daemons
- unattended long-running production-scale autonomy
```

## 35. Final Updated Product Thesis

The Role-Aware Conductor should not merely be:

```text
Parallel Code + automatic agent choice
```

It should be:

```text
Parallel Code’s local CLI/worktree desktop foundation
+ Antfarm’s deterministic role pipelines
+ Gas Town’s operational safety and monitoring
+ first-party CLI subscription preservation
+ a simple Codex/Claude/Gemini-Antigravity role preset UI
```

That is the more defensible product direction after reviewing Antfarm and Gas Town.

The correct first implementation should still remain small:

```text
Electron app
real local CLIs
Ameen’s Default
deterministic workflow templates
fresh context per step
artifact handoffs
worktree isolation
scheduler limits
health states
retry/escalation
human approval gates
open worktree in the configured editor
```

The long-term version can add:

```text
problems view
activity feed
merge queue
workflow recipes
persistent agent identity
prime context recovery
Gas Town-style operational scale
```


---

# Subscription Capacity Constraint: Plus/Pro Cannot Support 20–30 Concurrent Agents

**Update date:** 2026-06-01
**Purpose:** Add a hard product constraint: the Role-Aware Conductor must be designed around realistic consumer subscription capacity, not enterprise-scale agent swarms.

## 36. Subscription Reality

The Role-Aware Conductor must assume that a normal individual user on ChatGPT Plus/Pro and Claude Pro/Max cannot sustainably run 20–30 active agents at once.

This is not a moral preference. It is a capacity and cost constraint.

OpenAI’s Codex pricing documentation states that Plus and Pro usage limits depend on:

```text
- model used
- coding task size and complexity
- local versus cloud execution
- context held by Codex
- long-running sessions
```

It also states that larger codebases, long-running tasks, and extended sessions consume more of the allowance per message. OpenAI lists Plus GPT-5.5 local-message capacity as a range per five-hour window, and Pro tiers as 5x or 20x higher than Plus. It also says users approaching limits can switch to smaller models to make usage last longer.

Relevant OpenAI docs:

```text
https://developers.openai.com/codex/pricing
https://developers.openai.com/codex/auth
https://developers.openai.com/codex/subagents
```

Anthropic’s Claude Code subscription docs state that Pro and Max usage limits are shared across Claude and Claude Code, meaning activity in both tools counts against the same allocation. Anthropic also tells users to upgrade to Max 5x or Max 20x if they consistently hit limits, or to use API/pay-as-you-go credits for intensive sprints.

Relevant Anthropic docs:

```text
https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan
```

OpenAI’s Codex subagent docs also state that subagent workflows consume more tokens than comparable single-agent runs because each subagent performs its own model and tool work.

Research on token consumption in agentic coding tasks also supports this constraint. A 2026 paper found that agentic coding tasks can consume roughly 1000x more tokens than ordinary code reasoning/chat, that token consumption can vary by up to 30x across runs on the same task, and that higher token use does not reliably translate to higher accuracy.

Relevant research:

```text
https://arxiv.org/abs/2604.22750
```

## 37. Product Implication

The app must not be designed like Gas Town-scale autonomous operations by default.

The app should be designed for:

```text
1–3 active agents as the normal case.
4–6 active agents as the upper practical case for an individual user.
20–30 agents as out of scope for Plus/Pro/Max consumer subscription mode.
```

The default product posture should be:

```text
Small number of high-value agents.
Fresh context per step.
Artifact handoff.
Sequential or lightly parallel execution.
No wasteful swarm behavior.
```

The app should explicitly avoid:

```text
- spawning dozens of agents automatically
- letting the Lead Conductor fan out unbounded subtasks
- running parallel review swarms by default
- using max/x-high reasoning for every role
- leaving idle agents open
- recursive subagent delegation
- launching one agent per file
- launching one agent per checklist item unless explicitly approved
```

## 38. Ameen’s Subscription-Aware Default

The default profile should be renamed or extended as:

```text
Ameen’s Default — Subscription Aware
```

This preset should assume:

```text
ChatGPT Plus/Pro:
  Codex is valuable but not unlimited.

Claude Pro/Max:
  Claude is valuable but shared with Claude app usage.

Gemini / Antigravity:
  Useful for UI/browser work but should still be scheduled, not spammed.

General:
  20–30 agents is not realistic on consumer subscriptions.
```

Default concurrency:

```yaml
subscription_capacity:
  mode: consumer_subscription
  target_active_agents: 3
  max_active_agents: 6
  default_reasoning_effort: medium
  heavy_reasoning_effort: ask
  low_effort_for_routine_steps: true
  prevent_agent_swarms: true
```

Recommended active-agent budget:

```text
Normal:
  1 Lead/Planner or Reviewer
  1 Codex Implementer/Fixer
  1 Gemini/Antigravity UI Verifier if needed

Upper practical limit:
  1 Lead Conductor
  1 Planner/Architect
  2 Codex implement/fix/test workers
  1 UI verifier
  1 Reviewer
```

Do not exceed:

```text
6 active agents
```

unless the user explicitly chooses an enterprise/API/high-budget mode.

## 39. Reasoning Effort Policy

The app should not use maximum reasoning effort for every agent.

The default should be:

```text
medium reasoning for most work
low reasoning for routine mechanical steps
high/max reasoning only with explicit approval
```

Recommended default by role:

```yaml
reasoning_effort_by_role:
  lead_conductor:
    default: medium
    allow_high: ask

  planner:
    default: medium
    allow_high: ask

  architect:
    default: medium
    allow_high: ask

  implementer:
    default: medium
    allow_high: ask

  fixer:
    default: low
    allow_medium: true
    allow_high: ask

  reviewer:
    default: medium
    allow_high: ask

  security_reviewer:
    default: medium
    allow_high: ask

  ui_designer:
    default: medium
    allow_high: ask

  ui_verifier:
    default: low
    allow_medium: true
    allow_high: ask

  test_runner:
    default: low
    allow_medium: true
    allow_high: ask

  docs_writer:
    default: low
    allow_medium: true
    allow_high: ask
```

The settings UI should expose this as:

```text
Role-Aware Conductor
  → Capacity & Effort
```

Example UI:

```text
Capacity Mode:          Consumer Subscription      [dropdown]
Target Active Agents:   3                          [stepper]
Max Active Agents:      6                          [stepper]
Default Effort:         Medium                     [dropdown]
Routine Step Effort:    Low                        [dropdown]
High/Max Effort:        Ask First                  [dropdown]
Swarm Mode:             Disabled                   [toggle]
```

## 40. Capacity Modes

The app should support named capacity modes.

### 40.1 Consumer Subscription Mode

Default.

```yaml
capacity_modes:
  consumer_subscription:
    target_active_agents: 3
    max_active_agents: 6
    max_parallel_expensive_agents: 2
    allow_20_30_agent_swarms: false
    default_effort: medium
    routine_effort: low
    high_effort_requires_approval: true
    recursive_delegation: false
```

Use for:

```text
ChatGPT Plus
ChatGPT Pro
Claude Pro
Claude Max
student Gemini/Antigravity access
```

### 40.2 API Budget Mode

For explicit pay-as-you-go usage.

```yaml
capacity_modes:
  api_budget:
    target_active_agents: 6
    max_active_agents: 12
    max_parallel_expensive_agents: 4
    allow_20_30_agent_swarms: false
    budget_cap_required: true
    default_effort: medium
    high_effort_requires_approval: true
```

This mode is allowed only if:

```text
- user explicitly enables API billing
- user sets budget cap
- app shows estimated burn
- app logs usage decisions
```

### 40.3 Enterprise / Research Mode

For future use only.

```yaml
capacity_modes:
  enterprise_or_research:
    target_active_agents: 10
    max_active_agents: 30
    max_parallel_expensive_agents: 8
    allow_20_30_agent_swarms: true
    budget_cap_required: true
    admin_unlock_required: true
    default_effort: low_or_medium
    high_effort_requires_approval: true
```

This mode should not be enabled by default.

The UI should warn:

```text
20–30 active agents are not suitable for normal Plus/Pro subscription use.
Use this only with explicit API/enterprise budget controls.
```

## 41. Scheduler Rules for Consumer Subscriptions

The scheduler must enforce subscription-aware limits.

Default scheduler:

```yaml
scheduler:
  enabled: true
  mode: consumer_subscription
  target_active_agents: 3
  max_active_agents: 6
  max_parallel_claude: 1
  max_parallel_codex: 2
  max_parallel_google_visual: 1
  max_parallel_lead_conductor: 1
  queue_when_capacity_exceeded: true
  pause_when_limits_near: true
  auto_downgrade_effort_for_queue: true
```

Role concurrency:

```text
Lead Conductor:
  max 1

Claude Planner/Reviewer:
  max 1 active Claude role at a time by default

Codex Implementer/Fixer/Test Runner:
  max 2 active Codex roles at a time by default

Gemini/Antigravity UI Verifier:
  max 1 active visual role at a time by default
```

Reason:

```text
The user gets more value from a small number of well-sequenced agents than from 20–30 shallow agents consuming subscription limits.
```

## 42. Dispatch Policy Under Capacity Constraints

When the user submits a task, the Conductor should choose the smallest sufficient workflow.

### 42.1 Simple bug

```text
Codex only
Claude review only if risky
```

### 42.2 Medium backend feature

```text
Claude plan
Codex implement
Claude review
Codex fix
```

Only one agent is active at most steps.

### 42.3 UI feature

```text
Claude plan
Codex implement
Gemini/Antigravity verify
Codex fix
Claude review if non-trivial
```

Do not run Claude and Gemini review at the same time unless capacity allows.

### 42.4 Large refactor

```text
Claude plan slices
Codex implements one slice at a time
Claude reviews each slice
```

Do not spawn one implementer per slice unless user approves a higher capacity mode.

### 42.5 Review checklist

Avoid:

```text
spawn one agent for security
spawn one agent for code quality
spawn one agent for tests
spawn one agent for maintainability
spawn one agent for race conditions
spawn one agent for bugs
```

Default instead:

```text
one Claude reviewer handles full review checklist
```

Parallel review swarm is only allowed if:

```text
- high-budget mode is enabled
- user approves
- max active agents remains within configured cap
```

## 43. UI Warnings

The app should warn when a workflow would exceed subscription-aware capacity.

Example:

```text
This workflow wants to start 9 agents.

Your current capacity mode is Consumer Subscription:
  Target active agents: 3
  Max active agents: 6

Options:
[Run sequentially]
[Reduce effort]
[Use smaller models]
[Switch to API Budget Mode]
[Cancel]
```

If a workflow requests 20–30 agents:

```text
20–30 active agents are not recommended on Plus/Pro/Max subscriptions.
This can rapidly consume usage limits and cause lockouts or API charges.

Use Enterprise/API Budget Mode only with an explicit budget cap.
```

## 44. Budget-Aware Workflow Optimization

The Conductor should optimize for agent value per step.

Priority order:

```text
1. Avoid unnecessary agents.
2. Prefer deterministic checks before model review.
3. Prefer artifacts over full transcripts.
4. Prefer fresh context over long-running chats.
5. Prefer medium/low effort unless high effort is justified.
6. Run UI verification only when UI changed.
7. Run security review only when risk labels require it.
8. Queue rather than parallelize when capacity is tight.
```

The Conductor should produce a capacity plan before running:

```yaml
capacity_plan:
  mode: consumer_subscription
  estimated_peak_active_agents: 3
  agents:
    - step: plan
      agent: claude
      effort: medium
    - step: implement
      agent: codex
      effort: medium
    - step: visual_verify
      agent: antigravity
      effort: low
    - step: review
      agent: claude
      effort: medium
  notes:
    - "No parallel swarm required."
    - "UI verification runs only after implementation."
```

## 45. Acceptance Criteria Additions

Add the following to the Role-Aware Conductor acceptance criteria:

```text
1. App has a Consumer Subscription capacity mode.
2. Ameen’s Default uses max_active_agents = 6.
3. App warns before starting more than 6 active agents.
4. App blocks 20–30 agent fan-out unless enterprise/API mode is explicitly enabled.
5. App supports per-role effort defaults.
6. Routine steps default to low effort where safe.
7. Most planning/review/implementation steps default to medium effort.
8. High/max effort requires approval.
9. Scheduler queues excess work instead of spawning agents immediately.
10. Capacity plan is shown before large runs.
```

## 46. Updated Product Boundary

The Role-Aware Conductor should **learn from** Gas Town-scale systems but should not imitate their scale under consumer subscriptions.

Correct default:

```text
small, disciplined, sequential/lightly parallel conductor
```

Incorrect default:

```text
20–30 agent autonomous town
```

The product should support future scaling, but the default user experience should be:

```text
3 active agents normally.
6 active agents maximum.
Medium effort by default.
Low effort for routine checks.
High/max effort only when explicitly approved.
```

This aligns the product with the user’s actual subscription reality.

---

# Final Review Update: Starting Spec Consolidation

**Update date:** 2026-06-01
**Purpose:** Consolidate the current decision into this file so it can be used as the starting implementation specification.

## 47. What Changed in This Review

This review updates the spec to match the current plan:

```text
Before:
  The feature was framed mainly as a local desktop conductor or Parallel Code fork feature.

Now:
  The feature starts as a Parallel Code-style Electron desktop app,
  with Zed used through an editor bridge.
```

This is the correct starting point because the first product risk is not editor integration. The first product risk is whether the role-aware conductor can reliably:

```text
- classify tasks
- pick workflows
- dispatch the right CLIs
- preserve first-party subscription paths
- manage worktrees
- pass artifacts
- detect stuck/failed agents
- enforce capacity limits
- require human approval
```

## 48. Source-of-Truth Documents

This file should be treated as the primary product feature spec.

Supporting documents:

```text
project-runbook-safe-ai-agent-development.md
  Operating protocol for building the project safely with AI agents.

gemini_claude_codex_strengths_architecture_handoff.md
  Rationale for role assignment across Codex, Claude, and Gemini/Antigravity.

online_research_agent_orchestrator_consensus_and_products.md
  Market/product research and gap analysis.

zed_meta_orchestrator_rationale.md
  Original rationale for preserving first-party subscriptions and role-based orchestration.

zed_meta_orchestrator_architecture.md
  Original local desktop architecture path, now treated as a later-stage option.
```

Precedence order:

```text
1. This file.
2. Project runbook.
3. Strengths/architecture/handoff document.
4. Online research document.
5. Older Parallel Code-first rationale/architecture documents.
```

If documents conflict, follow this file.

## 49. Current Product Thesis

The product thesis is now:

```text
A local desktop Role-Aware Conductor for first-party coding CLIs.

It uses:
  - Codex for implementation/fixing/testing
  - Claude for planning/review/risk analysis
  - Gemini/Antigravity for UI/browser/visual verification
  - Git worktrees for isolation
  - YAML recipes for deterministic workflows
  - artifacts for handoff
  - health monitoring and retry/escalation for reliability
  - subscription-aware scheduling for capacity control
  - the configured editor as an optional integration bridge
```

The one-line differentiator:

```text
Parallel Code lets the user pick an agent.
Role-Aware Conductor lets the user describe the task and dispatches the right role-agent workflow automatically.
```

## 50. Implementation Guardrails

The first implementation should be intentionally conservative:

```text
- Consumer Subscription mode is default.
- 3 active agents is the normal target.
- 6 active agents is the hard default maximum.
- 20–30 agent swarms are out of scope unless future API/enterprise mode is explicitly enabled.
- Medium effort is the default.
- Low effort is used for routine verifier/tester/fixer steps.
- High/max effort requires approval.
- Every writable task runs in a worktree.
- No merge or push happens without human approval.
```

## 51. Naming Clarification

The product/repo can still use:

```text
local-agent-conductor
```

but the MVP is not a future editor-native path.

Recommended naming stack:

```text
Repo:              local-agent-conductor
App name:          Parallel Code with Agent Conductor
Base:              Parallel Code fork
Feature name:      Role-Aware Conductor
Default profile:   Ameen’s Default — Subscription Aware
Config dir:         .parallel-code/
Main config:        .parallel-code/conductor.yaml
Command:            /conduct
```

Reason:

```text
The name keeps the local conductor workflow identity,
while the implementation remains a local Electron sidecar first.
```

## 52. First Build Tickets

Use these as the first implementation tickets.

### Ticket 1: Project Baseline

```text
Goal:
  Establish Electron app baseline or Parallel Code fork baseline.

Acceptance:
  - app launches
  - project can be selected
  - git repo is detected
  - Zed open command can be configured
```

### Ticket 2: Role Profile Config

```text
Goal:
  Add `.parallel-code/conductor.yaml` with Ameen’s Default.

Acceptance:
  - config loads
  - config validates
  - invalid config shows useful error
  - role dropdown data model exists
```

### Ticket 3: Agent Inventory

```text
Goal:
  Detect Codex, Claude, and Gemini/Antigravity CLIs.

Acceptance:
  - installed/missing/auth-unknown states display
  - API-key warning variables are detected
  - no secrets are logged
```

### Ticket 4: Dry-Run Dispatcher

```text
Goal:
  User enters task, app classifies it, selects workflow, and shows planned dispatch without running agents.

Acceptance:
  - plan-implement-review selected for backend feature
  - ui-build-verify selected for UI feature
  - capacity plan shown
  - user can approve or cancel
```

### Ticket 5: Worktree Manager

```text
Goal:
  Create isolated worktree for implementation.

Acceptance:
  - worktree path created under configured root
  - branch created safely
  - dirty repo state handled
  - Open in Editor works
```

### Ticket 6: First Real Workflow

```text
Goal:
  Run plan-implement-review end to end.

Acceptance:
  - Claude produces plan artifact
  - user approves plan
  - Codex receives accepted plan
  - Codex produces diff/test artifact
  - Claude reviews diff
  - final summary is shown
```

## 53. Do Not Build Yet

Do not implement these in the first milestone:

```text
- remote workflow marketplace
- autonomous cron agents
- bors-style bisecting merge queue
- persistent long-term memory beyond safe summaries
- full Parallel Code fork
- cloud sync
- team collaboration
- paid model proxy
- hosted billing
```

These are valid later, but they are not needed to prove the core product.

## 54. Known Public Implementations Check

As of the latest review, no known public fork of Parallel Code, Antfarm, Gas Town, Zed, or similar tools appears to implement this exact product shape:

```text
local Electron-style desktop app
+ real first-party Codex / Claude / Gemini-Antigravity CLIs
+ automatic task classification
+ role-aware routing
+ configurable role presets such as Ameen’s Default
+ deterministic workflow recipes
+ structured artifact handoff
+ subscription-aware 3–6 agent scheduler
+ optional editor bridge
+ human approval gates
```

The current market and open-source landscape appears to be split into adjacent but incomplete categories:

```text
Parallel Code:
  closest local Electron/worktree/CLI base,
  but still primarily manual agent selection.

Antfarm:
  closest deterministic role-workflow reference,
  but not a local desktop Electron conductor for first-party CLIs.

Gas Town:
  closest large-scale coordinator/agent-ops reference,
  but heavier than the intended MVP and more swarm-oriented.

Zed:
  closest future desktop target,
  but not the correct first fork and does not currently provide this role-aware conductor layer.

Research systems:
  conceptually relevant,
  but not productized as a local desktop CLI-preserving conductor.
```

This means the project should not claim that nobody has explored role-aware agents or conductor-style systems. They have.

The more precise claim is:

```text
No reviewed public implementation appears to combine the exact product constraints this project targets:
Parallel Code-style local desktop UX,
real first-party CLI agents,
automatic role-aware dispatch,
subscription-aware capacity limits,
Antfarm-style deterministic handoffs,
Gas Town-style operational safety,
and optional editor bridging.
```

### 54.1 Search notes

Searches reviewed included terms around:

```text
role-aware conductor
Parallel Code conductor
Claude Codex Gemini worktree conductor
Antfarm Claude Codex
local CLI agent conductor
multi-agent coding worktree role router
```

No convincing public implementation was found that matches the target product.

This should be treated as a practical product-gap finding, not a formal proof of non-existence. A private/internal project or differently named public project could exist. The current conclusion is:

```text
Proceed as if the gap is real,
but keep watching Parallel Code, Antfarm, Gas Town, Zed, Conductor, Cursor, Warp/Oz, Antigravity, and GitHub Agent HQ.
```

### 54.2 Strategic implication

This check strengthens the current fork strategy:

```text
1. Fork or study Parallel Code first.
2. Add the Role-Aware Conductor layer.
3. Borrow workflow discipline from Antfarm.
4. Borrow operational safety patterns from Gas Town.
5. Keep the configured editor as an optional integration bridge.
6. Do not build on Zed first.
```

The differentiator remains:

```text
Parallel Code asks the user to pick an agent.
Role-Aware Conductor lets the user describe the task and automatically dispatches the configured role-agent workflow.
```





---

# Appendix: project-runbook-safe-ai-agent-development.md — CURRENT SAFETY RUNBOOK

```text
File path: /mnt/data/project-runbook-safe-ai-agent-development.md
Size: 24302 bytes
```

# Project Runbook: Safe Development Workflow for the Role-Aware Conductor

**Project:** Role-Aware Conductor / Parallel Code-style Electron fork
**Purpose:** Define how the project will be run so Codex, Claude, Gemini/Antigravity, and the human lead avoid known failure modes in AI coding tools.
**Status:** Draft operating protocol
**Date:** 2026-06-01

---

## 1. Why This Runbook Exists

This project will use AI coding agents heavily. The goal is to use them productively without letting them create fragile, unsafe, or hard-to-debug software.

The main empirical study this runbook responds to is:

**“Engineering Pitfalls in AI Coding Tools: An Empirical Study of Bugs in Claude Code, Codex, and Gemini CLI.”**

That study analyzed more than 3,800 publicly reported bugs across Claude Code, Codex, and Gemini CLI. It found:

```text
- more than 67% of reported bugs were functionality-related
- 36.9% of root causes came from API, integration, or configuration errors
- common symptoms included API errors, terminal problems, and command failures
- failures clustered around tool invocation and command execution stages
```

Source:

- https://arxiv.org/abs/2603.20847

This project is directly exposed to those same risk areas because it will:

```text
- spawn external CLI agents
- manage environment variables and auth modes
- create git branches and worktrees
- run shell commands
- capture agent output
- pass artifacts between agents
- manage review and merge flows
```

This runbook also accounts for other current research and security signals:

```text
- coding agents can take out-of-scope actions if scope is not explicit
- dependency gaps can make generated projects non-reproducible
- AI IDEs and agentic development tools introduce new prompt-injection and RCE-style attack surfaces
- repo-level configuration files such as AGENTS.md are becoming standard, but must be treated as executable workflow influence, not harmless documentation
```

Sources:

- https://arxiv.org/abs/2605.18583
- https://arxiv.org/abs/2512.22387
- https://arxiv.org/abs/2602.14690
- https://www.tomshardware.com/tech-industry/cyber-security/researchers-uncover-critical-ai-ide-flaws-exposing-developers-to-data-theft-and-rce

---

## 2. Core Operating Principle

The project will not be run as:

```text
"Ask Codex to build everything."
```

It will be run as:

```text
Claude plans and reviews.
Codex implements and fixes.
Gemini/Antigravity verifies UI and browser behavior.
The human lead approves architecture, security-sensitive operations, and merge decisions.
```

The project must optimize for:

```text
- safe iteration
- small diffs
- explicit scope
- repeatable tests
- auditability
- first-party CLI subscription preservation
- cross-platform reliability
- no hidden API billing
- no destructive unattended commands
```

---

## 3. Role Assignments

Default role map:

```text
Human Lead:
  product decisions, architecture approval, security approval, merge authority

Claude:
  planner, architect, reviewer, security reviewer, risk analyst

Codex:
  implementer, fixer, test runner, refactor executor

Gemini / Antigravity:
  UI designer, UI verifier, browser verifier, screenshot reviewer

Local deterministic scripts:
  lint, typecheck, unit tests, integration tests, security checks, git status checks
```

The system should not depend on any one agent being correct. Each agent role has a boundary.

---

## 4. Non-Negotiable Rules

These rules apply to every development task.

```text
1. No agent gets direct push access.
2. No agent merges to main.
3. No agent edits protected files without explicit approval.
4. No agent installs packages without approval.
5. No agent changes auth, billing, secrets, or environment handling without human review.
6. No agent changes shell command execution logic without a security review.
7. No agent performs broad refactors unless the plan was approved first.
8. No agent runs destructive git commands without approval.
9. Every implementation task must have a clear acceptance criterion.
10. Every merge must have a final human review.
```

---

## 5. Work Unit Structure

Every task must be written as a small work unit.

A work unit must include:

```text
- title
- goal
- non-goals
- files or modules likely involved
- acceptance criteria
- test plan
- risk level
- required roles
- protected operations, if any
```

Example:

```markdown
# Task: Add Role Preset Settings UI

## Goal

Add a settings page that lets users choose a conductor preset and assign agents to roles.

## Non-Goals

- Do not implement task dispatch.
- Do not change CLI spawning.
- Do not change git worktree behavior.

## Likely Files

- src/renderer/settings/*
- src/ipc/conductor-types.ts
- src/main/config-store.ts

## Acceptance Criteria

- User can select "Ameen's Default".
- Role dropdowns display installed agents.
- Settings persist to `.parallel-code/conductor.yaml`.
- Invalid YAML displays a recoverable error.

## Test Plan

- Unit test config serialization.
- Unit test config validation.
- Manual UI test on macOS/Linux/Windows where possible.

## Risk Level

Medium.

## Required Roles

- Claude: plan/review
- Codex: implement/test
```

---

## 6. Standard Workflow

Every non-trivial task follows this flow:

```text
1. Human writes or approves task.
2. Claude produces implementation plan.
3. Human approves or edits plan.
4. Codex implements in a dedicated branch/worktree.
5. Codex runs required checks.
6. Gemini/Antigravity verifies UI if the task affects UI.
7. Claude reviews the diff.
8. Human selects accepted review items.
9. Codex fixes accepted review items only.
10. Checks run again.
11. Human approves final diff.
12. Human merges.
```

For very small tasks, the simplified flow is allowed:

```text
1. Human writes task.
2. Codex implements in worktree.
3. Tests/checks run.
4. Human reviews diff.
5. Human merges.
```

The simplified flow must not be used for:

```text
- auth
- billing
- secrets
- environment variables
- shell execution
- package installation
- git operations
- process spawning
- IPC boundaries
- sandboxing
- auto-dispatch logic
```

---

## 7. Worktree Policy

Every implementation task gets its own branch and worktree.

Example:

```bash
git checkout main
git pull

git worktree add .worktrees/feat-role-settings -b feat/role-settings
```

Rules:

```text
- one writable agent per worktree
- Codex owns writable implementation worktrees
- Claude reviews read-only diffs
- Gemini/Antigravity verifies UI in the implementation worktree
- no two agents edit the same branch at the same time
- main is never edited directly by an agent
```

Worktree naming:

```text
.worktrees/<task-type>-<short-slug>-<date>/
```

Examples:

```text
.worktrees/feat-role-settings-20260601/
.worktrees/fix-auth-warning-20260601/
.worktrees/ui-dashboard-review-20260601/
```

---

## 8. Branch Policy

Branch naming:

```text
feat/<short-description>
fix/<short-description>
refactor/<short-description>
security/<short-description>
docs/<short-description>
test/<short-description>
```

Examples:

```text
feat/role-aware-settings
fix/claude-api-key-warning
security/shell-command-allowlist
refactor/agent-process-runner
```

Rules:

```text
- no direct commits to main
- no force-push unless human explicitly approves
- no generated bulk rewrite without prior approval
- final branch must be rebased or merged cleanly against main before PR/merge
```

---

## 9. Commit Policy

Agents may propose commits, but the human lead approves them.

Commit messages must follow:

```text
type(scope): summary
```

Examples:

```text
feat(settings): add role preset dropdowns
fix(auth): warn when ANTHROPIC_API_KEY overrides subscription mode
test(config): cover conductor profile validation
security(shell): add command allowlist for agent runner
```

Commit body must include:

```text
- why the change was made
- what was changed
- tests run
- risks
```

---

## 10. Protected Areas

The following areas require human approval before modification.

```text
.env
.env.*
secrets/**
credentials/**
src/main/agent-runner/**
src/main/process/**
src/main/shell/**
src/main/ipc/**
src/main/auth/**
src/main/git/**
src/main/worktrees/**
src/main/config/**
package.json
pnpm-lock.yaml
yarn.lock
package-lock.json
electron-builder.*
.github/workflows/**
migrations/**
```

Rationale:

```text
These areas affect process execution, auth, billing, secrets, git state, package supply chain, or deployment.
```

---

## 11. Shell Command Policy

Because terminal problems and command failures are common AI coding tool symptoms, shell execution must be tightly controlled.

Agents may run safe commands automatically only within the task worktree.

Allowed by default:

```bash
git status
git diff
git diff --check
git log --oneline -n 10
pnpm lint
pnpm typecheck
pnpm test
pnpm test -- --runInBand
npm run lint
npm run typecheck
npm test
```

Requires approval:

```bash
pnpm install
npm install
yarn install
rm
rm -rf
git reset
git clean
git checkout --
git rebase
git push
git merge
chmod
curl
wget
npx
docker
sudo
```

Forbidden unless explicitly approved for a specific reason:

```bash
sudo *
rm -rf /
rm -rf ~
chmod -R 777 *
curl * | sh
wget * | sh
eval *
```

Shell command handling requirements:

```text
- use argument arrays, not string concatenation
- never interpolate user text directly into shell commands
- escape paths safely
- log command, cwd, env diff, exit code, stdout, stderr
- enforce timeout
- enforce working directory
- redact secrets from logs
```

---

## 12. Auth and Billing Policy

The project’s product goal includes preserving first-party CLI subscription usage where possible.

Therefore:

```text
Codex should prefer ChatGPT/Codex login.
Claude should prefer Claude Code subscription login.
Gemini/Antigravity should prefer Google account entitlement where possible.
API-key usage must be explicit.
```

Before any agent run, the app must inspect environment variables.

Codex warning variables:

```text
CODEX_API_KEY
OPENAI_API_KEY
```

Claude warning variables:

```text
ANTHROPIC_API_KEY
```

Google warning variables:

```text
GEMINI_API_KEY
GOOGLE_AI_API_KEY
```

Required behavior:

```text
- show warning if API key may override subscription mode
- allow "unset for this run"
- allow "use API key once"
- allow cancel
- log selected auth mode in run metadata
```

Run metadata must include:

```json
{
  "agent": "codex",
  "preferred_auth": "chatgpt_subscription",
  "api_key_env_detected": ["OPENAI_API_KEY"],
  "user_decision": "unset_for_this_run"
}
```

---

## 13. Environment Variable Policy

Environment variables are high-risk.

Rules:

```text
- never log full env
- never pass full parent env blindly to agent processes
- build a minimal child env
- redact known secret patterns
- show env diff in debug mode only
- API keys are opt-in per run
```

Minimal child env should include:

```text
PATH
HOME
SHELL
USER
TMPDIR
project-specific safe vars
agent-specific auth vars only if approved
```

Do not pass:

```text
all process.env
cloud credentials
deployment tokens
database URLs
production secrets
```

---

## 14. Process-Spawning Policy

The app will spawn local CLIs such as:

```text
codex
claude
gemini
antigravity
```

Process-spawning rules:

```text
- resolve executable path safely
- validate executable exists
- do not run shell through `sh -c` unless unavoidable
- pass args as arrays
- set cwd to task worktree
- set timeout
- capture stdout/stderr
- capture exit code
- support cancellation
- kill process tree on cancel
- never run in repository root unless task explicitly permits
```

Required process log fields:

```json
{
  "run_id": "run_123",
  "step_id": "implement",
  "agent": "codex",
  "command": "codex",
  "args": ["..."],
  "cwd": ".worktrees/feat-role-settings-20260601",
  "started_at": "...",
  "ended_at": "...",
  "exit_code": 0
}
```

---

## 15. Git Worktree Policy

Worktree operations must be deterministic and logged.

Allowed automatic operations:

```bash
git worktree add <path> -b <branch>
git status --short
git diff
git diff --check
```

Requires approval:

```bash
git worktree remove
git branch -D
git reset
git clean
git rebase
git merge
git push
```

Before creating a worktree:

```text
- verify repo is clean or ask user to continue
- verify branch does not exist
- verify target path does not exist
- verify base branch is current
```

Before merge:

```text
- run all required checks
- show final diff
- show final summary
- require human approval
```

---

## 16. Dependency Policy

Dependency issues are a known source of non-reproducible AI-generated code.

Rules:

```text
- no dependency additions without approval
- no lockfile edits without approval
- every dependency change must include reason
- every dependency change must include security/license check where available
- package manager must be consistent with repo
```

If the repo uses `pnpm`, agents must not introduce `npm install` or `yarn.lock`.

A dependency change proposal must include:

```text
- package name
- version
- reason
- alternatives considered
- whether it is runtime or dev dependency
- effect on bundle size if relevant
- security/license notes
```

---

## 17. Configuration Policy

Configuration errors are a major root cause in AI coding tools.

Rules:

```text
- config schema must be versioned
- invalid config must fail gracefully
- config parser must produce actionable errors
- config writes must be atomic
- config migrations must be explicit
- UI and YAML must round-trip without data loss
```

Required config files:

```text
.parallel-code/conductor.yaml
.parallel-code/policies/permissions.yaml
.parallel-code/policies/protected-paths.yaml
.parallel-code/workflows/*.yaml
```

Config validation must check:

```text
- unknown roles
- missing agents
- unavailable CLI commands
- invalid permission modes
- invalid workflow step dependencies
- circular workflow dependencies
- missing required artifacts
- invalid worktree root
```

---

## 18. Artifact Policy

Agents must produce structured artifacts, not just chat logs.

Required artifacts:

```text
plan.md
accepted-plan.md
implementation.diff
test-report.json
code-review.md
final-summary.md
```

Conditional artifacts:

```text
ui-review.md
screenshots/
browser-recording/
security-review.md
dependency-change-request.md
auth-risk-review.md
```

Artifact rules:

```text
- every agent handoff must use artifacts
- raw logs are kept but not used as the primary handoff
- artifacts are stored under the run directory
- artifacts are immutable after approval
- later corrections create new versions
```

Example artifact path:

```text
.parallel-code/artifacts/runs/run_20260601_001/plan.md
```

---

## 19. Review Policy

Claude is the default reviewer.

Claude review prompts must be read-only by default.

Review checklist:

```text
- scope control
- correctness
- edge cases
- security
- shell/process safety
- auth/billing safety
- config validation
- cross-platform behavior
- test coverage
- dependency changes
- user approval gates
```

Claude review output must separate:

```text
Blocking issues
Non-blocking suggestions
Questions for human
Risks accepted
Merge recommendation
```

Codex may not fix non-blocking suggestions unless the human approves them.

---

## 20. UI Verification Policy

Gemini/Antigravity is the default UI verifier.

Used when a task changes:

```text
- layout
- pages
- components
- styling
- onboarding
- dashboard
- settings
- review screens
- artifact views
```

UI verification must check:

```text
- visual hierarchy
- responsive behavior
- empty states
- loading states
- error states
- accessibility basics
- keyboard navigation where relevant
- dark mode if supported
```

Outputs:

```text
ui-review.md
screenshots/
browser-recording/ if available
specific-fixes.md
```

---

## 21. Testing Policy

No implementation task is complete without checks.

Minimum checks for Electron/TypeScript project:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

If available:

```bash
pnpm test:e2e
pnpm test:electron
pnpm test:integration
```

Test rules:

```text
- Codex must run checks before claiming completion
- failing tests must be reported, not hidden
- test output must be saved to test-report.json
- if tests cannot run, the reason must be documented
- dependency or environment failures must be separated from code failures
```

---

## 22. Cross-Platform Policy

Because Electron apps run across platforms, agents must account for:

```text
macOS
Linux
Windows
WSL where applicable
```

Rules:

```text
- use Node path utilities, not string path concatenation
- avoid hard-coded `/tmp`
- avoid POSIX-only shell assumptions in app logic
- isolate platform-specific code
- test process spawning on at least one non-macOS path before release
```

Platform-sensitive areas:

```text
- executable lookup
- shell quoting
- path separators
- process tree termination
- file permissions
- terminal integration
- worktree paths
```

---

## 23. Security Policy

Treat every repo opened by the app as potentially hostile until trusted.

Security rules:

```text
- never auto-execute repo-provided scripts
- never auto-trust repo-provided conductor config
- show trust prompt for new repos
- sandbox or restrict agent execution where possible
- deny network by default unless agent requires it
- protect secrets
- redact logs
- avoid loading remote content into agent prompts without source labels
```

Prompt-injection precautions:

```text
- separate trusted system instructions from repo content
- label untrusted content clearly
- do not let README or config files override app safety policy
- do not let agents change their own permission policy without approval
```

---

## 24. Issue and Task Labels

Every issue/task should have labels.

Suggested labels:

```text
type:feature
type:bug
type:refactor
type:security
type:ui
type:docs
type:test
risk:low
risk:medium
risk:high
agent:codex
agent:claude
agent:gemini
needs:human-approval
needs:security-review
needs:ui-verification
```

High-risk labels automatically require Claude review and human approval:

```text
risk:high
type:security
auth
billing
shell
process
secrets
git
worktree
config
```

---

## 25. Prompting Policy

Prompts must be scoped.

Bad prompt:

```text
Build the role-aware conductor.
```

Good prompt:

```text
Implement Phase 1 only: YAML-backed role profile loading.

Scope:
- Add parser for `.parallel-code/conductor.yaml`.
- Add validation for roles and agents.
- Add unit tests.
- Do not implement UI.
- Do not spawn agents.
- Do not change git/worktree code.

Acceptance:
- Invalid YAML returns a structured error.
- Missing role primary agent fails validation.
- Unknown role mode fails validation.
- Tests pass.
```

Prompt template for Codex:

```text
Read AGENTS.md and this task.

Implement exactly the accepted scope.
Do not expand scope.
Do not touch protected paths.
Run required checks.
Return:
- summary
- files changed
- tests run
- risks
```

Prompt template for Claude review:

```text
Review this diff against the accepted plan.
Do not edit files.

Focus on:
- scope control
- correctness
- shell/process safety
- auth/billing safety
- config validation
- tests

Return:
1. blocking issues
2. non-blocking suggestions
3. questions for human
4. merge recommendation
```

---

## 26. Definition of Done

A task is done only when:

```text
- accepted scope is implemented
- diff is reviewed
- checks pass
- artifacts are written
- protected operations were approved
- risks are documented
- final human approval is given
```

For UI tasks:

```text
- screenshots or visual verification notes are attached
```

For security-sensitive tasks:

```text
- Claude security review is attached
- human explicitly accepts residual risk
```

For auth/billing tasks:

```text
- API-vs-subscription behavior is documented
- env-var override cases are tested
```

---

## 27. Project Phases

### Phase 1: Config and Role Profiles

Allowed agent behavior:

```text
Codex implements.
Claude reviews.
No Gemini required unless settings UI is involved.
```

Risks:

```text
configuration errors
schema drift
YAML round-trip loss
```

Required checks:

```text
unit tests for parser
validation tests
invalid config tests
```

### Phase 2: Agent Inventory and Auth Inspector

Allowed agent behavior:

```text
Codex implements.
Claude performs security/auth review.
Human approves before merge.
```

Risks:

```text
wrong auth mode
API billing surprise
secret leakage
bad env handling
```

Required checks:

```text
env detection tests
redaction tests
mock CLI detection tests
```

### Phase 3: Worktree Manager

Allowed agent behavior:

```text
Claude plans.
Codex implements.
Claude reviews.
Human approves.
```

Risks:

```text
destructive git operations
wrong branch
dirty repo state
path issues
```

Required checks:

```text
git command wrapper tests
worktree creation tests
dirty state tests
path safety tests
```

### Phase 4: CLI Process Runner

Allowed agent behavior:

```text
Claude plans and reviews.
Codex implements.
Human approves.
```

Risks:

```text
command injection
env leakage
hung processes
bad cancellation
cross-platform failures
```

Required checks:

```text
argument array tests
env minimization tests
timeout tests
cancellation tests
redaction tests
```

### Phase 5: Conductor Workflow Engine

Allowed agent behavior:

```text
Claude plans workflow graph.
Codex implements.
Claude reviews.
Human approves.
```

Risks:

```text
wrong routing
circular workflow dependencies
bad fallback behavior
unapproved writes
```

Required checks:

```text
workflow parser tests
DAG validation tests
role resolution tests
permission gate tests
```

### Phase 6: UI Dashboard

Allowed agent behavior:

```text
Codex implements UI.
Gemini/Antigravity verifies UI.
Claude reviews if complex.
```

Risks:

```text
confusing status
unsafe approval UX
missing warnings
```

Required checks:

```text
component tests
manual UI review
screenshots
accessibility basics
```

---

## 28. Human Lead Checklist Before Merge

Before merging any branch, the human lead must check:

```text
- Is the diff scoped to the approved task?
- Did tests run?
- Are test failures explained?
- Did the agent touch protected files?
- Were dependencies changed?
- Were auth/env/process/git areas changed?
- Did Claude review high-risk code?
- Were UI changes visually checked?
- Are artifacts complete?
- Is the final summary accurate?
```

If any answer is unclear, do not merge.

---

## 29. Required Repository Instructions

Add an `AGENTS.md` file at the repo root.

Minimum content:

```markdown
# AGENTS.md

## Project Rules

- Keep diffs small.
- Do not expand scope.
- Do not edit protected paths without approval.
- Do not install packages without approval.
- Do not push or merge.
- Use the configured package manager.
- Run lint, typecheck, tests, and build before claiming completion.
- Save test results and summaries as artifacts where applicable.

## Protected Areas

- environment files
- secrets
- process spawning
- shell command execution
- auth and billing logic
- git/worktree logic
- package files and lockfiles
- CI/deployment workflows

## Agent Roles

- Claude plans and reviews.
- Codex implements and fixes.
- Gemini/Antigravity verifies UI.
- Human lead approves final merge.
```

---

## 30. Summary

This project should be run with discipline because it is building the exact kind of tool where empirical studies show AI coding tools fail:

```text
- API/integration/configuration errors
- terminal problems
- command failures
- tool invocation failures
- command execution failures
- out-of-scope agent actions
- dependency and reproducibility gaps
- IDE/agent security boundary issues
```

The mitigation is not to avoid agents. The mitigation is to use them with:

```text
- small scoped tasks
- role separation
- worktree isolation
- protected paths
- explicit auth policy
- strict shell/process rules
- structured artifacts
- deterministic checks
- human approval gates
```

Default operating model:

```text
Claude plans and reviews.
Codex implements and fixes.
Gemini/Antigravity verifies UI.
Humans approve high-risk changes and merge.
```




---

# Appendix: gemini_claude_codex_strengths_architecture_handoff.md — SUPPORTING CONTEXT

```text
File path: /mnt/data/gemini_claude_codex_strengths_architecture_handoff.md
Size: 32410 bytes
```

# Gemini vs Claude vs Codex: Strengths, Role Assignment, and Ideal Multi-Agent Architecture

**Date:** 2026-06-01
**Goal:** Compare Gemini/Antigravity, Claude/Claude Code, and OpenAI Codex for an agentic coding workflow, then define an ideal architecture and handoff model for a Parallel Code-based multi-agent orchestrator.

---

## Executive Summary

The strongest practical architecture is not “pick the best model.” It is:

```text
Use each agent where its product surface and model behavior are strongest.
Preserve first-party subscription access.
Isolate work with Git worktrees.
Move structured artifacts between agents.
Keep the human as final merge authority.
```

Recommended role assignment:

```text
Codex
  Main implementation engine.
  Best default for code writing, bug fixing, tests, terminal execution, and PR cleanup.

Claude
  Planner, architect, reviewer, debugger, and risk analyst.
  Best default for design reasoning, critique, edge cases, and multi-perspective review.

Gemini / Antigravity
  UI, frontend, browser, multimodal, and visual-verification agent.
  Best default for interface variants, screenshots, browser recordings, and visual feedback loops.

Zed
  Cockpit, not model provider.
  Use Zed to host threads, diffs, files, terminals, and agent panels while keeping Codex, Claude, and Gemini authenticated through their native paths.

Git worktrees
  Isolation layer.
  One writable agent per worktree.
```

The online evidence supports the broad approach, but with nuance:

```text
Strongly supported:
  - multi-agent coding is becoming mainstream
  - worktrees are the correct isolation primitive
  - subscription-vs-API auth matters
  - human gates and permission boundaries are required
  - specialized agents should not all do the same task

Less settled:
  - the exact claim that "Codex is always best at coding"
  - the exact claim that "Claude is always best at planning"
  - the exact claim that "Gemini is always best at UI"

Better framing:
  Codex currently has the strongest terminal-agent benchmark signal.
  Claude has the strongest explicit product primitives for agent teams, review, and reasoning workflows.
  Gemini/Antigravity has the strongest browser/UI/artifact workflow surface.
```

---

## 1. Source-Based Snapshot

### 1.1 Benchmark signal

Terminal-Bench 2.1 currently reports:

```text
Codex CLI, GPT-5.5              83.4% ± 2.2
Claude Code, Claude Opus 4.8    78.9% ± 2.5
Gemini CLI, Gemini 3.1 Pro      70.7% ± 2.9
```

Source: [Terminal-Bench 2.1 Leaderboard](https://www.tbench.ai/leaderboard/terminal-bench/2.1)

Interpretation:

```text
Codex has the strongest current terminal-agent benchmark signal among the three.
Claude is close enough that it remains strategically important.
Gemini CLI is behind on this benchmark, but Terminal-Bench is not a UI/design/browser benchmark.
```

### 1.2 PR acceptance research

A 2026 task-stratified pull request study found that no single AI coding agent performed best across every task type. It reported that OpenAI Codex achieved consistently high acceptance rates across all nine task categories, while Claude Code led in documentation and feature tasks in that dataset, and Cursor led in fix tasks.

Source: [Comparing AI Coding Agents: A Task-Stratified Analysis of Pull Request Acceptance](https://arxiv.org/abs/2602.08915)

Interpretation:

```text
The correct conclusion is not "one agent is universally best."
The correct conclusion is "different task types favor different agents."
```

### 1.3 Head-to-head behavioral differences

A 2026 head-to-head study comparing Claude Code and Codex on a scientific computing pipeline found that both could complete the pipeline, but they behaved differently. Claude Code completed faster but silently deviated from the specification, while Codex took longer, used explicit self-correcting restarts, and followed a key instruction more literally.

Source: [First head-to-head comparison of agentic AI on Einstein Telescope data](https://arxiv.org/abs/2605.28916)

Interpretation:

```text
Claude may be faster and more fluid in some agentic workflows.
Codex may be more literal and auditable in some execution-heavy workflows.
Both need tests, checkpoints, and review.
```

### 1.4 Reliability and tool failure research

A 2026 empirical study of reported bugs in Claude Code, Codex, and Gemini CLI found that more than 67% of bugs were functionality-related, with API/integration/configuration errors accounting for 36.9% of root causes. Common symptoms included API errors, terminal problems, and command failures.

Source: [Engineering Pitfalls in AI Coding Tools](https://arxiv.org/abs/2603.20847)

Interpretation:

```text
The orchestration layer must treat agent tools as unreliable systems.
It needs retries, explicit auth boundaries, logs, permissions, and human gates.
```

---

## 2. Codex Deep Dive

## 2.1 Best role

```text
Primary implementer.
```

Use Codex for:

```text
- feature implementation
- bug fixes
- tests
- refactors with clear acceptance criteria
- terminal-heavy coding work
- lint/typecheck/test repair loops
- PR preparation
- final cleanup after review
```

## 2.2 Why Codex fits implementation

Codex is explicitly designed as a coding agent. OpenAI describes Codex as a tool that can write features, answer questions about a codebase, fix bugs, and propose pull requests. Each task can run in its own sandbox or environment.

Source: [Introducing Codex](https://openai.com/index/introducing-codex/)

Codex also supports subagents. OpenAI’s Codex documentation says Codex can spawn specialized agents in parallel, route follow-up instructions, wait for results, close agent threads, and return a consolidated response. It also warns that subagent workflows consume more tokens than comparable single-agent runs.

Source: [OpenAI Codex Subagents](https://developers.openai.com/codex/subagents)

This makes Codex suitable for execution-heavy workflows where the desired output is concrete:

```text
- edited files
- passing tests
- working branches
- PR summaries
```

## 2.3 Economic advantage for this user

Codex is especially attractive because the user already has ChatGPT Pro.

OpenAI’s Codex authentication docs distinguish two routes:

```text
Sign in with ChatGPT:
  uses subscription access

Sign in with API key:
  billed through OpenAI Platform at API rates
```

OpenAI explicitly says API-key usage is billed at standard API rates, and features relying on ChatGPT credits are available only through ChatGPT sign-in.

Source: [OpenAI Codex Authentication](https://developers.openai.com/codex/auth)

Zed also says a ChatGPT account can be used in Zed so OpenAI models run through Zed’s built-in agent with the usage the user gets in Codex directly.

Source: [Zed: Use Your ChatGPT Subscription in Zed](https://zed.dev/blog/chatgpt-subscription-in-zed)

This matters because the architecture should preserve:

```text
Codex through ChatGPT Pro
not Codex through API billing
```

## 2.4 Codex strengths

```text
1. Strong current terminal-agent benchmark performance.
2. Good default for implementation and test loops.
3. Works well when given precise acceptance criteria.
4. Supports subagent workflows for parallel exploration.
5. Subscription-based usage can be preserved through ChatGPT auth.
6. Better suited than Claude/Gemini as the default "do the code change" worker in this user’s budget model.
```

## 2.5 Codex weaknesses / risks

```text
1. May still overrun scope if task specs are vague.
2. Subagent workflows increase token/usage consumption.
3. Can become expensive if accidentally authenticated through API key instead of ChatGPT.
4. May be less useful than Claude for high-level architectural debate or nuanced critique.
5. Implementation can still be wrong without tests and human review.
```

## 2.6 Codex prompt style

Codex should receive:

```text
- a precise task
- an approved plan
- acceptance criteria
- file boundaries
- test commands
- explicit non-goals
```

Good Codex prompt:

```text
Read AGENTS.md and tasks/042-auth-refresh.md.

Implement exactly the accepted plan.
Do not expand scope.
Do not modify migrations, env files, or deployment config.
Run:
- pnpm lint
- pnpm typecheck
- pnpm test

Return:
- files changed
- tests run
- remaining risks
- PR summary
```

Bad Codex prompt:

```text
Improve the app.
```

---

## 3. Claude Deep Dive

## 3.1 Best role

```text
Planner, architect, reviewer, debugger, and risk analyst.
```

Use Claude for:

```text
- turning vague goals into implementation plans
- architecture decisions
- edge-case analysis
- security and maintainability review
- code review
- debugging hypotheses
- large refactor sequencing
- challenging assumptions
- reviewing Codex output before merge
```

## 3.2 Why Claude fits planning and review

Claude Code has explicit support for agent teams. Anthropic’s docs say Agent Teams coordinate multiple Claude Code instances with shared tasks, inter-agent messaging, centralized management, independent context windows, and direct teammate communication.

Source: [Claude Code Agent Teams](https://code.claude.com/docs/en/agent-teams)

Anthropic lists the strongest use cases for agent teams as:

```text
- research and review
- new modules or features
- debugging with competing hypotheses
- cross-layer coordination
```

The same docs also warn that Agent Teams add coordination overhead and use significantly more tokens than a single session, and work best when teammates can operate independently.

Source: [Claude Code Agent Teams](https://code.claude.com/docs/en/agent-teams)

This supports the idea that Claude is valuable as a reasoning coordinator and reviewer, but should not necessarily be the default heavy implementer when Codex is already available through ChatGPT Pro.

## 3.3 Economic and auth caveat

Claude Code can use Claude Pro or Max subscription access, but there is an important trap.

Anthropic says that if `ANTHROPIC_API_KEY` is set as an environment variable, Claude Code will use the API key instead of the Claude subscription, causing API usage charges even if the user is logged into Claude Code with a Claude subscription.

Source: [Manage API key environment variables in Claude Code](https://support.claude.com/en/articles/12304248-manage-api-key-environment-variables-in-claude-code)

Anthropic’s Claude Code Pro/Max support page gives the same warning.

Source: [Use Claude Code with your Pro or Max plan](https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan)

This supports the architecture’s need for an auth/billing inspector:

```text
Before launching Claude:
  check ANTHROPIC_API_KEY
  warn user if API key would override subscription
```

## 3.4 Claude strengths

```text
1. Strong for reasoning, planning, and critique.
2. Strong product primitives for teams, subagents, hooks, and review workflows.
3. Good at producing structured plans and identifying hidden risks.
4. Useful for reviewing Codex output before merge.
5. Strong fit for security, architecture, and maintainability discussions.
6. Can coordinate multiple Claude sessions when the work is naturally parallel.
```

## 3.5 Claude weaknesses / risks

```text
1. Claude Pro limits are shared between Claude app and Claude Code.
2. Agent Teams use more tokens and add coordination overhead.
3. Claude can silently reinterpret instructions in some workflows, so tests and review are required.
4. If ANTHROPIC_API_KEY is set, Claude Code may use API billing instead of subscription.
5. It is less economically ideal as the always-on implementer if the user already has ChatGPT Pro/Codex.
```

## 3.6 Claude prompt style

Claude should receive:

```text
- task context
- architecture constraints
- current diff
- test results
- risk questions
- explicit “do not edit” instructions when reviewing
```

Good Claude planning prompt:

```text
Read AGENTS.md, docs/architecture.md, and the task below.
Do not edit files.

Turn this into an implementation plan for Codex.

Return:
1. assumptions
2. affected files
3. implementation steps
4. edge cases
5. security concerns
6. test plan
7. acceptance criteria

Keep this small enough for one PR.
```

Good Claude review prompt:

```text
Review this branch against main.
Do not edit files.

Focus on:
- correctness
- architecture
- security
- hidden edge cases
- missing tests
- maintainability

Return blocking issues first.
Separate blocking issues from optional suggestions.
```

---

## 4. Gemini / Antigravity Deep Dive

## 4.1 Best role

```text
UI designer, browser verifier, visual QA agent, and frontend experimenter.
```

Use Gemini/Antigravity for:

```text
- UI variants
- frontend layout
- browser verification
- visual inspection
- screenshots
- browser recordings
- responsive behavior checks
- empty/loading/error states
- design-system consistency
- “try three interface approaches”
```

## 4.2 Why Gemini/Antigravity fits UI and visual workflows

Google Antigravity is explicitly designed around an agent-first development platform with an Agent Manager, Editor, and Browser surface. Its docs describe the Browser as providing browser-use agent capabilities beyond the IDE, and the Agent Manager as an orchestration view for starting and viewing tasks with conversations and artifacts.

Source: [Google Antigravity Docs](https://antigravity.google/docs/home)

Google Antigravity artifacts include:

```text
- rich markdown plans
- code diffs
- architecture diagrams
- images
- browser recordings
```

Source: [Google Antigravity Artifacts](https://antigravity.google/docs/artifacts)

Antigravity also supports browser screenshot capture, with screenshots saved as image artifacts that can be commented on for feedback.

Source: [Google Antigravity Screenshots](https://antigravity.google/docs/screenshots)

The Verge’s launch coverage described Antigravity as an agent-first coding tool with Editor and Manager views, multiple agents with access to editor, terminal, and browser, and artifacts such as task lists, plans, screenshots, and browser recordings.

Source: [The Verge: Google Antigravity is an agent-first coding tool](https://www.theverge.com/news/822833/google-antigravity-ide-coding-agent-gemini-3-pro)

This does not prove Gemini is always the best model for UI. It does support a narrower and stronger claim:

```text
Gemini/Antigravity has the strongest product surface for UI/browser/visual agent workflows.
```

## 4.3 Transition caveat: Gemini CLI vs Antigravity CLI

Google announced that Gemini CLI and Gemini Code Assist IDE extensions would stop serving requests for Google AI Pro, Ultra, and free individual users on June 18, 2026, with Antigravity CLI available as the transition path.

Source: [Google Developers Blog: Transitioning Gemini CLI to Antigravity CLI](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/)

This matters for a Parallel Code fork because Zed’s current external-agent docs list Gemini CLI. The architecture should therefore avoid hard-coding Gemini CLI as the long-term Google adapter.

Correct abstraction:

```text
google_visual_agent
  ├── Gemini CLI
  ├── Antigravity CLI
  └── future Google agent backend
```

## 4.4 Gemini / Antigravity strengths

```text
1. Best product surface for browser and UI verification.
2. Strong artifact model: plans, diffs, images, browser recordings.
3. Useful for visual feedback loops that text-only agents handle poorly.
4. Strong fit for frontend variants, responsive design, and UI QA.
5. Good use of the user’s student Google entitlement while available.
```

## 4.5 Gemini / Antigravity weaknesses / risks

```text
1. Gemini CLI trails Codex and Claude Code on Terminal-Bench 2.1.
2. Gemini CLI entitlement path is changing toward Antigravity CLI.
3. Antigravity is more Google-centric than Zed.
4. Security concerns are higher when browser and terminal autonomy are enabled.
5. It may not preserve ChatGPT Pro/Codex or Claude Pro/Claude Code economics.
6. Zed’s Gemini integration may lag Google’s Antigravity transition.
```

Security note: reporting around Antigravity highlighted prompt-injection and command-execution concerns in agentic IDE workflows, especially when agents can run terminal commands and process untrusted files.

Source: [TechRadar: Google Antigravity IDE security issues](https://www.techradar.com/pro/googles-ai-powered-antigravity-ide-already-has-some-worrying-security-issues)

## 4.6 Gemini / Antigravity prompt style

Good UI prompt:

```text
Use the current implementation branch.
Focus only on the dashboard UI.

Evaluate:
- layout clarity
- responsive behavior
- empty/loading/error states
- visual hierarchy
- accessibility basics
- design-system consistency

Use browser verification.
Return:
- screenshots or browser recording
- visual issues
- suggested fixes
- whether the implementation is acceptable
```

Good implementation prompt:

```text
Create one UI variant for the dashboard.
Do not change backend APIs.
Do not modify data models.
Keep changes limited to component and style files.
Return screenshots and a summary of files changed.
```

---

## 5. Comparative Matrix

| Dimension | Codex | Claude | Gemini / Antigravity |
|---|---|---|---|
| Best default role | Implementation | Planning / review | UI / browser / visual |
| Strongest surface | Codex CLI/app/IDE | Claude Code / Agent Teams | Antigravity Manager / Browser |
| Best for heavy coding | Yes | Sometimes | Less ideal as default |
| Best for architecture reasoning | Good | Strongest default | Good but not primary |
| Best for code review | Good | Strongest default | Useful for UI review |
| Best for UI/browser verification | Limited unless paired with tools | Good reasoning, weaker visual surface | Strongest default |
| Best for parallel agents | Codex subagents | Claude Agent Teams | Antigravity Manager |
| Main economic advantage | ChatGPT Pro/Codex entitlement | Claude Pro/Max if subscribed | Student entitlement / Google access |
| Main risk | API vs subscription auth, scope drift | token overhead, silent reinterpretation, API key override | product transition, security, weaker terminal benchmark |
| Ideal Zed role | Writable implementation thread | Read-only planner/reviewer thread | UI/visual verifier thread |

---

## 6. Ideal Architecture

## 6.1 High-level architecture

```text
User task
  ↓
Parallel Code with Agent Conductor
  ↓
Task classifier / router
  ↓
Role-specific context packs
  ↓
Agent threads
  ├── Claude thread: plan / review
  ├── Codex thread: implement / test / fix
  └── Gemini-Antigravity thread: UI / browser / visual verify
  ↓
Artifact store
  ↓
Evaluator gates
  ↓
Human approval
  ↓
Merge / PR
```

## 6.2 Main components

```text
Parallel Code with Agent Conductor
  The meta-orchestrator UI and workflow engine.

Agent Registry
  Tracks available agents, auth mode, capabilities, and preferred roles.

Router
  Maps tasks to workflow templates and agent roles.

Context Pack Builder
  Creates minimal role-specific context for each agent.

Thread Bridge
  Creates and messages Codex, Claude, and Gemini/Antigravity threads.

Worktree Manager
  Creates isolated branches/worktrees for writable tasks.

Artifact Store
  Stores plans, diffs, screenshots, test reports, reviews, and final summaries.

Evaluator
  Runs deterministic checks before model review.

Permission Gate
  Controls file writes, terminal commands, package installs, migrations, commits, pushes.

Human Gate
  Requires approval before high-impact steps and final merge.
```

## 6.3 Subscription-preserving auth design

The architecture must avoid silently converting subscription usage into API billing.

### Codex

```text
Preferred:
  ChatGPT login / Codex entitlement

Avoid unless intentional:
  OpenAI API key billing
```

Source: [OpenAI Codex Authentication](https://developers.openai.com/codex/auth)

### Claude

```text
Preferred:
  Claude Code login through Claude Pro / Max

Danger:
  ANTHROPIC_API_KEY overrides subscription and causes API charges
```

Source: [Claude Code API key environment variables](https://support.claude.com/en/articles/12304248-manage-api-key-environment-variables-in-claude-code)

### Gemini / Antigravity

```text
Preferred:
  Google account / student entitlement / Antigravity path

Avoid:
  accidental API-key-only path if it bypasses included entitlement
```

### Zed

Zed’s external-agent docs state that external agents run as separate processes through ACP and billing stays between the user and provider. Zed does not charge for external agents.

Source: [Zed External Agents](https://zed.dev/docs/ai/external-agents)

Zed’s ChatGPT subscription support also says OpenAI models can run through Zed with the usage the user gets in Codex directly.

Source: [Zed: Use Your ChatGPT Subscription in Zed](https://zed.dev/blog/chatgpt-subscription-in-zed)

This is why Zed is the preferred cockpit.

---

## 7. Role-Based Routing Rules

## 7.1 Default routing

```text
Simple bug fix:
  Codex implement
  Codex run tests
  Human review

Backend feature:
  Claude plan
  Codex implement
  Claude review
  Codex fix blockers
  Human approve

Auth/security/data change:
  Claude plan
  Codex implement
  Claude security review
  Codex fix blockers
  Human approve

UI feature:
  Claude or Codex functional plan
  Codex implement structure
  Gemini/Antigravity visual verify
  Codex fix visual issues
  Claude review if complex
  Human approve

Large refactor:
  Claude architecture plan
  Human approve plan
  Codex implement in slices
  Claude review each slice
  Codex fix blockers
  Human approve

Debugging unknown issue:
  Claude generate hypotheses
  Codex test hypotheses
  Claude review evidence
  Codex implement fix
  Human approve
```

## 7.2 Router heuristic

```rust
fn route(task: &TaskSpec) -> WorkflowTemplate {
    if task.has_label("ui")
        || task.mentions(["layout", "responsive", "component", "visual", "design"]) {
        return WorkflowTemplate::UiBuildVerify;
    }

    if task.mentions(["auth", "security", "migration", "schema", "architecture"]) {
        return WorkflowTemplate::ClaudePlanCodexImplementClaudeReview;
    }

    if task.mentions(["bug", "failing test", "regression", "crash"]) {
        return WorkflowTemplate::CodexFixClaudeReviewIfRisky;
    }

    if task.mentions(["refactor", "rewrite", "modularize", "technical debt"]) {
        return WorkflowTemplate::ClaudePlanCodexSliceImplementation;
    }

    WorkflowTemplate::CodexSimpleImplementation;
}
```

---

## 8. Ideal Handoff Design

## 8.1 Handoff principle

Agents should exchange structured artifacts, not raw chat transcripts.

Bad handoff:

```text
Copy entire Claude chat into Codex.
Copy entire Codex chat into Claude.
Hope each agent infers what matters.
```

Good handoff:

```text
Claude → accepted_plan.md
Codex → implementation.diff + test_report.json
Gemini → ui_review.md + screenshots
Claude → blocking_review.md
Codex → final_patch.diff + final_test_report.json
```

## 8.2 Artifact contract

Each step produces a typed artifact.

```text
PlanArtifact
  produced_by: Claude
  consumed_by: Codex
  fields:
    - assumptions
    - files likely involved
    - implementation steps
    - acceptance criteria
    - tests
    - risks

ImplementationArtifact
  produced_by: Codex
  consumed_by: Claude and Gemini
  fields:
    - diff
    - files changed
    - commands run
    - test results
    - known risks

UiReviewArtifact
  produced_by: Gemini / Antigravity
  consumed_by: Codex
  fields:
    - screenshots
    - browser recording
    - visual issues
    - recommended fixes
    - accept/reject verdict

CodeReviewArtifact
  produced_by: Claude
  consumed_by: Codex
  fields:
    - blocking issues
    - non-blocking suggestions
    - security concerns
    - missing tests
    - final recommendation

FinalizationArtifact
  produced_by: Codex
  consumed_by: Human
  fields:
    - final diff
    - tests passed
    - risks
    - PR summary
```

## 8.3 Handoff sequence for a backend feature

```text
1. User writes task.
2. Parallel Code with Agent Conductor classifies task as backend feature.
3. Claude receives planning context pack.
4. Claude produces PlanArtifact.
5. Human approves or edits plan.
6. Codex receives approved plan.
7. Codex implements in new worktree.
8. Codex runs tests.
9. Codex produces ImplementationArtifact.
10. Claude receives diff + tests + plan.
11. Claude produces CodeReviewArtifact.
12. Human accepts/rejects review items.
13. Codex fixes accepted blockers.
14. Evaluator reruns tests.
15. Human reviews final diff.
16. Human merges.
```

## 8.4 Handoff sequence for a UI feature

```text
1. User writes UI task.
2. Parallel Code with Agent Conductor classifies task as UI feature.
3. Claude produces functional plan if needed.
4. Codex implements functional structure.
5. Gemini/Antigravity receives UI context pack.
6. Gemini/Antigravity opens browser, inspects UI, captures screenshots/recordings.
7. Gemini/Antigravity produces UiReviewArtifact.
8. Codex fixes accepted visual issues.
9. Claude reviews code quality if the change is non-trivial.
10. Human reviews screenshots and final diff.
11. Human merges.
```

## 8.5 Handoff sequence for a bug

```text
1. User describes bug.
2. Claude produces possible hypotheses if root cause is unclear.
3. Codex reproduces bug and adds failing test.
4. Codex implements fix.
5. Codex runs test suite.
6. Claude reviews whether the fix addresses root cause or just symptom.
7. Codex fixes review blockers.
8. Human approves.
```

---

## 9. Worktree Policy

The orchestrator should create worktrees automatically.

```text
main
  ├── .worktrees/feat-auth-codex
  ├── .worktrees/feat-dashboard-ui
  └── .worktrees/review-auth-claude
```

Default policy:

```text
Codex:
  writable worktree

Claude planning:
  read-only main or read-only worktree

Claude review:
  read-only branch/diff

Gemini / Antigravity:
  writable only for UI experiments
  otherwise browser/read-only visual verification

Human:
  only actor who merges to main
```

Rules:

```text
1. Never let two writable agents edit the same branch at the same time.
2. Never let an agent push without explicit approval.
3. Never auto-merge.
4. Keep review agents read-only by default.
5. Use separate worktrees for competing hypotheses or UI variants.
```

---

## 10. Context Pack Design

## 10.1 Planner context pack for Claude

```text
- user task
- AGENTS.md
- CLAUDE.md
- architecture docs
- relevant files
- constraints
- prior decisions
```

Claude output:

```text
accepted_plan.md
risk_log.md
test_plan.md
```

## 10.2 Implementer context pack for Codex

```text
- accepted_plan.md
- AGENTS.md
- exact files
- acceptance criteria
- test commands
- forbidden files
```

Codex output:

```text
implementation.diff
test_report.json
pr_summary.md
```

## 10.3 UI context pack for Gemini / Antigravity

```text
- task spec
- route/page to inspect
- component files
- design-system docs
- screenshots if available
- browser target
```

Gemini/Antigravity output:

```text
ui_review.md
screenshots/
browser_recording/
visual_acceptance.md
```

## 10.4 Reviewer context pack for Claude

```text
- original task
- accepted plan
- implementation diff
- test report
- UI review if relevant
- known risks
```

Claude output:

```text
blocking_review.md
non_blocking_suggestions.md
merge_recommendation.md
```

---

## 11. Permission and Safety Design

## 11.1 Default permissions

```text
Codex:
  file_write = allow within task worktree
  terminal_safe_command = allow
  package_install = ask
  migration = ask
  git_commit = ask
  git_push = deny

Claude:
  file_write = deny by default
  terminal = ask
  review_mode = read-only
  git_commit = deny

Gemini / Antigravity:
  browser_localhost = allow
  screenshots = allow
  file_write = ask
  terminal = ask
  network = allowlist
```

## 11.2 Protected files

```text
.env
.env.*
secrets/**
infra/prod/**
.github/workflows/deploy.yml
migrations/**
package manager lockfiles
deployment config
```

## 11.3 Required human approval

```text
- first write by a non-Codex agent
- package install
- database migration
- deleting files
- touching env/secrets/deploy files
- committing
- merging
- pushing
- changing auth or payment logic
```

---

## 12. Ideal Future Editor-Native Path Implementation

## 12.1 Add Conductor Thread

```text
New Thread → Conductor
```

User prompt:

```text
/conduct Build a responsive onboarding flow.
Use Claude to plan, Codex to implement, Gemini/Antigravity to verify UI,
then Claude to review. Do not merge without approval.
```

Rendered workflow:

```text
Conductor Run: Responsive onboarding flow

[✓] Claude Plan
[●] Codex Implementation
[ ] Gemini UI Verification
[ ] Claude Review
[ ] Codex Fixes
[ ] Human Approval
```

## 12.2 Add agent registry

```yaml
agents:
  codex:
    roles: [implementer, tester, fixer]
    auth_preference: chatgpt_subscription
    writable: true

  claude:
    roles: [planner, reviewer, risk_analyst]
    auth_preference: claude_subscription
    writable: false_by_default

  google_visual:
    roles: [ui_designer, visual_verifier]
    backend: antigravity_or_gemini
    writable: ask
```

## 12.3 Add billing/auth warnings

Before launching agents:

```text
Codex:
  If OPENAI_API_KEY or CODEX_API_KEY is active, warn the user if ChatGPT auth is preferred.

Claude:
  If ANTHROPIC_API_KEY is active, warn that Claude Code will use API billing instead of Claude subscription.

Gemini:
  Warn if using API key instead of Google entitlement.
  Warn if Gemini CLI path is deprecated for the user’s plan and Antigravity CLI should be used.
```

## 12.4 Add artifact tabs

```text
Plan | Diff | Tests | UI Screenshots | Browser Recording | Review | Risks | Final Summary
```

## 12.5 Add workflow templates

```text
/conductor simple-codex
/conductor claude-plan-codex-implement
/conductor ui-build-verify
/conductor bug-hunt
/conductor refactor-safe
/conductor security-review
```

---

## 13. Practical Default Workflow

For most real development:

```text
Step 1:
  Claude creates plan.

Step 2:
  Human approves or edits plan.

Step 3:
  Codex implements in worktree.

Step 4:
  Codex runs checks.

Step 5:
  Gemini/Antigravity verifies UI if relevant.

Step 6:
  Claude reviews final diff.

Step 7:
  Codex fixes accepted blockers.

Step 8:
  Human reviews and merges.
```

This is the preferred default because it balances:

```text
quality
usage cost
agent strengths
safety
human control
```

---

## 14. Practical CLI / Zed Setup

## 14.1 Codex

```bash
npm i -g @openai/codex
codex login
```

Choose ChatGPT login if using ChatGPT Pro subscription access.

## 14.2 Claude

```bash
claude
/login
```

Use Claude Code login for subscription access.

Check for API key override:

```bash
echo $ANTHROPIC_API_KEY
```

If it is set and subscription usage is preferred, unset it before running Claude Code:

```bash
unset ANTHROPIC_API_KEY
```

## 14.3 Zed

Use the configured editor/agent surface only as an optional bridge:

```text
New Codex Thread
New Claude Agent Thread
New Gemini / Google Visual Agent Thread
```

Zed supports external agents through ACP, including Codex, Claude Agent, Gemini CLI, and configurable agents.

Source: [Zed External Agents](https://zed.dev/docs/ai/external-agents)

---

## 15. Final Recommendation

The ideal architecture is:

```text
Parallel Code with Agent Conductor
  controls workflow state

Codex
  implements and fixes

Claude
  plans and reviews

Gemini / Antigravity
  verifies UI and visual behavior

Git worktrees
  isolate writable work

Artifact store
  moves structured information between agents

Permission gates
  prevent unsafe autonomy

Human approval
  controls merge and production-impacting decisions
```

The final role map:

```text
Codex:
  "Build this."

Claude:
  "Should we build it this way?"

Gemini / Antigravity:
  "Does this look and behave right in the browser?"

Parallel Code with Agent Conductor:
  "Route the work, preserve context, capture artifacts, enforce boundaries."

Human:
  "Approve the plan, accept the risk, merge the code."
```

The strongest reason to build the Parallel Code fork is that it would combine four things that current tools rarely combine cleanly:

```text
1. first-party subscription preservation
2. cross-company agent orchestration
3. desktop workflow and diff review
4. worktree-based safety with structured handoffs
```

That is the product gap.




---

# Appendix: online_research_agent_orchestrator_consensus_and_products.md — SUPPORTING CONTEXT

```text
File path: /mnt/data/online_research_agent_orchestrator_consensus_and_products.md
Size: 36311 bytes
```

# Online Research: Is the Parallel Code with Agent Conductor Idea Common, and Does a Product Already Exist?

**Date:** 2026-06-01
**Question:** Is the reasoning behind a Parallel Code-based meta-orchestrator for Codex, Claude, and Gemini/Antigravity common among agent-using developers? Does a product already exist that serves this need, and what are its cons versus Zed?

---

## Executive Conclusion

The short answer:

```text
Yes, the reasoning is broadly aligned with current agent-using developer practice.

No, it is not yet a settled "universal consensus" in the formal sense.

Yes, products already exist that partially serve the need.

No, I did not find a product that cleanly combines all of the following:
  - Parallel Code-style local desktop workflow
  - Codex via ChatGPT subscription / Codex entitlement
  - Claude Code via Claude Pro/Max subscription
  - Gemini/Antigravity via Google entitlement
  - multi-provider role-based orchestration
  - worktree isolation
  - structured handoffs
  - artifact capture
  - human approval gates
```

The clearest product-market evidence is that multiple tools now exist specifically to manage parallel AI coding agents using worktrees: **Parallel Code**, **Conductor**, **Cursor Agents/Worktrees**, **Warp/Oz**, **Claude Agent View / Agent Teams**, and **Google Antigravity**.

The strongest pattern online is:

```text
Agentic coding is no longer just "one AI chat edits files."
Power users increasingly think in terms of:
  - multiple agents
  - separate branches/worktrees
  - explicit plans
  - review loops
  - test gates
  - human approval
  - subscription/auth economics
```

The part that is most clearly common:

```text
Use git worktrees or isolated workspaces for parallel agents.
```

The part that is emerging but not yet universally solved:

```text
Use a neutral cockpit to orchestrate Codex, Claude, and Gemini/Antigravity by role,
while preserving first-party subscription usage instead of forcing API billing.
```

The part that is more speculative:

```text
A Parallel Code fork as the ideal implementation surface.
```

Zed has unusually good primitives for this because it supports external agents through ACP, parallel threads, Codex, Claude Agent, and Gemini CLI. But Zed currently behaves more like a multi-agent cockpit than a full meta-orchestrator.

Sources:

- [Zed External Agents](https://zed.dev/docs/ai/external-agents)
- [Zed Parallel Agents](https://zed.dev/docs/ai/parallel-agents)
- [Zed: Use Your ChatGPT Subscription in Zed](https://zed.dev/blog/chatgpt-subscription-in-zed)
- [Parallel Code](https://parallelcode.app/)
- [Parallel Code GitHub](https://github.com/johannesjo/parallel-code)
- [Conductor](https://www.conductor.build/)
- [Cursor Pricing](https://cursor.com/pricing)
- [Cursor Worktrees Docs](https://cursor.com/docs/configuration/worktrees)
- [Claude Code Parallel Agents Docs](https://code.claude.com/docs/en/agents)
- [OpenAI Codex Authentication](https://developers.openai.com/codex/auth)
- [Claude Code API Key Environment Variables](https://support.claude.com/en/articles/12304248-manage-api-key-environment-variables-in-claude-code)

---

## 1. What You Want, Restated

The desired system is:

```text
A meta-orchestrator inside or around Zed that can:
  - route planning/review to Claude
  - route implementation/testing/fixes to Codex
  - route UI/browser/visual verification to Gemini or Antigravity
  - run agents in isolated worktrees
  - preserve native subscription auth
  - avoid accidental API billing
  - move structured artifacts between agents
  - require human approval before merge/push
```

The desired economic model:

```text
Codex:
  use ChatGPT Pro / Codex entitlement

Claude:
  use Claude Pro/Max / Claude Code entitlement

Gemini/Antigravity:
  use Google student / Google entitlement where possible

Zed:
  act as cockpit and workflow layer, not as another usage-billed model platform
```

The core suspicion:

```text
Some competing products may offer multi-agent orchestration,
but they may route through API billing or their own credit pools rather than preserving
the "reserved" first-party CLI/subscription usage that Zed can preserve.
```

That suspicion is partly correct.

---

## 2. Is This Reasoning Common Online?

## 2.1 Not formal consensus, but strong practitioner convergence

There is no formal “consensus” poll proving that most agent-using developers want exactly this architecture. However, the online evidence shows strong convergence around the same underlying needs:

```text
- parallel agents create coordination problems
- worktrees are the preferred isolation primitive
- handoffs and ownership become harder than raw model capability
- review/test/approval loops are essential
- API-vs-subscription billing is a real concern
- developers want to reuse existing CLIs rather than pay another platform when possible
```

A Reddit thread in r/ClaudeCode frames the exact coordination problem: once developers go beyond one coding agent, the hard part becomes ownership, avoiding overlapping changes, handling handoffs, deciding when to step in, and recovering when a run goes sideways. The same thread explicitly lists git worktrees, multiple branches, separate terminals/sessions, handoff docs, and manual review/merge flow as the practical tools people are using or evaluating.

Source: [Reddit: Managing multiple coding agents in parallel](https://www.reddit.com/r/ClaudeCode/comments/1st213z/how_are_you_managing_multiple_coding_agents_in/)

This is extremely close to the reasoning behind the proposed Parallel Code with Agent Conductor.

## 2.2 Worktrees are the strongest common pattern

The strongest online pattern is worktree isolation.

Anthropic’s Claude Code documentation explicitly says worktrees give each session a separate git checkout so parallel sessions never edit the same files. It also says that when tasks touch the same files, developers should isolate work with worktrees; agent teams do not isolate teammates in worktrees, so work must be partitioned.

Source: [Claude Code: Run agents in parallel](https://code.claude.com/docs/en/agents)

A Hacker News workflow example describes using several git worktrees, creating ticket-based branches, having Claude research and plan, reviewing the plan, running linters/tests, using another Claude instance to review changes, and then manually reviewing the code before merge.

Source: [HN: Is it actually possible to run multiple coding sessions in parallel?](https://news.ycombinator.com/item?id=47573483)

A Reddit comment in r/AI_Agents says the developer moved to running each agent in its own git worktree after two agents edited the same migration file and created a merge conflict that took longer to untangle than the original task.

Source: [Reddit: Multiple AI coding agents with isolated profiles](https://www.reddit.com/r/AI_Agents/comments/1tktx6m/run_multiple_ai_coding_agents_simultaneously_with/)

Another Reddit thread says “Git worktrees + compound-engineering” works well, and emphasizes that planning first helps logically separate worktrees by domain and minimize merge conflicts. It also says the bottleneck becomes review and testing speed.

Source: [Reddit: Running multiple Claude Code sessions with git worktrees](https://www.reddit.com/r/ClaudeAI/comments/1tp19x7/running_multiple_claude_code_sessions_in_parallel/)

Conclusion:

```text
The worktree part of your reasoning is strongly supported by current developer practice.
```

## 2.3 Planning before implementation is also common

The HN workflow example is very close to the desired Claude-plan → implement → review loop:

```text
1. create ticket with acceptance criteria
2. worktree + branch
3. ask Claude to research and plan
4. review and refine plan
5. let Claude implement
6. run tests and quality checks
7. start a separate Claude instance to review
8. manually review and iterate
```

Source: [HN: Is it actually possible to run multiple coding sessions in parallel?](https://news.ycombinator.com/item?id=47573483)

The exact model split in our proposed architecture is different because Codex is the preferred implementer, but the reasoning is the same:

```text
plan first
implement second
review third
human approval last
```

Conclusion:

```text
The planning/review loop is common.
The specific "Claude plans, Codex implements" split is plausible but not universal.
```

## 2.4 Multi-provider orchestration is emerging

Several sources show that developers want to combine tools rather than stay inside one provider.

Zed’s external-agent documentation says it supports Gemini CLI, Claude Agent, Codex, GitHub Copilot, and configurable agents through ACP. It also says billing/legal arrangements stay directly between the user and the agent provider.

Source: [Zed External Agents](https://zed.dev/docs/ai/external-agents)

Parallel Code explicitly markets itself as a way to use Claude Code, Codex CLI, Gemini CLI, and Copilot CLI from one interface, with each task in its own branch and worktree.

Source: [Parallel Code](https://parallelcode.app/)

Warp’s docs and marketing describe running third-party CLI agents like Claude Code, Codex, and OpenCode with Warp’s agent toolbelt.

Source: [Warp Docs](https://docs.warp.dev/)

GitHub Agent HQ also points in the same direction: The Verge reported that GitHub added Claude and Codex agents into GitHub/Copilot so developers can select different agents for tasks.

Source: [The Verge: GitHub adds Claude and Codex AI coding agents](https://www.theverge.com/news/873665/github-claude-codex-ai-agents)

Conclusion:

```text
The industry is moving toward multi-agent and multi-provider access.
The exact neutral, subscription-preserving, desktop orchestrator remains underdeveloped.
```

---

## 3. Is There a Product That Already Does This?

## 3.1 Product landscape summary

| Product | How close is it? | Best description | Main weakness versus Parallel Code fork |
|---|---:|---|---|
| Zed | High substrate, incomplete orchestrator | Editor-native ACP cockpit | No full meta-orchestrator yet |
| Parallel Code | Very close operationally | Standalone multi-agent worktree manager | Not desktop; less deep code/symbol/diff integration than a Parallel Code fork |
| Conductor | Close for Mac + Codex/Claude | Mac app for parallel Codex + Claude workspaces | Mac-only; apparently Codex/Claude-focused; not clearly Gemini/Antigravity-centered |
| Cursor | Strong AI IDE | Integrated AI IDE with agents/worktrees | Uses Cursor usage pools/on-demand/BYOK API, not first-party Codex/Claude CLI entitlements |
| Warp/Oz | Strong terminal/control-plane option | Agentic terminal / cloud agent platform | Credit-based Warp agent economics; terminal-first, not editor-first |
| Google Antigravity | Strong manager/browser surface | Google agent-first IDE with artifacts | Google-centric; not obviously preserving Codex/Claude subscriptions |
| Claude Agent Teams | Strong internal orchestration | Multi-Claude coordination | Claude-only unless external tools exposed through MCP |
| GitHub Agent HQ | Strong platform direction | Select agents inside GitHub/Copilot | Copilot subscription/premium request model; not Zed/local-first |

---

## 4. Zed as Baseline

Zed currently supports:

```text
- external agents through ACP
- Gemini CLI
- Claude Agent
- Codex
- GitHub Copilot
- configurable agents
- parallel independent threads
- different agents in different threads
- ChatGPT subscription use in Zed agent
```

Zed’s external-agent docs state that external-agent interactions are UI-based and that billing/legal/terms arrangements are directly between the user and the agent provider. Zed does not charge for external-agent use.

Source: [Zed External Agents](https://zed.dev/docs/ai/external-agents)

Zed’s Codex integration is especially relevant because it can prompt the user to authenticate with ChatGPT, `CODEX_API_KEY`, or `OPENAI_API_KEY`. Zed’s docs say ChatGPT login allows use of an existing paid ChatGPT subscription, while API key paths use those keys.

Source: [Zed External Agents: Codex CLI](https://zed.dev/docs/ai/external-agents)

Zed’s blog also says that signing into Zed’s agent with ChatGPT lets OpenAI models run with the same usage the user gets in Codex directly.

Source: [Zed: Use Your ChatGPT Subscription in Zed](https://zed.dev/blog/chatgpt-subscription-in-zed)

Zed’s parallel-agents documentation says each thread can use a different agent, so a user can run Zed’s built-in agent in one thread and an external agent like Claude Code or Codex in another.

Source: [Zed Parallel Agents](https://zed.dev/docs/ai/parallel-agents)

## 4.1 Zed’s major advantage

```text
Zed can be a neutral cockpit while preserving provider-native auth.
```

This directly supports your subscription-preserving thesis.

## 4.2 Zed’s current gaps

Zed is not yet the meta-orchestrator you want.

Current gaps:

```text
- no automatic task decomposition across Codex/Claude/Gemini
- no built-in "Claude plan → Codex implement → Gemini verify → Claude review" workflow
- no agent-to-agent dependency graph
- no structured artifact contract between agents
- no first-class handoff system
- no budget-aware router
- external agents have feature gaps
```

Zed’s own external-agent docs list several current limitations:

```text
Gemini CLI:
  - editing past messages not yet available
  - resuming threads from history not yet available
  - checkpointing not yet available

Claude Agent:
  - Agent Teams not supported
  - Hooks not supported
  - some agent panel features not yet available

Codex:
  - some agent panel features not yet available, including editing past messages,
    resuming threads from history, and checkpointing
  - ChatGPT login is not currently supported in remote projects
```

Source: [Zed External Agents](https://zed.dev/docs/ai/external-agents)

Conclusion:

```text
Zed is a strong foundation, not the finished product.
The fork idea is still meaningful.
```

---

## 5. Parallel Code

Parallel Code is one of the closest products to what you want.

It says it works with:

```text
- Claude Code
- Codex CLI
- Gemini CLI
- Copilot CLI
```

It creates:

```text
- a git branch
- a git worktree
- an isolated directory for the agent
```

Then the user reviews the diff and merges from the sidebar.

Sources:

- [Parallel Code](https://parallelcode.app/)
- [Parallel Code GitHub](https://github.com/johannesjo/parallel-code)

Parallel Code’s GitHub README says:

```text
- use the AI coding tools you already trust
- free and open source
- no extra subscription required
- each task gets its own branch and worktree
- run agents in parallel
```

Source: [Parallel Code GitHub](https://github.com/johannesjo/parallel-code)

## 5.1 Why Parallel Code is strong evidence that your idea is common

Parallel Code is essentially a productized version of this idea:

```text
Developers want to run multiple first-party CLI agents in parallel
without paying another model platform
and without letting them collide in the same working directory.
```

That strongly supports your reasoning.

## 5.2 Pros versus Zed

```text
- already exists
- open source
- supports Claude Code, Codex CLI, Gemini CLI, Copilot CLI
- explicitly uses git worktrees
- no extra subscription required
- standalone dashboard for parallel agent work
```

## 5.3 Cons versus a Parallel Code fork

```text
- standalone Electron app, not desktop
- your IDE still handles code; Parallel Code manages agents/worktrees
- weaker integration with Zed’s files, symbols, diagnostics, tabs, and editor state
- less natural as the central code-review cockpit
- likely less suitable for deep inline review and context-aware symbol navigation
- does not appear to provide a full role-based meta-orchestrator by default
- user still chooses which agent to use for a task rather than automatic Claude/Codex/Gemini handoff
```

Parallel Code’s own FAQ says it is a standalone Electron app and that the user should keep using their preferred editor; Parallel Code manages agents and worktrees, while the IDE handles code.

Source: [Parallel Code](https://parallelcode.app/)

## 5.4 Verdict

```text
Parallel Code is the closest proof that the product gap is real.

But it does not eliminate the case for a Parallel Code fork, because it is not desktop
and does not appear to implement the full meta-orchestrator/handoff architecture.
```

---

## 6. Conductor

Conductor is also close.

Its homepage says:

```text
Create parallel Codex + Claude Code agents in isolated workspaces.
See what they are working on.
Review and merge their changes.
```

Source: [Conductor](https://www.conductor.build/)

It describes each task as having:

```text
- its own branch
- files
- chat
- terminal
- preview
- reviewable diff
```

Source: [Conductor](https://www.conductor.build/)

## 6.1 Pros versus Zed

```text
- directly targets parallel coding agents
- supports Codex + Claude Code
- isolated workspaces
- reviewable diffs
- task/workspace UI
```

## 6.2 Cons versus a Parallel Code fork

```text
- Mac app
- homepage focuses on Codex + Claude Code, not Gemini/Antigravity
- not clearly an desktop Zed-style environment
- may be less suitable if the user wants Zed as the main coding cockpit
- unknown depth of subscription-preserving behavior beyond running native agents
- not clearly a role-based meta-orchestrator across three providers
```

## 6.3 Verdict

```text
Conductor is a strong existing competitor for the "parallel Codex + Claude" part.

It does not obviously cover the full desired target:
Codex + Claude + Gemini/Antigravity in a neutral local desktop orchestrator with role-based handoffs.
```

---

## 7. Cursor

Cursor is a strong AI IDE with agent workflows and worktrees.

Cursor’s pricing page says every plan includes a set amount of model usage, and on-demand usage continues after included usage is consumed and is billed in arrears. Cursor also recommends Pro+ for daily agent users and Ultra for power users.

Source: [Cursor Pricing](https://cursor.com/pricing)

Cursor has worktree support for isolated agents.

Source: [Cursor Worktrees Docs](https://cursor.com/docs/configuration/worktrees)

Cursor also supports bring-your-own API keys for model providers such as OpenAI, Anthropic, Google, Azure, and Bedrock.

Source: [Cursor BYOK Docs](https://cursor.com/help/models-and-usage/api-keys)

## 7.1 Pros versus Zed

```text
- mature AI IDE
- strong UX
- worktree support
- built-in agent workflows
- cloud agents
- model access through Cursor
- good VS Code-style ecosystem
```

## 7.2 Cons versus Zed for this specific user

The key issue is economic.

Cursor’s model is primarily:

```text
Cursor usage pool / on-demand usage
or
BYOK API billing
```

That is not the same as:

```text
Codex via ChatGPT Pro entitlement
Claude Code via Claude Pro/Max entitlement
Gemini/Antigravity via Google entitlement
```

A user can run Codex CLI or Claude Code inside Cursor’s terminal, but that is not the same as Cursor’s own agent system preserving first-party CLI subscription entitlements as integrated external agent threads.

Cursor is excellent if the user wants Cursor to be the AI IDE and is willing to pay Cursor’s usage system. It is weaker if the user already has ChatGPT Pro and wants to preserve Codex usage directly.

## 7.3 Verdict

```text
Cursor partially serves the desired workflow,
but its billing model is the major mismatch.

For this user, Cursor risks duplicating spend:
ChatGPT Pro + Claude Pro + Cursor Pro+/Ultra or API overages.
```

---

## 8. Warp / Oz

Warp is a terminal-first agentic development environment.

Warp’s docs say third-party CLI agents such as Claude Code, Codex, and OpenCode can be run with Warp’s agent toolbelt, rich input, code review, notifications, and more.

Source: [Warp Docs](https://docs.warp.dev/)

Warp’s credit docs say any interaction with Warp’s Agent consumes credits, and credit usage varies by codebase size, task complexity, model, context, tool use, and more.

Source: [Warp Credits and Billing](https://docs.warp.dev/support-and-community/plans-and-billing/credits/)

Warp’s pricing page also describes agent usage as credit-based.

Source: [Warp Pricing](https://www.warp.dev/pricing)

A Warp GitHub issue requested “Local Claude subscription” and “Local Codex subscription” options in the `/agent` model picker so prompts could run through locally installed `claude` or `codex` binaries using the user’s existing subscriptions, without Warp credits being consumed.

Source: [Warp issue: Local Claude / Local Codex subscription options](https://github.com/warpdotdev/warp/issues/9609)

That issue is strong evidence that users care about the exact subscription-preservation concern.

## 8.1 Pros versus Zed

```text
- strong terminal-first workflow
- supports CLI agents
- good for people who live in the shell
- code review and notifications around agents
- Oz is moving toward cloud/control-plane orchestration
```

## 8.2 Cons versus Zed

```text
- terminal-first rather than editor-first
- Warp Agent uses credit-based billing
- not as natural as a Parallel Code fork for code/symbol/diff/desktop workflows
- users have explicitly requested better local subscription preservation for Claude/Codex agent use
```

## 8.3 Verdict

```text
Warp is relevant and strong, but not ideal for the exact architecture.

It is best if the terminal is the center.
Zed is better if the editor/diff/code-review cockpit is the center.
```

---

## 9. Google Antigravity

Google Antigravity is a strong agent-first environment.

Google says Antigravity lets agents autonomously plan, execute, and verify complex tasks across editor, terminal, and browser.

Source: [Google Developers Blog: Antigravity](https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/)

Antigravity documentation describes artifacts such as task lists, screenshots, browser recordings, test reports, and code diffs.

Source: [Google Antigravity Documentation](https://antigravity.im/documentation)

The Verge reported that Antigravity has Editor and Manager views, supports multiple agents with access to editor, terminal, and browser, and produces artifacts such as task lists, plans, screenshots, and browser recordings.

Source: [The Verge: Google Antigravity](https://www.theverge.com/news/822833/google-antigravity-ide-coding-agent-gemini-3-pro)

## 9.1 Pros versus Zed

```text
- probably stronger than Zed today for browser/UI/visual agent workflows
- Manager view is closer to a real multi-agent control surface
- artifacts are first-class
- browser recordings and screenshots are useful for UI tasks
```

## 9.2 Cons versus Zed

```text
- Google-centric
- not primarily designed to preserve ChatGPT Pro Codex usage
- not primarily designed to preserve Claude Pro/Claude Code usage
- browser/terminal autonomy raises security risk
- not the same as a neutral ACP cockpit
```

Security reporting has raised concerns about agent autonomy and prompt-injection/command-execution risk in Antigravity-like workflows.

Source: [TechRadar: Antigravity security concerns](https://www.techradar.com/pro/googles-ai-powered-antigravity-ide-already-has-some-worrying-security-issues)

## 9.3 Verdict

```text
Antigravity is strong for the Gemini/UI/browser side.

It is not the neutral three-provider subscription-preserving architecture you want.
```

---

## 10. Claude Agent Teams / Agent View

Claude Code itself has sophisticated multi-agent features.

Anthropic’s docs list several approaches:

```text
- Agent view
- subagents
- agent teams
- dynamic workflows
- worktrees
- /batch
```

Anthropic’s docs also say all workers in those approaches are Claude sessions; to involve a different tool, it must be exposed to Claude as an MCP server.

Source: [Claude Code: Run agents in parallel](https://code.claude.com/docs/en/agents)

## 10.1 Pros versus Zed

```text
- strong planning/review/subagent system
- good for Claude-only workflows
- worktree integration
- dynamic workflows
- agent teams can coordinate internally
```

## 10.2 Cons versus Zed

```text
- Claude-only by default
- multi-provider orchestration requires external tools via MCP
- Claude Pro/Max limits are still the usage bottleneck
- not a neutral cross-company cockpit
```

## 10.3 Verdict

```text
Claude Code can orchestrate Claude workers well.
It does not solve the multi-provider Codex + Claude + Gemini problem by itself.
```

---

## 11. GitHub Agent HQ

GitHub Agent HQ is another signal that the market is heading toward multi-agent selection.

The Verge reported that GitHub added Claude and Codex AI coding agents into GitHub/Copilot, letting developers select agents for tasks, issues, or pull requests, with agents consuming premium requests.

Source: [The Verge: GitHub adds Claude and Codex AI coding agents](https://www.theverge.com/news/873665/github-claude-codex-ai-agents)

## 11.1 Pros versus Zed

```text
- native to GitHub issues/PRs
- multi-agent direction
- strong enterprise/platform fit
```

## 11.2 Cons versus Zed

```text
- Copilot subscription/premium request model
- less local-desktop
- not designed around preserving ChatGPT Pro Codex CLI usage or Claude Pro Claude Code usage
- more platform-centric than local cockpit-centric
```

## 11.3 Verdict

```text
GitHub Agent HQ validates the multi-agent direction.
It does not replace the need for a local Parallel Code-centered cockpit if the user wants first-party CLI/subscription preservation.
```

---

## 12. The API-vs-CLI/Subscription Usage Question

This is a central part of your hypothesis, and it is supported by official docs.

## 12.1 OpenAI Codex

OpenAI’s Codex authentication docs distinguish ChatGPT sign-in from API-key sign-in.

They state:

```text
API key usage is billed through the OpenAI Platform at standard API rates.
Features that rely on ChatGPT credits are only available when signed in with ChatGPT.
```

Source: [OpenAI Codex Authentication](https://developers.openai.com/codex/auth)

Zed’s Codex integration is important because Zed supports ChatGPT login for Codex, which allows use of the existing paid ChatGPT subscription.

Source: [Zed External Agents](https://zed.dev/docs/ai/external-agents)

Zed’s blog further says OpenAI models can run in Zed with the same usage the user gets in Codex directly.

Source: [Zed: Use Your ChatGPT Subscription in Zed](https://zed.dev/blog/chatgpt-subscription-in-zed)

Conclusion:

```text
Your suspicion is correct for OpenAI:
API key usage is not the same as ChatGPT/Codex subscription usage.
A tool that only supports OpenAI API keys does not preserve Codex subscription economics.
```

## 12.2 Claude Code

Anthropic’s support docs say Claude Code prioritizes environment-variable API keys over authenticated subscriptions. If `ANTHROPIC_API_KEY` is set, Claude Code uses API billing even if the user is logged into a Claude subscription.

Sources:

- [Claude Code API key environment variables](https://support.claude.com/en/articles/12304248-manage-api-key-environment-variables-in-claude-code)
- [Use Claude Code with Pro or Max](https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan)

Conclusion:

```text
Your suspicion is also correct for Claude:
API key auth can bypass subscription usage and create separate charges.
A good orchestrator should detect this.
```

## 12.3 Cursor

Cursor’s pricing page says plans include model usage, and on-demand usage continues after included usage is consumed and is billed in arrears.

Source: [Cursor Pricing](https://cursor.com/pricing)

Cursor’s BYOK docs say users can provide their own API keys for OpenAI, Anthropic, Google, Azure, or Bedrock.

Source: [Cursor BYOK Docs](https://cursor.com/help/models-and-usage/api-keys)

Conclusion:

```text
Cursor’s model is not the same as "use my ChatGPT Pro Codex allowance" or
"use my Claude Pro Claude Code allowance" inside the core Cursor agent system.
```

## 12.4 Parallel Code and Conductor

Parallel Code is more aligned with your preferred economics because it explicitly runs the CLI agents:

```text
Claude Code
Codex CLI
Gemini CLI
Copilot CLI
```

Sources:

- [Parallel Code](https://parallelcode.app/)
- [Parallel Code GitHub](https://github.com/johannesjo/parallel-code)

Conductor also presents itself as running parallel Codex + Claude Code agents in isolated workspaces.

Source: [Conductor](https://www.conductor.build/)

Conclusion:

```text
Parallel Code and Conductor are closer to preserving first-party CLI/subscription paths than Cursor-style API/BYOK usage.
```

---

## 13. What Is Actually Missing in the Market?

The missing product is not just:

```text
run many agents
```

That exists.

The missing product is closer to:

```text
desktop, subscription-preserving, role-aware, multi-provider orchestration
```

Detailed missing pieces:

```text
1. Role-aware routing
   Claude plans/reviews, Codex implements, Gemini/Antigravity verifies UI.

2. Structured handoffs
   plan.md → diff.patch → test_report.json → ui_review.md → blocking_review.md.

3. Auth/billing inspector
   detect when OpenAI/Anthropic API keys would override subscription usage.

4. Worktree automation
   create, name, isolate, and clean up worktrees automatically.

5. Editor-native review
   diffs, diagnostics, symbols, tests, and agent threads in the same editor.

6. Agent-to-agent messaging
   send Claude’s plan directly to Codex; send Codex’s diff directly to Claude.

7. Human gates
   approve plan, approve package install, approve migrations, approve merge.

8. Budget-aware routing
   use Codex heavily; use Claude selectively; use Gemini/Antigravity where entitlement is cheap.

9. UI/browser artifact handling
   screenshots, browser recordings, responsive checks, visual review.

10. Cross-provider neutrality
   not locked into one model vendor or one paid usage pool.
```

Parallel Code and Conductor cover part of this. Cursor and Warp cover part of this. Antigravity covers part of this. Zed covers part of this.

None fully cover the complete target.

---

## 14. Consensus Grade

## 14.1 Strong consensus / strong pattern

```text
Git worktrees are the right isolation mechanism for parallel agents.
```

Evidence:

```text
- Claude Code official docs recommend worktrees for parallel sessions.
- HN users describe multi-worktree workflows.
- Reddit users describe worktrees as the thing that prevents agent conflicts.
- Products like Parallel Code, Cursor, Conductor, and Claude Agent View use or promote worktree/workspace isolation.
```

## 14.2 Moderate consensus / emerging pattern

```text
Planning, implementation, review, and testing should be separated.
```

Evidence:

```text
- HN workflows explicitly plan, approve, implement, test, review, and iterate.
- Reddit users describe planning first to separate worktrees by domain.
- Claude docs discuss different coordination modes and worker communication.
```

## 14.3 Moderate consensus / market signal

```text
Developers want multiple agents from different providers.
```

Evidence:

```text
- Zed supports Codex, Claude Agent, Gemini CLI, and other agents through ACP.
- Parallel Code supports Claude Code, Codex CLI, Gemini CLI, and Copilot CLI.
- GitHub Agent HQ adds Claude and Codex into GitHub/Copilot.
- Warp supports third-party CLI agents such as Claude Code and Codex.
```

## 14.4 Weak-to-moderate consensus

```text
Claude should plan, Codex should implement, Gemini should handle UI.
```

This is a good default, but not universal consensus.

A more defensible formulation:

```text
Codex is a strong default implementer, especially if the user already has ChatGPT Pro.
Claude is a strong default planner/reviewer, especially for architecture and critique.
Gemini/Antigravity is a strong default UI/browser/visual workflow surface.
```

## 14.5 Not yet consensus

```text
A Parallel Code fork is the ideal implementation.
```

Zed is a strong candidate because of ACP, external agents, ChatGPT subscription support, and desktop architecture. But Parallel Code and Conductor show that standalone orchestration apps are also viable.

---

## 15. Product Fit Ranking for This User

## 15.1 Best current off-the-shelf match

```text
Parallel Code
```

Reason:

```text
It directly supports Claude Code, Codex CLI, Gemini CLI, and Copilot CLI.
It uses worktrees.
It is open source.
It does not require a new model subscription.
```

Main weakness:

```text
It is not local desktop and not a full meta-orchestrator.
```

## 15.2 Best desktop substrate

```text
Zed
```

Reason:

```text
It supports ACP external agents.
It can run Codex, Claude Agent, and Gemini CLI in the agent panel.
It can preserve provider-native billing/auth.
It supports parallel threads.
It is already an editor.
```

Main weakness:

```text
It lacks the conductor layer.
```

## 15.3 Best polished commercial AI IDE

```text
Cursor
```

Reason:

```text
Strong integrated AI IDE and agent UX.
Worktrees and agents are real.
```

Main weakness:

```text
It does not cleanly preserve ChatGPT Pro Codex and Claude Pro Claude Code subscription economics inside its core agent system.
It is its own usage/billing platform.
```

## 15.4 Best terminal-first workflow

```text
Warp / Oz
```

Reason:

```text
Strong terminal + agent management direction.
Good if the terminal is the cockpit.
```

Main weakness:

```text
Credit economics and terminal-first design are less aligned with a Parallel Code-based desktop cockpit.
```

## 15.5 Best UI/browser/visual platform

```text
Google Antigravity
```

Reason:

```text
Browser, screenshots, recordings, artifacts, and agent manager are first-class.
```

Main weakness:

```text
Google-centric; not the neutral Codex + Claude + Gemini subscription-preserving cockpit.
```

---

## 16. Implications for the Future Editor-Native Path

The online research suggests the Parallel Code fork should not try to prove that multi-agent coding is useful from scratch. That is already happening.

Instead, it should target the unsolved gap:

```text
Make a Parallel Code/Electron app the local cockpit for multi-provider, subscription-preserving agent orchestration.
```

The fork should implement:

```text
1. Conductor Thread
   A new agent thread type that controls workflows rather than coding directly.

2. Role Registry
   planner = Claude
   implementer = Codex
   ui_verifier = Gemini/Antigravity
   reviewer = Claude

3. Handoff System
   send PlanArtifact to Codex
   send DiffArtifact to Claude
   send UiReviewArtifact to Codex
   send ReviewArtifact back to Codex

4. Worktree Manager
   automatic branch/worktree creation per writable task.

5. Auth Inspector
   warn if OPENAI_API_KEY, CODEX_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY,
   or GOOGLE_AI_API_KEY would switch the user into API billing.

6. Permission Gates
   protected files, package installs, migrations, commits, pushes.

7. Artifact Tabs
   Plan | Diff | Tests | Screenshots | Browser Recording | Review | Risks | Final Summary

8. Human Approval
   no merge or push without explicit user approval.
```

---

## 17. Final Answer

Your reasoning is broadly aligned with where agent-using developers are going.

The strongest online consensus is:

```text
parallel agents need worktree isolation
planning and review loops matter
handoffs are currently painful
subscription/API economics matter
```

There are already products that partially serve the need:

```text
Parallel Code:
  closest to your subscription-preserving CLI-agent/worktree idea

Conductor:
  close for Mac users running Codex + Claude

Cursor:
  strong AI IDE, but billing model is less aligned with your first-party subscription strategy

Warp/Oz:
  strong terminal-first control plane, but credit economics and terminal-first workflow are drawbacks

Antigravity:
  strong UI/browser/artifact environment, but Google-centric

Zed:
  best desktop substrate, but missing the conductor layer
```

The most defensible conclusion:

```text
A product category already exists.

But the exact product you want does not appear to exist yet:
a local desktop, ACP-based, multi-provider, subscription-preserving conductor
that routes Claude, Codex, and Gemini/Antigravity by role
with structured handoffs, worktrees, artifacts, permissions, and human gates.
```

That remains a credible product gap.




---

# Appendix: zed_meta_orchestrator_rationale.md — SUPPORTING CONTEXT

```text
File path: /mnt/data/zed_meta_orchestrator_rationale.md
Size: 18718 bytes
```

# Rationale for a Zed-Based Meta-Orchestrator

## Executive Summary

The reason for proposing a Parallel Code fork with a meta-orchestrator is straightforward: the current AI coding tool market gives strong individual agents, but weak cross-agent coordination.

The desired workflow is not simply “use more AI models.” The desired workflow is:

```text
Use Codex where Codex is economically and technically strongest.
Use Claude where Claude is most useful for planning, review, and reasoning.
Use Gemini or Antigravity where the UI/browser/visual workflow is strongest.
Use Parallel Code with Agent Conductor as the neutral cockpit.
Use Git worktrees as the safety and isolation layer.
Keep the human as the final approval authority.
```

The architecture exists because no current tool cleanly satisfies all of these constraints at once:

```text
- moderate-to-heavy coding usage
- preservation of ChatGPT Pro / Codex entitlement
- optional Claude Pro / Claude Code usage
- exploitation of Gemini student access
- agentic workflow across multiple providers
- model specialization by task type
- safe parallel execution
- no dependency on a weak pooled-credit aggregator
- no forced migration into one vendor’s IDE ecosystem
```

A Parallel Code-based implementation is attractive because Zed already has a useful foundation: desktop development, external-agent support, ACP integration, and parallel agent threads. What it lacks is the meta-orchestration layer that routes work between agents, manages context, enforces roles, creates worktrees, captures artifacts, and coordinates handoffs.

---

## 1. Starting Problem

The initial problem was not “which AI coding app is best?”

The real problem was:

```text
How do I build an agentic coding workflow that uses Codex, Claude, and Gemini together without overpaying or wasting usage limits?
```

The user already had or expected access to:

```text
- ChatGPT Pro / Codex
- possible Claude Pro / Claude Code
- Gemini Pro or Google student access
```

The user also wanted moderate-to-heavy coding usage, not light usage.

That rules out many simple answers.

A one-price aggregator sounds attractive, but it usually fails on one or more of these points:

```text
- limited credits
- unclear usage economics
- weaker access than first-party apps
- no Codex CLI entitlement
- no Claude Code entitlement
- delayed support for provider-specific features
- insufficient allowance for serious agentic coding
```

The architectural question therefore became:

```text
Can we keep each first-party agent where it is strongest, while adding a common orchestration layer above them?
```

---

## 2. Why Not Just Use Warp?

Warp was considered because it presents itself as a terminal-first agentic development environment.

Warp is useful if the user wants:

```text
- a terminal-centric AI workflow
- multiple agents accessible from one shell-oriented surface
- cloud agents
- agent sessions managed around terminal activity
```

However, the concern was usage economics.

Warp’s paid plans provide a credit bucket. For light or moderate exploratory usage, that can be useful. But the user explicitly needed moderate-to-heavy coding usage. That makes credit burn a central concern.

The problem with Warp for this user is not that Warp is bad. The problem is that Warp becomes less compelling if the user already has strong first-party entitlements:

```text
ChatGPT Pro already gives Codex capacity.
Claude Pro would give Claude Code capacity.
Gemini student access gives Google-side capacity.
```

Paying Warp as another AI usage layer risks duplicating spend.

The conclusion:

```text
Warp can be useful as a terminal/workbench.
Warp should not be the primary AI budget for this workflow.
```

This is why the architecture moved away from Warp as the center.

---

## 3. Why Not Just Use Cursor?

Cursor was considered because it is one of the strongest AI-first coding IDEs.

Cursor is valuable if the user wants:

```text
- polished AI IDE UX
- VS Code-like environment
- agent mode
- inline edits
- tab completion
- browser tools
- cloud agents
- a commercially mature product
```

However, Cursor is primarily its own AI IDE and usage platform.

For this user, that creates a mismatch:

```text
The user already has ChatGPT Pro.
The user may buy Claude Pro.
The user has Gemini student access.
Cursor adds another AI subscription or BYOK API layer.
```

The issue is not capability. The issue is economic duplication.

Cursor is better if the user wants Cursor to be the main AI coding subscription. It is less ideal if the user wants to preserve first-party usage paths:

```text
Codex through ChatGPT Pro
Claude Code through Claude Pro
Gemini / Antigravity through Google access
```

The conclusion:

```text
Cursor is strong as an all-in-one AI IDE.
Cursor is less optimal as a neutral multi-provider cockpit for existing first-party subscriptions.
```

---

## 4. Why Zed Is a Better Starting Point

Zed became the preferred base because it is closer to a neutral editor cockpit.

The important Zed properties are:

```text
- external-agent support
- ACP-based integrations
- Codex support
- Claude Agent / Claude Code support
- Gemini CLI support
- fast native editor
- parallel agent threads
- lower pressure to use Zed-hosted AI billing
```

The key difference:

```text
Cursor wants to be the AI IDE.
Warp wants to be the agentic terminal.
Zed can plausibly become the neutral agent cockpit.
```

This matters because the user’s ideal setup is not one vendor’s agent. It is:

```text
Codex + Claude + Gemini
each through its own best access path
coordinated in one development surface
```

Zed is not yet a full meta-orchestrator. But it is a credible substrate for one.

---

## 5. Why First-Party Entitlements Matter

The user’s economic situation strongly shapes the architecture.

With ChatGPT Pro already purchased, the rational move is to extract maximum value from Codex rather than pay another product to access similar OpenAI models through a weaker usage bucket.

The likely subscription logic is:

```text
ChatGPT Pro:
  main heavy coding capacity through Codex

Claude Pro:
  targeted planning, architecture, review, difficult reasoning

Gemini / Antigravity student access:
  UI, visual design, frontend variants, browser verification
```

This subscription split is more efficient than paying for a general aggregator because it keeps heavy usage on the provider that already includes it.

The orchestrator must therefore be designed around **native auth preservation**:

```text
Codex thread      → ChatGPT/Codex auth
Claude thread     → Claude Code / Claude Pro auth
Gemini thread     → Google/Gemini/Antigravity auth
Zed               → orchestration, not billing
```

If the orchestrator proxies model calls through its own account or API keys, it destroys the main economic advantage.

---

## 6. Why Agent Specialization Makes Sense

The role split discussed was:

```text
Codex = implementation
Claude = planning / architecture / review
Gemini = UI / visual / frontend exploration
```

This should not be treated as a rigid law. It is a practical routing default.

The reason it makes sense:

```text
Codex is already available through ChatGPT Pro and is designed for coding-agent workflows.
Claude is often valuable for higher-level reasoning, review, planning, and refactor design.
Gemini / Antigravity is especially useful where browser, UI, and visual feedback loops matter.
```

The workflow should therefore avoid having every model do the same work.

Bad workflow:

```text
Ask Claude, Codex, and Gemini all to implement the same feature.
Compare three messy branches.
Manually merge whatever looks best.
Waste usage limits.
```

Better workflow:

```text
Claude creates the plan.
Codex implements the plan.
Gemini verifies or improves the UI.
Claude reviews the diff.
Codex fixes accepted blockers.
Human approves.
```

That is the rationale for role-based orchestration.

---

## 7. Why Manual Multi-Agent Use Is Not Enough

Without orchestration, the user has to manually copy information between agents:

```text
Claude plan → copy into Codex
Codex diff → copy into Claude
Gemini UI notes → copy into Codex
Claude review → copy into Codex
Codex final summary → manually inspect
```

This is usable, but inefficient.

The more serious problems are:

```text
- agents lose context between handoffs
- task state lives in chat transcripts
- review artifacts are unstructured
- test results are not automatically routed
- agents may edit the same files
- no central workflow state exists
- the human has to act as message bus and project manager
```

A meta-orchestrator solves this by becoming the message bus and workflow state machine.

It should manage:

```text
- task decomposition
- agent selection
- context packaging
- thread creation
- worktree creation
- permissions
- artifacts
- test gates
- review gates
- final human approval
```

---

## 8. Why Worktrees Are Central

Git worktrees are the safety layer.

Agentic workflows become dangerous when multiple agents edit the same branch or same files without coordination.

The required operating principle is:

```text
One branch, one writable agent, one task.
```

Worktrees allow parallelism without chaos:

```text
main
  ├── worktree-codex-feature
  ├── worktree-gemini-ui
  └── worktree-claude-review
```

The orchestrator should create and manage these automatically.

Default policy:

```text
Codex gets writable implementation worktrees.
Claude planning/review threads are read-only by default.
Gemini or Antigravity gets UI-specific worktrees or browser-verification access.
No two writable agents should touch the same files without approval.
```

This makes multi-agent coding practical rather than messy.

---

## 9. Why Context Packs Are Needed

Each model should receive only the context required for its role.

Dumping the entire repository into every agent is wasteful and often counterproductive.

A planner needs:

```text
- task spec
- architecture docs
- AGENTS.md
- relevant files
- constraints
```

An implementer needs:

```text
- approved plan
- exact files
- coding rules
- test commands
```

A reviewer needs:

```text
- task spec
- plan
- diff
- test results
- risk notes
```

A UI agent needs:

```text
- component files
- design system docs
- screenshots
- browser verification target
```

The orchestrator should construct role-specific context packs.

This reduces:

```text
- token waste
- repeated repo discovery
- hallucinated assumptions
- context drift
- accidental scope expansion
```

---

## 10. Why a Workflow DSL Is Useful

The user’s desired process is repeatable.

Examples:

```text
Plan → Implement → Review → Fix
UI Build → Browser Verify → Review → Fix
Bug Hunt → Patch → Test → Review
Refactor Plan → Slice Implementation → Review Each Slice
```

A workflow DSL makes these repeatable without manually prompting every step.

Example mental model:

```yaml
steps:
  - Claude plans
  - Codex implements
  - Gemini verifies UI if relevant
  - Claude reviews
  - Codex fixes
  - Human approves
```

The DSL is useful because it separates:

```text
what the workflow is
from which model currently handles each role
```

That allows the user to change routing later:

```text
planner = Claude
implementer = Codex
ui_designer = Antigravity
reviewer = Claude
```

or:

```text
planner = Codex
implementer = Codex
reviewer = Claude
```

depending on usage limits and task type.

---

## 11. Why a Human Gate Is Non-Negotiable

The goal is agentic development, not autonomous uncontrolled development.

The orchestrator should never silently merge or push.

Human approval should be required before:

```text
- accepting high-impact architecture changes
- writing protected files
- installing packages
- changing migrations
- deleting files
- committing
- merging
- pushing
- touching secrets
- running destructive commands
```

The human remains:

```text
- product owner
- engineering lead
- final reviewer
- merge authority
```

This is especially important because model agents can be persuasive while still wrong.

---

## 12. Why a Permission Model Is Required

Multi-agent coding tools have more attack surface than ordinary autocomplete.

Agents can:

```text
- edit files
- run terminal commands
- install packages
- access browser contexts
- read local files
- trigger network requests
- modify project configuration
```

The orchestrator should classify permissions:

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

Default behavior should be conservative:

```text
Claude review mode:
  read-only unless explicitly allowed

Codex implementation mode:
  file writes allowed for task files
  terminal safe commands allowed
  package install requires approval
  git push denied

Gemini / Antigravity UI mode:
  browser allowed for localhost
  network allowlisted
  backend changes require approval
```

This keeps the workflow powerful but bounded.

---

## 13. Why Artifacts Matter

Agent chat transcripts are not enough.

A serious workflow needs structured artifacts:

```text
- plan
- accepted plan
- diff
- patch
- test report
- screenshot
- browser trace
- review
- risk log
- decision record
- final PR summary
```

Artifacts make the workflow auditable.

They also make handoffs cleaner:

```text
Codex does not need the whole Claude transcript.
Codex needs the accepted plan artifact.

Claude does not need Codex’s whole conversation.
Claude needs the diff, test report, and task spec.

Gemini does not need the whole backend context.
Gemini needs UI files, screenshots, and the local route to verify.
```

This is a core reason to build orchestration rather than just run multiple chats.

---

## 14. Why Budget-Aware Routing Matters

The user explicitly cares about usage limits and value per dollar.

The orchestrator should encode the preferred budget logic:

```text
Use Codex heavily because ChatGPT Pro is already paid for.
Use Claude Pro selectively for planning and review.
Use Gemini/Antigravity aggressively for UI while student access exists.
Avoid paid aggregator credits unless they clearly add workflow value.
```

This means the router should not blindly send every task to Claude or run three models for every issue.

Example routing:

```text
Simple bug:
  Codex only

Security-sensitive auth change:
  Claude plan → Codex implement → Claude review

Frontend dashboard:
  Codex implement → Gemini/Antigravity visual verify → Claude review if complex

Large refactor:
  Claude plan → Codex slice implementation → Claude review per slice
```

This preserves both quality and usage.

---

## 15. Why Zed Should Not Become Another Aggregator

The purpose of the fork is not to sell a model bundle.

The purpose is orchestration.

If the fork becomes a hosted AI billing layer, it competes with:

```text
ChatGPT
Claude
Gemini
Cursor
Warp
Poe
Kagi
OpenRouter
```

That is not the user’s need.

The user’s need is:

```text
I already have or can cheaply access the right agents.
I need them to work together properly.
```

Therefore the fork should avoid owning model billing wherever possible.

It should provide:

```text
- UX
- routing
- workflow state
- worktrees
- context packs
- permissions
- artifacts
- review gates
```

not:

```text
- bundled model credits
- opaque usage pools
- provider lock-in
```

---

## 16. Why This Should Be a Future Editor-Native Path Rather Than a Separate App

A separate orchestration app is possible, but a Parallel Code fork has advantages:

```text
- agents need editor context
- diffs need to be inspected in the editor
- worktrees need project awareness
- terminals need to sit near code
- artifacts should be tied to files and branches
- the user needs one cockpit, not another dashboard
```

Parallel Code is already desktop, so orchestration can be close to:

```text
- file tree
- symbols
- diagnostics
- terminal
- git status
- diffs
- agent threads
```

A separate app would likely become another layer that still needs to open the editor.

The Parallel Code fork can make orchestration feel native.

---

## 17. Why Not Wait for Someone Else?

Someone else may eventually build this.

However, most existing tools tend to fall into one of these categories:

```text
- one-vendor agent platform
- AI IDE with its own billing
- terminal wrapper
- general chat aggregator
- open-source multi-agent scripts
- model router without desktop workflow
```

The desired product is narrower and more specific:

```text
a neutral desktop multi-agent conductor
that preserves first-party subscriptions
and routes work by role
while using Git worktrees and human gates for safety
```

That exact combination is still not common.

---

## 18. Strategic Product Thesis

The proposed Parallel Code fork is based on this thesis:

```text
The next valuable coding interface is not one model inside an editor.
It is a workflow graph of specialized agents, each using its strongest native environment, coordinated inside the editor.
```

The current bottleneck is not raw model intelligence alone.

The bottleneck is coordination:

```text
- who plans
- who implements
- who reviews
- who verifies UI
- who fixes
- what context each receives
- what files each may touch
- when the human approves
```

A meta-orchestrator directly targets that bottleneck.

---

## 19. Final Rationale

The Parallel Code with Agent Conductor architecture exists because the user wants the benefits of multiple first-party AI coding agents without the waste of multiple uncoordinated workflows.

The reason behind the design is:

```text
1. ChatGPT Pro makes Codex the rational heavy implementation engine.
2. Claude Pro is valuable, but should be used selectively for planning and review.
3. Gemini/Antigravity is useful for UI and browser/visual workflows, especially with student access.
4. Warp and Cursor are useful, but can duplicate AI spend or impose their own usage systems.
5. Zed is a plausible neutral cockpit because it supports external agents and parallel threads.
6. Manual copy-paste between agents is inefficient and fragile.
7. Git worktrees provide the correct isolation model.
8. Context packs reduce waste and improve handoffs.
9. Artifacts make the workflow auditable.
10. Permission gates and human approval keep the system safe.
```

The desired product is therefore:

```text
Parallel Code with Agent Conductor as a neutral cockpit.
Codex as implementer.
Claude as planner and reviewer.
Gemini/Antigravity as UI and visual verifier.
Git as the source of truth.
The human as final merge authority.
```

That is the reason for building the meta-orchestrator.




---

# Appendix: zed_meta_orchestrator_architecture.md — SUPPORTING CONTEXT

```text
File path: /mnt/data/zed_meta_orchestrator_architecture.md
Size: 25769 bytes
```

# Parallel Code with Agent Conductor Architecture

## Purpose

This document drafts an architecture for a Parallel Code fork that adds a **meta-orchestrator** between heterogeneous coding agents such as Codex, Claude, and Gemini/Antigravity.

The goal is not to replace Codex, Claude Code, or Gemini. The goal is to add a thin orchestration layer above Zed’s existing agent/thread/worktree capabilities so that one user request can become a coordinated multi-agent workflow.

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
Codex ACP thread      → uses Codex / ChatGPT auth
Claude ACP thread     → uses Claude Code / Claude Pro auth
Gemini/AG thread      → uses Google / Gemini / Antigravity auth
Parallel Code fork              → does not proxy model calls
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

## 3. Existing Zed Substrate

Zed already has some of the right primitives:

```text
- ACP external agents
- independent agent threads
- parallel agent workflows
- worktree isolation
- thread sidebar / agent panel
- desktop diff review
```

Zed’s external-agent documentation currently describes support for external agents such as Gemini CLI, Claude Agent, Codex, GitHub Copilot, and configurable agents through ACP. Zed also states that billing and legal terms for external agents remain between the user and the provider rather than Zed.

Relevant references:

- [Zed external agents documentation](https://zed.dev/docs/ai/external-agents)
- [Zed parallel agents documentation](https://zed.dev/docs/ai/parallel-agents)
- [Zed blog: Parallel Agents](https://zed.dev/blog/parallel-agents)
- [Agent Client Protocol GitHub repository](https://github.com/agentclientprotocol/agent-client-protocol)
- [Zed source repository](https://github.com/zed-industries/zed)

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

## 4. New Crate: `agent_orchestrator`

Add a new top-level crate:

```text
electron/conductor/
```

Suggested module layout:

```text
electron/conductor/
  src/
    lib.rs
    orchestrator.rs
    router.rs
    planner.rs
    workflow.rs
    task_graph.rs
    agent_registry.rs
    thread_bridge.rs
    context_pack.rs
    worktree_manager.rs
    artifact_store.rs
    permissions.rs
    evaluators.rs
    budget.rs
    telemetry.rs
```

This crate should not implement Codex, Claude, or Gemini itself. It should call into Zed’s existing agent/thread infrastructure.

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

Possible Rust model:

```rust
enum AgentRole {
    Planner,
    Implementer,
    UiDesigner,
    Reviewer,
    Tester,
    Fixer,
    Explainer,
}

struct AgentCapabilityProfile {
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
    condition: "review.blocking_issues > 0"
    prompt: |
      Fix only the accepted blocking issues.
      Re-run checks.
    outputs:
      - final_diff
      - final_test_report

  - id: human_gate
    type: approval
    prompt: "Approve final diff for merge?"
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

Possible Rust structures:

```rust
struct TaskGraph {
    nodes: Vec<TaskNode>,
    edges: Vec<TaskEdge>,
}

struct TaskNode {
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
enum TaskStatus {
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
trait ThreadBridge {
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

The orchestrator should not dump the entire repo into every agent. It should construct **context packs** according to role.

Possible structure:

```rust
struct ContextPack {
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
enum WorktreePolicy {
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
struct FileLease {
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
struct BudgetPolicy {
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
enum GoogleAgentBackend {
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
enum ArtifactKind {
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
trait Evaluator {
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
enum OrchestratorEvent {
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

## 21. MVP Implementation Plan

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

Zed’s source repository is primarily GPL-3.0-or-later, with Apache-2.0 components where marked. A distributed fork must respect those licensing obligations.

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

# Appendix: role-aware-conductor-feature.md — SUPERSEDED / HISTORICAL

```text
File path: /mnt/data/role-aware-conductor-feature.md
Size: 31515 bytes
```

# Feature Specification: Role-Aware Conductor

**Feature name:** Role-Aware Conductor
**Suggested file name:** `role-aware-conductor-feature.md`
**Project context:** `local-agent-conductor` or standalone Electron conductor app
**Feature type:** Role-aware multi-agent orchestration for coding agents
**Status:** Expanded feature specification
**Date:** 2026-06-01

---

## 1. Feature Summary

The **Role-Aware Conductor** is a multi-agent orchestration feature for coding workflows.

It differs from a normal parallel-agent manager because the user does **not** manually pick one agent for each task. Instead, the user describes what needs to be built, and the application determines:

```text
1. what type of task this is,
2. which workflow should run,
3. which role is needed at each step,
4. which configured agent owns each role,
5. which CLI/process should be started,
6. which worktree or workspace should be used,
7. what artifact should be passed to the next role,
8. which approval gates are required.
```

The user configures role assignments once in settings.

Example default:

```text
Lead Conductor    → Claude
Planner           → Claude
Architect         → Claude
Implementer       → Codex
Fixer             → Codex
Reviewer          → Claude
Security Reviewer → Claude
UI Designer       → Gemini / Antigravity
UI Verifier       → Gemini / Antigravity
Test Runner       → Codex
```

Then the user can simply say:

```text
Build a responsive onboarding flow.
```

The app decides:

```text
This is a UI feature.
Use the ui-build-verify workflow.
Ask Claude to plan.
Ask Codex to implement.
Ask Gemini/Antigravity to verify visually.
Ask Claude to review.
Ask Codex to fix accepted issues.
Ask the human before merge.
```

The core workflow is:

```text
User describes goal.
Conductor classifies task.
Conductor chooses workflow.
Conductor dispatches specialized agents.
Agents produce structured artifacts.
Conductor passes artifacts between roles.
Human approves high-impact steps.
```

---

## 2. Difference Versus Parallel Code

Parallel Code’s flow is roughly:

```text
1. Create a task.
2. Pick which AI agent to use.
3. Agent works in isolation.
4. Review and merge.
```

That is useful, but the user is still responsible for choosing the agent.

The Role-Aware Conductor’s flow is different:

```text
1. Create a task.
2. The app determines the correct workflow and roles.
3. The app dispatches the right configured agent for each role.
4. Each agent works in isolation or read-only mode according to policy.
5. The app passes structured artifacts between agents.
6. The app shows the whole workflow state.
7. The user reviews and approves.
```

The key distinction:

```text
Parallel Code:
  "Pick an agent, then run the task."

Role-Aware Conductor:
  "Describe the task; the conductor decides which role-agent sequence should handle it."
```

Parallel Code is a parallel-agent worktree manager.

The Role-Aware Conductor is a role-aware workflow controller.

---

## 3. Core Product Principle

The feature should be built around this principle:

```text
The user should configure agent roles once,
then describe tasks naturally,
and the app should dispatch the correct agents automatically.
```

This means the UI should not force the user to choose between Claude, Codex, and Gemini every time.

Instead, the user should configure a profile:

```text
Profile: Ameen’s Default

Lead Conductor: Claude
Planner: Claude
Implementer: Codex
Reviewer: Claude
UI Designer: Gemini / Antigravity
Fixer: Codex
```

Then the app should use that profile for all future tasks unless the user overrides it.

---

## 4. The “Top Guy”: Lead Conductor Role

The system needs a top-level coordinator.

This role is called:

```text
Lead Conductor
```

The Lead Conductor is responsible for task interpretation and workflow supervision.

It decides:

```text
- whether the task is backend, frontend, UI, bug fix, refactor, security, docs, or mixed
- whether planning is required
- whether UI verification is required
- whether security review is required
- whether the task is small enough for one agent
- whether work should be split into multiple subtasks
- which workflow template should run
- which role should receive each step
- when to ask the user for approval
```

Default options for Lead Conductor:

```text
Claude
Codex
Gemini / Antigravity
Local Rules Engine
Hybrid: Local Rules Engine + Claude fallback
Manual
```

Recommended default:

```text
Hybrid: Local Rules Engine + Claude fallback
```

Reason:

```text
The Local Rules Engine can cheaply classify common tasks.
Claude can be used only when the task is ambiguous, architectural, high-risk, or complex.
```

However, since the user wants a clear “top guy,” the settings UI should allow a single visible owner:

```text
Lead Conductor: Claude
```

Internally, the system can still use deterministic rules first and ask Claude only when needed.

---

## 5. Role-Aware Conductor Settings

The settings UI should expose this as a first-class section.

Suggested settings hierarchy:

```text
Settings
  → Agent Workflows
    → Role-Aware Conductor
```

Alternative:

```text
Settings
  → Role-Aware Conductor
```

### 5.1 Settings overview

The Role-Aware Conductor settings page should show:

```text
Preset
Lead Conductor
Planner
Architect
Implementer
Fixer
Reviewer
Security Reviewer
UI Designer
UI Verifier
Test Runner
Documentation Writer
Fallback Agent
Routing Mode
Approval Mode
Auth Mode
Artifact Mode
Worktree Mode
```

Each role should be a line item.

Example:

```text
Role-Aware Conductor

Preset:              Ameen’s Default        [dropdown]

Lead Conductor:      Claude                 [dropdown]
Planner:             Claude                 [dropdown]
Architect:           Claude                 [dropdown]
Implementer:         Codex                  [dropdown]
Fixer:               Codex                  [dropdown]
Reviewer:            Claude                 [dropdown]
Security Reviewer:   Claude                 [dropdown]
UI Designer:         Gemini / Antigravity   [dropdown]
UI Verifier:         Gemini / Antigravity   [dropdown]
Test Runner:         Codex                  [dropdown]
Docs Writer:         Claude                 [dropdown]
Fallback Agent:      Codex                  [dropdown]

Routing Mode:        Auto                   [dropdown]
Approval Mode:       Safe                   [dropdown]
Worktree Mode:       Isolated per task      [dropdown]
Auth Preference:     First-party CLI login  [dropdown]
```

### 5.2 Dropdown values

Each role dropdown should list connected agents.

Example dropdown:

```text
Auto
Claude
Codex
Gemini
Antigravity
Copilot
DeepSeek
Local Model
None
```

The dropdown should only show agents that are installed or configured.

Unavailable agents should be shown disabled:

```text
Gemini CLI — not installed
Antigravity CLI — not found
Claude Code — login required
Codex CLI — ready
```

### 5.3 Presets

The user should be able to choose a preset.

Built-in presets:

```text
Ameen’s Default
Codex-Heavy
Claude-Heavy
UI-Heavy
Cost Saver
Manual Review
Local/Private
Custom
```

The app should ship with `Ameen’s Default` as the default profile for this project.

### 5.4 Ameen’s Default

Ameen’s Default should be:

```text
Lead Conductor:      Claude
Planner:             Claude
Architect:           Claude
Implementer:         Codex
Fixer:               Codex
Reviewer:            Claude
Security Reviewer:   Claude
UI Designer:         Gemini / Antigravity
UI Verifier:         Gemini / Antigravity
Test Runner:         Codex
Docs Writer:         Claude
Fallback Agent:      Codex
```

Routing behavior:

```text
Backend feature:
  Claude plans → Codex implements → Claude reviews → Codex fixes

UI feature:
  Claude plans → Codex implements → Gemini/Antigravity verifies UI → Claude reviews if needed → Codex fixes

Bug fix:
  Codex investigates and fixes → Claude reviews if risky

Security/auth/data change:
  Claude plans → Codex implements → Claude security-reviews → Codex fixes

Large refactor:
  Claude plans slices → Codex implements slices → Claude reviews each slice

Docs:
  Claude drafts → Codex checks code references if needed
```

### 5.5 Custom preset

A custom preset should be editable in the UI and backed by YAML.

The user should be able to:

```text
- duplicate Ameen’s Default
- rename the profile
- change role dropdowns
- change fallback order
- export YAML
- import YAML
- reset to default
```

---

## 6. YAML-Backed Configuration

The settings UI should write to a YAML file.

Recommended path:

```text
.parallel-code/conductor.yaml
```

This YAML file should be human-readable, versionable, and project-local.

The UI should be the normal editing surface, but the YAML should remain the source of truth.

Example:

```yaml
schema: agent-conductor/v1

active_profile: "Ameen's Default"

profiles:
  "Ameen's Default":
    description: "Default role-aware conductor profile: Claude plans/reviews, Codex implements/fixes, Gemini/Antigravity verifies UI."
    routing_mode: auto
    approval_mode: safe
    worktree_mode: isolated_per_task
    auth_preference: first_party_cli_subscription

    roles:
      lead_conductor:
        primary: claude
        fallback:
          - local_rules_engine
          - codex
        mode: coordinator
        purpose: "Classify tasks, select workflows, supervise handoffs."

      planner:
        primary: claude
        fallback:
          - codex
        mode: read_only
        purpose: "Planning, decomposition, acceptance criteria, risk analysis."

      architect:
        primary: claude
        fallback:
          - codex
        mode: read_only
        purpose: "Architecture, system design, refactor strategy."

      implementer:
        primary: codex
        fallback:
          - claude
        mode: writable
        purpose: "Code implementation, tests, bug fixes, PR preparation."

      fixer:
        primary: codex
        fallback:
          - claude
        mode: writable
        purpose: "Apply accepted fixes only."

      reviewer:
        primary: claude
        fallback:
          - codex
        mode: read_only
        purpose: "Code review, maintainability review, correctness review."

      security_reviewer:
        primary: claude
        fallback:
          - codex
        mode: read_only
        purpose: "Security, auth, data-flow, privacy, and permission review."

      ui_designer:
        primary: google_visual
        fallback:
          - claude
        mode: browser_or_read_only
        purpose: "UI design, layout, visual hierarchy, responsive design."

      ui_verifier:
        primary: google_visual
        fallback:
          - claude
        mode: browser_or_read_only
        purpose: "Browser verification, screenshots, UI acceptance."

      test_runner:
        primary: codex
        fallback:
          - claude
        mode: terminal_limited
        purpose: "Run tests, diagnose failures, suggest or apply fixes."

      docs_writer:
        primary: claude
        fallback:
          - codex
        mode: read_only_or_docs_only
        purpose: "Documentation, explanations, README updates."

agents:
  claude:
    display_name: "Claude Code"
    type: cli
    command: claude
    provider: anthropic
    adapter: claude-acp
    preferred_auth: claude_subscription
    disallow_api_by_default: true
    api_key_env:
      - ANTHROPIC_API_KEY

  codex:
    display_name: "Codex CLI"
    type: cli
    command: codex
    provider: openai
    adapter: codex-acp
    preferred_auth: chatgpt_subscription
    disallow_api_by_default: true
    api_key_env:
      - CODEX_API_KEY
      - OPENAI_API_KEY

  google_visual:
    display_name: "Gemini / Antigravity"
    type: cli
    provider: google
    adapter: google-visual
    backend_priority:
      - antigravity
      - gemini
    preferred_auth: google_account
    api_key_env:
      - GEMINI_API_KEY
      - GOOGLE_AI_API_KEY

routing:
  default_workflow: auto
  ask_before_ambiguous_dispatch: true
  classify_with:
    - local_rules_engine
    - lead_conductor
  confidence_threshold_for_auto_dispatch: 0.75

approval:
  before_first_write: true
  before_package_install: true
  before_database_migration: true
  before_delete: true
  before_commit: true
  before_merge: true
  before_push: true
  before_touching_protected_paths: true

worktrees:
  enabled: true
  strategy: isolated_per_task
  root: .worktrees
  naming: "{workflow}-{role}-{slug}-{timestamp}"

artifacts:
  root: .parallel-code/artifacts/runs
  write_markdown_summaries: true
  write_json_metadata: true
  keep_raw_agent_logs: true
```

---

## 7. Settings UI Behavior

The settings UI should be generated from the YAML config.

### 7.1 Basic settings page

The basic settings page should show the common controls:

```text
Preset
Lead Conductor
Planner
Implementer
Reviewer
UI Designer
UI Verifier
Fixer
Approval Mode
Worktree Mode
Auth Preference
```

### 7.2 Advanced settings page

The advanced settings page should show:

```text
Fallback order per role
Permission mode per role
Context pack per role
Artifact outputs per role
Agent command path
Auth detection behavior
Environment variable warnings
Protected paths
Workflow templates
Routing thresholds
```

### 7.3 YAML editor

There should be an escape hatch:

```text
Open YAML
```

The user should be able to directly edit:

```text
.parallel-code/conductor.yaml
```

When saved, the UI should reload the settings.

If the YAML is invalid, the UI should show:

```text
Invalid conductor.yaml
Line 42: expected role binding object
[Open file] [Restore last valid config] [Reset to default]
```

---

## 8. Automatic Dispatch Flow

The automatic dispatch flow is the central feature.

### 8.1 User submits task

The user writes:

```text
Build a responsive dashboard with course cards, progress, and deadline reminders.
```

The user does not pick an agent.

### 8.2 Conductor classifies task

The Conductor classifies it:

```yaml
task_classification:
  type: ui_feature
  complexity: medium
  requires_planning: true
  requires_ui_verification: true
  requires_security_review: false
  suggested_workflow: ui-build-verify
```

### 8.3 Conductor resolves roles

Using `Ameen’s Default`:

```text
Lead Conductor: Claude
Planner: Claude
Implementer: Codex
UI Verifier: Gemini / Antigravity
Reviewer: Claude
Fixer: Codex
```

### 8.4 Conductor creates execution plan

```text
1. Claude creates plan.
2. Human approves plan.
3. Codex implements in worktree.
4. Codex runs tests/checks.
5. Gemini/Antigravity verifies UI in browser.
6. Claude reviews code if change is non-trivial.
7. Codex fixes accepted issues.
8. Human approves final diff.
```

### 8.5 Conductor spins up agents

The app starts or connects to:

```text
Claude thread for planning
Codex thread for implementation
Gemini/Antigravity thread for UI verification
Claude thread for review
Codex thread for fixes
```

Each thread gets only the context it needs.

### 8.6 Conductor displays the run

The app shows:

```text
Conductor Run: Responsive dashboard

Workflow: ui-build-verify
Preset: Ameen’s Default

[✓] Classified as UI feature
[●] Claude planning
[ ] Human plan approval
[ ] Codex implementation
[ ] Test/check run
[ ] Gemini/Antigravity UI verification
[ ] Claude review
[ ] Codex fixes
[ ] Human final approval
```

---

## 9. Whole-View Run Dashboard

The app should have a whole-view list of active and historical runs.

### 9.1 Main dashboard

The main dashboard should show:

```text
All Conductor Runs

Status     Task                         Workflow              Agents
Running    Build onboarding flow         ui-build-verify       Claude → Codex → Antigravity → Claude
Blocked    Fix auth refresh bug          security-fix          Claude → Codex → Claude
Done       Add loading states            ui-build-verify       Claude → Codex → Gemini
Draft      Refactor payments module      refactor-safe         Claude → Codex → Claude
```

### 9.2 Per-run detail view

Each run detail should show:

```text
Task
Workflow
Preset
Role map
Worktree
Branch
Agent threads
Artifacts
Approvals
Diff
Tests
Warnings
Final summary
```

Example:

```text
Run: Build onboarding flow

Role Map:
  Lead: Claude
  Planner: Claude
  Implementer: Codex
  UI Verifier: Antigravity
  Reviewer: Claude
  Fixer: Codex

Artifacts:
  plan.md
  accepted-plan.md
  implementation.diff
  test-report.json
  ui-review.md
  screenshots/
  code-review.md
  final-summary.md

Actions:
  [Open Worktree in Editor]
  [Open Diff]
  [Send Back to Codex]
  [Ask Claude to Re-review]
  [Run Tests]
  [Approve Merge]
```

---

## 10. Workflow Templates

The conductor should use workflow templates.

### 10.1 Auto workflow selection

The user submits a task. The app chooses a workflow.

Example routing table:

```text
UI / frontend / visual task:
  ui-build-verify

Backend feature:
  plan-implement-review

Bug fix:
  bug-hunt

Auth/security/payment/data task:
  security-sensitive-change

Large refactor:
  refactor-safe

Docs:
  docs-update

Test generation:
  test-gap-analysis
```

### 10.2 Workflow template files

Workflow templates should be stored as YAML:

```text
.parallel-code/workflows/
  plan-implement-review.yaml
  ui-build-verify.yaml
  bug-hunt.yaml
  refactor-safe.yaml
  security-sensitive-change.yaml
  docs-update.yaml
  test-gap-analysis.yaml
```

### 10.3 Example: `ui-build-verify.yaml`

```yaml
schema: agent-conductor-workflow/v1
name: ui-build-verify
description: "Plan UI, implement with Codex, verify visually with Gemini/Antigravity, review if needed."

steps:
  - id: classify
    type: system
    action: classify_task

  - id: plan
    type: agent
    role: planner
    mode: read_only
    prompt: |
      Produce a concise UI implementation plan.
      Include:
      - files likely involved
      - component structure
      - responsive behavior
      - empty/loading/error states
      - acceptance criteria
      - test/check plan
    outputs:
      - plan
      - acceptance_criteria

  - id: approve_plan
    type: human_approval
    depends_on:
      - plan
    prompt: "Approve this UI plan?"

  - id: implement
    type: agent
    role: implementer
    mode: writable
    worktree: new
    depends_on:
      - approve_plan
    prompt: |
      Implement the approved UI plan.
      Do not change backend APIs unless explicitly approved.
      Run configured checks.
    outputs:
      - implementation_diff
      - test_report

  - id: visual_verify
    type: agent
    role: ui_verifier
    mode: browser_or_read_only
    depends_on:
      - implement
    prompt: |
      Verify the UI in browser.
      Check:
      - layout
      - visual hierarchy
      - responsiveness
      - accessibility basics
      - empty/loading/error states
      - design-system consistency
      Return screenshots and concrete fixes.
    outputs:
      - ui_review
      - screenshots
      - browser_recording

  - id: accept_visual_fixes
    type: human_approval
    depends_on:
      - visual_verify
    prompt: "Select which UI fixes to apply."

  - id: fix_visual_issues
    type: agent
    role: fixer
    mode: writable
    worktree: same_as:implement
    depends_on:
      - accept_visual_fixes
    prompt: |
      Apply only accepted UI fixes.
      Do not refactor unrelated code.
      Re-run checks.
    outputs:
      - final_diff
      - final_test_report

  - id: code_review
    type: agent
    role: reviewer
    mode: read_only
    depends_on:
      - fix_visual_issues
    condition: "change_size != small"
    prompt: |
      Review the final code for correctness and maintainability.
      Return blocking issues first.
    outputs:
      - code_review

  - id: final_approval
    type: human_approval
    depends_on:
      - fix_visual_issues
    prompt: "Approve final diff?"
```

---

## 11. Task Classifier

The Conductor needs a classifier.

The classifier should be deterministic first and LLM-assisted second.

### 11.1 Deterministic rules

Examples:

```yaml
classification_rules:
  ui_feature:
    keywords:
      - ui
      - layout
      - component
      - responsive
      - dashboard
      - page
      - form
      - modal
      - design
      - visual
    workflow: ui-build-verify

  security_sensitive:
    keywords:
      - auth
      - login
      - session
      - token
      - permission
      - payment
      - billing
      - encryption
      - secret
    workflow: security-sensitive-change

  bug_fix:
    keywords:
      - bug
      - fix
      - broken
      - failing
      - regression
      - crash
    workflow: bug-hunt

  refactor:
    keywords:
      - refactor
      - rewrite
      - clean up
      - modularize
      - architecture
    workflow: refactor-safe
```

### 11.2 Lead Conductor fallback

If deterministic classification confidence is low:

```text
Ask the Lead Conductor to classify the task.
```

Example prompt to Lead Conductor:

```text
Classify this development task.

Return:
- task_type
- complexity
- workflow
- required_roles
- whether planning is required
- whether UI verification is required
- whether security review is required
- whether human approval is required before implementation

Task:
<user task>
```

### 11.3 Dispatch confidence

The app should support:

```yaml
routing:
  confidence_threshold_for_auto_dispatch: 0.75
  ask_before_ambiguous_dispatch: true
```

If confidence is low:

```text
I think this is a UI feature using ui-build-verify.
Proceed?

[Proceed] [Change Workflow] [Manual Agent Selection]
```

---

## 12. Agent Spin-Up

The Conductor should spin up agents based on the workflow.

### 12.1 Agent states

Each agent can be:

```text
Not installed
Installed but not authenticated
Authenticated and ready
Running
Blocked
Failed
Completed
```

### 12.2 Spin-up behavior

Before launching a role step:

```text
1. Resolve role → agent.
2. Check agent installed.
3. Check auth preference.
4. Check API key override.
5. Create/select worktree.
6. Build context pack.
7. Start or reuse agent thread.
8. Send prompt.
9. Monitor output.
10. Capture artifacts.
```

### 12.3 Missing agent behavior

If the selected agent is missing:

```text
Claude Code is assigned to Planner but is not installed.

Options:
[Install instructions]
[Choose another planner]
[Use fallback: Codex]
[Cancel run]
```

### 12.4 Auth warning behavior

If API keys are detected while subscription mode is preferred:

```text
Codex may use API billing instead of ChatGPT subscription access because OPENAI_API_KEY is set.

Options:
[Unset for this run]
[Use API key once]
[Switch to ChatGPT login]
[Cancel]
```

---

## 13. Structured Artifacts

The Conductor should not pass raw chat logs between agents.

It should pass structured artifacts.

### 13.1 Artifact sequence

```text
PlanArtifact
  Claude → Codex

ImplementationArtifact
  Codex → Claude
  Codex → Gemini/Antigravity

UiReviewArtifact
  Gemini/Antigravity → Codex

CodeReviewArtifact
  Claude → Codex

FinalSummaryArtifact
  Codex/Conductor → Human
```

### 13.2 Artifact paths

```text
.parallel-code/artifacts/runs/<run-id>/
  run.json
  classification.json
  role-map.yaml
  plan.md
  accepted-plan.md
  implementation.diff
  test-report.json
  ui-review.md
  screenshots/
  browser-recording/
  code-review.md
  accepted-review-items.md
  final.diff
  final-test-report.json
  final-summary.md
```

### 13.3 Artifact viewer

The UI should show artifact tabs:

```text
Overview
Plan
Accepted Plan
Diff
Tests
UI Review
Screenshots
Browser Recording
Code Review
Final Summary
Raw Logs
```

---

## 14. Human Approval Gates

The Conductor should not be fully autonomous by default.

Approval gates:

```text
Approve plan
Approve first write
Approve protected path write
Approve package install
Approve database migration
Approve deletion
Approve visual fixes
Approve review fixes
Approve commit
Approve merge
Approve push
```

### 14.1 Approval mode presets

```text
Safe
Balanced
Fast
Manual
Custom
```

Recommended default:

```text
Safe
```

Safe mode:

```text
- approve plan
- approve first write
- approve protected operations
- approve review fixes
- approve commit
- approve merge
- deny push by default
```

Fast mode:

```text
- auto-approve non-protected file writes in worktree
- auto-run tests
- ask before package install, migration, commit, merge, push
```

---

## 15. Worktree Policy

The Conductor should create isolated worktrees automatically.

Default:

```text
one writable worktree per task
```

The role permissions:

```text
Lead Conductor:
  no direct writes

Planner:
  read-only

Architect:
  read-only

Implementer:
  writable worktree

Fixer:
  same writable worktree as implementer

Reviewer:
  read-only

Security Reviewer:
  read-only

UI Designer:
  browser/read-only by default

UI Verifier:
  browser/read-only by default

Test Runner:
  terminal-limited in implementation worktree
```

Example worktree layout:

```text
.worktrees/
  ui-build-verify-implementer-onboarding-flow-20260601/
  bug-hunt-implementer-login-redirect-20260601/
  refactor-safe-implementer-payment-module-20260601/
```

---

## 16. Whole-System View

The app should have a main conductor view.

### 16.1 Active run list

```text
Active Runs

Status     Task                         Workflow                  Agents
Running    Build onboarding flow         ui-build-verify           Claude → Codex → Antigravity → Claude
Blocked    Fix auth refresh bug          security-sensitive-change Claude → Codex → Claude
Waiting    Refactor payments module      refactor-safe             Claude → Codex → Claude
Done       Add dashboard loading states  ui-build-verify           Claude → Codex → Gemini
```

### 16.2 Agent inventory

```text
Connected Agents

Agent             Status        Auth Mode              Roles
Claude Code       Ready         Claude Pro/Max         Lead, Planner, Reviewer
Codex CLI         Ready         ChatGPT Subscription   Implementer, Fixer, Test Runner
Antigravity CLI   Ready         Google Account         UI Designer, UI Verifier
Gemini CLI        Installed     API Key detected       Fallback UI
Copilot CLI       Not configured None                  None
```

### 16.3 Role map view

```text
Current Profile: Ameen’s Default

Lead Conductor       Claude
Planner              Claude
Architect            Claude
Implementer          Codex
Fixer                Codex
Reviewer             Claude
Security Reviewer    Claude
UI Designer          Antigravity
UI Verifier          Antigravity
Test Runner          Codex
Docs Writer          Claude
Fallback Agent       Codex
```

---

## 17. Comparison to Manual Agent Selection

### 17.1 Manual mode

Manual mode:

```text
User chooses agent each time.
```

Useful for:

```text
- one-off tasks
- experiments
- comparing agents
- debugging the conductor
```

### 17.2 Role-aware mode

Role-aware mode:

```text
User describes task.
Conductor chooses workflow and role sequence.
Configured agents are dispatched automatically.
```

Useful for:

```text
- repeated development workflows
- serious coding sessions
- avoiding wrong-agent choices
- preserving usage discipline
- reducing cognitive overhead
```

### 17.3 Required UI toggle

The app should support:

```text
Task Mode:
  Manual Agent
  Role-Aware Conductor
```

Default:

```text
Role-Aware Conductor
```

---

## 18. Example End-to-End Run

User input:

```text
Build a responsive course dashboard with progress cards and deadline reminders.
```

### 18.1 Classification

```yaml
task_type: ui_feature
workflow: ui-build-verify
complexity: medium
requires_planning: true
requires_ui_verification: true
requires_code_review: true
requires_security_review: false
```

### 18.2 Role assignment

```yaml
lead_conductor: claude
planner: claude
implementer: codex
ui_verifier: google_visual
reviewer: claude
fixer: codex
```

### 18.3 Execution

```text
1. Claude produces plan.md.
2. Human approves plan.
3. Codex creates implementation.diff and test-report.json.
4. Antigravity produces ui-review.md and screenshots.
5. Human accepts selected UI fixes.
6. Codex applies accepted UI fixes.
7. Claude reviews final diff.
8. Human approves final summary and merge.
```

### 18.4 Output

```text
Artifacts:
  plan.md
  accepted-plan.md
  implementation.diff
  test-report.json
  ui-review.md
  screenshots/
  code-review.md
  final.diff
  final-summary.md
```

---

## 19. Acceptance Criteria

The feature is complete when:

```text
1. User can enable Role-Aware Conductor mode.
2. User can choose a preset such as Ameen’s Default.
3. User can assign each role through settings dropdowns.
4. Settings are persisted to YAML.
5. User can submit a task without manually selecting an agent.
6. App classifies the task.
7. App selects a workflow.
8. App resolves role assignments from the active profile.
9. App spins up the correct CLI agents.
10. App creates worktrees according to policy.
11. App passes structured artifacts between agents.
12. App shows the whole run state.
13. App warns if API keys may bypass first-party subscription auth.
14. App requires approval before protected operations.
15. App allows manual override when automatic routing is uncertain.
```

---

## 20. Implementation Phases

### Phase 1: Settings and YAML

```text
- Add Role-Aware Conductor settings page.
- Add preset dropdown.
- Add role dropdowns.
- Persist to `.parallel-code/conductor.yaml`.
- Load YAML on app start.
```

### Phase 2: Agent Inventory

```text
- Detect installed CLIs.
- Detect auth state where possible.
- Show connected agents.
- Show unavailable agents.
- Warn about API key overrides.
```

### Phase 3: Task Classification

```text
- Add deterministic classifier.
- Add optional Lead Conductor classification.
- Add confidence threshold.
- Add manual confirmation for ambiguous tasks.
```

### Phase 4: Workflow Dispatch

```text
- Map task class to workflow template.
- Resolve role assignments.
- Start agent threads/processes.
- Link them under one Conductor Run.
```

### Phase 5: Artifact Handoff

```text
- Define artifact schema.
- Write artifacts to run folder.
- Pass artifacts to next role.
- Add artifact viewer.
```

### Phase 6: Worktree Automation

```text
- Create worktree per writable run.
- Assign worktree to Codex implementer/fixer.
- Keep Claude planner/reviewer read-only.
- Support Open in Editor / Open in editor.
```

### Phase 7: Approval Gates

```text
- Add plan approval.
- Add protected operation approval.
- Add review item approval.
- Add final merge approval.
```

### Phase 8: Whole-View Dashboard

```text
- Add active run list.
- Add run details.
- Add role map view.
- Add agent inventory.
- Add run history.
```

---

## 21. Final Feature Definition

The Role-Aware Conductor is:

```text
A mode where the user describes what needs to be built,
the program determines which role workflow is needed,
the configured Lead Conductor and role map decide which agents to use,
the app spins up those agents through their CLIs,
each agent works in its assigned role,
structured artifacts move between roles,
worktrees isolate writable work,
and the human approves important transitions.
```

In one sentence:

```text
It turns "pick an agent and run a task" into "describe the task and let the configured role-aware conductor dispatch the right agents."
```

That is the core differentiator.




---

# Appendix: roadmap.md — SUPERSEDED / HISTORICAL

```text
File path: /mnt/data/roadmap.md
Size: 33247 bytes
```

# Roadmap: Role-Aware Conductor for Zed Agent Workflows

**Feature name:** Role-Aware Conductor
**Proposed repo/product name:** `local-agent-conductor`
**Canonical project file:** `.parallel-code/roadmap.md`
**Primary config file:** `.parallel-code/conductor.yaml`
**Status:** Feature specification / implementation roadmap
**Date:** 2026-06-01

---

## 0. Why This Feature Exists

Modern AI coding tools already have strong individual agents:

```text
Codex: strong implementation, testing, fixing, PR cleanup.
Claude: strong planning, architectural reasoning, review, risk analysis.
Gemini / Antigravity: strong UI, browser, screenshot, artifact, visual-verification workflow.
```

The missing layer is not another model. The missing layer is a **role-aware conductor** inside the editor cockpit.

The Role-Aware Conductor should let the user define which CLI or external agent should perform each role, then automatically run a workflow such as:

```text
Claude plans.
Codex implements.
Gemini / Antigravity verifies UI.
Claude reviews.
Codex fixes accepted blockers.
Human approves.
```

The point is to combine:

```text
- role routing
- structured handoff
- workflow policy
- artifact flow
- worktree isolation
- first-party CLI/subscription preservation
- desktop review
```

This should happen inside a Zed-like editor cockpit, not in a separate chat app.

---

## 1. Reality Check From Current Tooling

This feature is aligned with current reality.

### 1.1 Zed already has the right substrate

Zed supports external agents through the **Agent Client Protocol (ACP)**. Its current docs list support for Gemini CLI, Claude Agent, Codex, GitHub Copilot, and configurable external agents. Zed also states that external-agent billing, legal, and terms arrangements remain between the user and the agent provider; Zed does not charge for external-agent use.

Reference:

- [Zed External Agents](https://zed.dev/docs/ai/external-agents)

Zed’s current parallel-agent model supports multiple independent threads. Each thread has its own agent, context window, and conversation history. Threads running in linked Git worktrees appear under the same project in the Threads Sidebar.

Reference:

- [Zed Parallel Agents](https://zed.dev/docs/ai/parallel-agents)

The gap:

```text
Zed can host separate agent threads.
Zed does not yet act as a role-aware conductor that assigns tasks,
passes artifacts, enforces workflow policy, and manages handoffs.
```

### 1.2 Codex auth must preserve ChatGPT subscription usage

OpenAI’s Codex authentication docs distinguish between:

```text
Sign in with ChatGPT:
  subscription access

Sign in with API key:
  usage-based access
```

OpenAI also states that API-key usage is billed through the OpenAI Platform at standard API rates, and that features relying on ChatGPT credits are available only when signed in with ChatGPT.

Reference:

- [OpenAI Codex Authentication](https://developers.openai.com/codex/auth)

The conductor should therefore prefer:

```text
Codex via ChatGPT login
```

and warn before using:

```text
CODEX_API_KEY
OPENAI_API_KEY
```

unless the user explicitly chooses API billing.

### 1.3 Claude Code auth must avoid accidental API billing

Anthropic’s Claude Code docs state that users can maintain usage within a Pro or Max plan by declining API credit options and logging in only with plan credentials. They also warn that API-key environment variables are easy to forget about and can lead users to assume they are using a subscription when they are actually using API configuration.

References:

- [Use Claude Code with your Pro or Max plan](https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan)
- [Manage API key environment variables in Claude Code](https://support.claude.com/en/articles/12304248-manage-api-key-environment-variables-in-claude-code)

The conductor should inspect and warn about:

```text
ANTHROPIC_API_KEY
```

before launching Claude in subscription-preferred mode.

### 1.4 Gemini should be abstracted as Google Visual Agent, not hard-coded Gemini CLI

Zed currently supports Gemini CLI as an external agent. However, Google is moving individual Gemini CLI users toward Antigravity CLI and Antigravity’s agent-first development workflow.

References:

- [Zed External Agents](https://zed.dev/docs/ai/external-agents)
- [Google Antigravity overview coverage](https://www.theverge.com/news/822833/google-antigravity-ide-coding-agent-gemini-3-pro)
- [Gemini CLI to Antigravity CLI transition coverage](https://www.techradar.com/pro/google-is-making-gemini-cli-users-switch-to-its-new-antigravity-2-0-so-what-will-it-mean-for-you)

The conductor should define the role as:

```text
google_visual_agent
```

rather than:

```text
gemini_cli_only
```

Possible backends:

```text
- Gemini CLI
- Antigravity CLI
- Antigravity SDK
- future Google visual agent adapter
```

### 1.5 Robust workflow policy is required

A 2026 empirical study of bugs in Claude Code, Codex, and Gemini CLI found that many failures come from integration/configuration issues, terminal problems, and command failures.

Reference:

- [Engineering Pitfalls in AI Coding Tools](https://arxiv.org/abs/2603.20847)

A separate 2026 benchmark on overeager coding agents found that coding agents can perform out-of-scope actions under benign prompts, which supports the need for scope, permission, and human-approval gates.

Reference:

- [Overeager Coding Agents](https://arxiv.org/abs/2605.18583)

The conductor should be conservative by default:

```text
- no auto-merge
- no auto-push
- read-only review role by default
- protected file paths
- approval before package installs, migrations, deletion, commits, merge, or push
```

---

## 2. Feature Summary

The Role-Aware Conductor is a Zed feature that reads a project roadmap and configuration, assigns work to specialized agents, and manages the lifecycle of a multi-agent coding task.

The core feature is:

```text
/conduct <task>
```

Example:

```text
/conduct Build a responsive onboarding flow.
Use the project roadmap. Claude should plan and review.
Codex should implement and fix.
Gemini/Antigravity should verify UI.
Do not merge without approval.
```

The conductor should then:

```text
1. Read .parallel-code/roadmap.md.
2. Read .parallel-code/conductor.yaml.
3. Resolve agent bindings for roles.
4. Pick a workflow template.
5. Create worktrees if needed.
6. Create agent threads through ACP or native adapters.
7. Send role-specific context packs.
8. Capture structured artifacts.
9. Run test/evaluator gates.
10. Ask for human approval at defined checkpoints.
```

---

## 3. File Layout

The feature should use project-local files.

```text
.parallel-code/
  roadmap.md
  conductor.yaml
  roles.yaml
  workflows/
    plan-implement-review.yaml
    ui-build-verify.yaml
    bug-hunt.yaml
    refactor-safe.yaml
  policies/
    permissions.yaml
    protected-paths.yaml
    budget.yaml
  artifacts/
    runs/
      <run-id>/
        plan.md
        accepted-plan.md
        implementation.diff
        test-report.json
        ui-review.md
        screenshots/
        code-review.md
        final-summary.md
  state/
    runs.sqlite
    leases.json
```

### 3.1 `roadmap.md`

This is the human-readable project roadmap and source of truth for goals, milestones, priorities, and feature specs.

The app should pick it up from:

```text
.parallel-code/roadmap.md
```

Fallback search order:

```text
1. .parallel-code/roadmap.md
2. ROADMAP.md
3. docs/roadmap.md
4. docs/ROADMAP.md
```

If multiple are found, the `.parallel-code/roadmap.md` file wins.

### 3.2 `conductor.yaml`

This is the main machine-readable config.

The app should pick it up from:

```text
.parallel-code/conductor.yaml
```

This file defines:

```text
- role bindings
- default workflow
- auth policy
- artifact policy
- worktree policy
- human approval policy
```

### 3.3 `roles.yaml`

Optional override file for agent roles.

If absent, built-in defaults apply.

### 3.4 `workflows/*.yaml`

Workflow templates for repeatable sequences.

Examples:

```text
plan-implement-review
ui-build-verify
bug-hunt
refactor-safe
```

### 3.5 `policies/*.yaml`

Policy files controlling safety, budget, protected paths, and permissions.

---

## 4. Canonical Roadmap Format

The roadmap is a Markdown document with machine-readable frontmatter and structured headings.

Example:

```markdown
---
schema: agent-conductor-roadmap/v1
project: example-app
default_workflow: plan-implement-review
default_branch: main
status: active
---

# Roadmap

## Current Focus

Build a stable agentic development workflow using Codex, Claude, and Gemini/Antigravity.

## Milestones

### M1: Role-Aware Conductor MVP

Status: planned

Goals:
- route planning to Claude
- route implementation to Codex
- route UI verification to Gemini/Antigravity
- preserve first-party CLI subscription auth
- produce structured artifacts

Acceptance Criteria:
- `/conduct` creates a run
- conductor reads `.parallel-code/conductor.yaml`
- conductor creates role-bound agent threads
- conductor writes artifacts to `.parallel-code/artifacts/runs/<run-id>/`
- human approval is required before merge
```

---

## 5. Main Configuration: `conductor.yaml`

Example:

```yaml
schema: agent-conductor/v1

project:
  name: example-app
  roadmap_file: .parallel-code/roadmap.md
  default_branch: main
  artifact_root: .parallel-code/artifacts/runs
  state_db: .parallel-code/state/runs.sqlite

agents:
  codex:
    type: external_agent
    adapter: codex-acp
    provider: openai
    preferred_auth: chatgpt_subscription
    disallow_api_by_default: true
    env_api_keys:
      - CODEX_API_KEY
      - OPENAI_API_KEY
    executable_hint: codex

  claude:
    type: external_agent
    adapter: claude-acp
    provider: anthropic
    preferred_auth: claude_subscription
    disallow_api_by_default: true
    env_api_keys:
      - ANTHROPIC_API_KEY
    executable_hint: claude

  google_visual:
    type: external_agent
    adapter: google-visual
    provider: google
    preferred_auth: google_account
    backend_priority:
      - antigravity-cli
      - gemini-cli
    env_api_keys:
      - GEMINI_API_KEY
      - GOOGLE_AI_API_KEY

roles:
  planner:
    primary: claude
    fallback:
      - codex
    mode: read_only
    purpose: "Architecture, planning, decomposition, risk analysis."

  implementer:
    primary: codex
    fallback:
      - claude
    mode: writable
    purpose: "Implementation, test repair, bug fixing, PR preparation."

  reviewer:
    primary: claude
    fallback:
      - codex
    mode: read_only
    purpose: "Code review, security review, maintainability review."

  ui_verifier:
    primary: google_visual
    fallback:
      - claude
    mode: browser_or_read_only
    purpose: "UI verification, screenshots, browser checks, responsive review."

  fixer:
    primary: codex
    fallback:
      - claude
    mode: writable
    purpose: "Apply accepted review fixes only."

workflow:
  default: plan-implement-review
  templates_dir: .parallel-code/workflows
  require_plan_approval: true
  require_final_approval: true
  allow_parallel_review: true

worktrees:
  enabled: true
  root: .worktrees
  naming: "{workflow}-{role}-{slug}-{timestamp}"
  writable_roles:
    - implementer
    - fixer
  read_only_roles:
    - planner
    - reviewer
  cleanup:
    after_merge: ask
    after_cancel: ask

artifacts:
  required:
    - plan
    - accepted_plan
    - implementation_diff
    - test_report
    - code_review
    - final_summary
  optional:
    - ui_review
    - screenshots
    - browser_recording
    - risk_log
  format:
    plan: markdown
    accepted_plan: markdown
    implementation_diff: diff
    test_report: json
    ui_review: markdown
    code_review: markdown
    final_summary: markdown

approval:
  before_first_write: true
  before_package_install: true
  before_database_migration: true
  before_delete: true
  before_commit: true
  before_merge: true
  before_push: true
  before_touching_protected_paths: true

auth_policy:
  warn_on_api_keys: true
  block_api_keys_unless_explicit: true
  prefer_subscription_auth: true
  codex_preferred_login: chatgpt
  claude_preferred_login: claude_pro_or_max
  google_preferred_login: google_account

budget_policy:
  use_codex_heavily: true
  use_claude_selectively: true
  use_google_visual_for_ui: true
  max_parallel_expensive_agents: 2
```

---

## 6. Role Binding Semantics

A role is a durable project-level assignment.

A role has:

```text
- name
- primary agent
- fallback agents
- allowed mode
- default context pack
- allowed permissions
- expected artifact output
```

Example:

```yaml
roles:
  planner:
    primary: claude
    mode: read_only
    outputs:
      - plan
      - risk_log
      - test_plan

  implementer:
    primary: codex
    mode: writable
    outputs:
      - implementation_diff
      - test_report
      - pr_summary

  ui_verifier:
    primary: google_visual
    mode: browser_or_read_only
    outputs:
      - ui_review
      - screenshots
      - browser_recording

  reviewer:
    primary: claude
    mode: read_only
    outputs:
      - code_review
      - blocking_issues
      - merge_recommendation

  fixer:
    primary: codex
    mode: writable
    outputs:
      - final_diff
      - final_test_report
```

The app should resolve roles in this order:

```text
1. explicit `/conduct --planner=... --implementer=...` flags
2. `.parallel-code/conductor.yaml`
3. `.parallel-code/roles.yaml`
4. built-in defaults
```

---

## 7. Workflow Template Example

File:

```text
.parallel-code/workflows/plan-implement-review.yaml
```

Example:

```yaml
schema: agent-conductor-workflow/v1
name: plan-implement-review
description: "Claude plans, Codex implements, Claude reviews, Codex fixes."

steps:
  - id: load_roadmap
    type: system
    action: load_roadmap
    input:
      file: .parallel-code/roadmap.md

  - id: plan
    type: agent
    role: planner
    mode: read_only
    context_pack: planner_context
    prompt: |
      Read the roadmap, AGENTS.md, and relevant files.
      Produce an implementation plan for the requested task.
      Do not edit files.
    outputs:
      - plan
      - risk_log
      - test_plan

  - id: approve_plan
    type: human_approval
    depends_on:
      - plan
    prompt: "Approve this plan for implementation?"

  - id: implement
    type: agent
    role: implementer
    mode: writable
    depends_on:
      - approve_plan
    worktree: new
    context_pack: implementer_context
    prompt: |
      Implement the approved plan exactly.
      Do not expand scope.
      Run the configured checks.
    outputs:
      - implementation_diff
      - test_report

  - id: review
    type: agent
    role: reviewer
    mode: read_only
    depends_on:
      - implement
    context_pack: reviewer_context
    prompt: |
      Review the diff against the accepted plan.
      Return blocking issues first.
      Do not edit files.
    outputs:
      - code_review
      - blocking_issues
      - merge_recommendation

  - id: accept_review_items
    type: human_approval
    depends_on:
      - review
    prompt: "Select which blocking issues Codex should fix."

  - id: fix
    type: agent
    role: fixer
    mode: writable
    depends_on:
      - accept_review_items
    worktree: same_as:implement
    context_pack: fixer_context
    prompt: |
      Fix only the accepted review items.
      Do not refactor unrelated code.
      Re-run checks.
    outputs:
      - final_diff
      - final_test_report

  - id: final_approval
    type: human_approval
    depends_on:
      - fix
    prompt: "Approve final diff for commit/merge?"
```

---

## 8. UI Workflow Template Example

File:

```text
.parallel-code/workflows/ui-build-verify.yaml
```

Example:

```yaml
schema: agent-conductor-workflow/v1
name: ui-build-verify
description: "Codex implements UI, Google Visual verifies, Claude reviews if needed."

steps:
  - id: plan
    type: agent
    role: planner
    mode: read_only
    prompt: |
      Produce a concise UI implementation plan.
      Include responsive behavior and states.
    outputs:
      - plan
      - acceptance_criteria

  - id: approve_plan
    type: human_approval
    depends_on:
      - plan

  - id: implement
    type: agent
    role: implementer
    mode: writable
    worktree: new
    depends_on:
      - approve_plan
    prompt: |
      Implement the UI plan.
      Do not change backend APIs unless explicitly approved.
      Run checks.
    outputs:
      - implementation_diff
      - test_report

  - id: visual_verify
    type: agent
    role: ui_verifier
    mode: browser_or_read_only
    depends_on:
      - implement
    prompt: |
      Verify the UI in browser.
      Check layout, visual hierarchy, responsiveness,
      empty/loading/error states, and accessibility basics.
      Return screenshots and specific fixes.
    outputs:
      - ui_review
      - screenshots
      - browser_recording

  - id: fix_visual_issues
    type: agent
    role: fixer
    mode: writable
    worktree: same_as:implement
    depends_on:
      - visual_verify
    prompt: |
      Apply only accepted UI fixes from the UI review.
      Re-run checks.
    outputs:
      - final_diff
      - final_test_report

  - id: final_review
    type: agent
    role: reviewer
    mode: read_only
    depends_on:
      - fix_visual_issues
    condition: "change_size != small"
    prompt: |
      Review the final UI code for maintainability and correctness.
    outputs:
      - code_review

  - id: final_approval
    type: human_approval
    depends_on:
      - fix_visual_issues
```

---

## 9. Context Packs

The app should construct context packs per role.

### 9.1 Planner context

```yaml
context_packs:
  planner_context:
    include:
      - .parallel-code/roadmap.md
      - AGENTS.md
      - CLAUDE.md
      - docs/architecture.md
      - relevant_files
      - diagnostics
    exclude:
      - secrets
      - node_modules
      - target
      - dist
```

### 9.2 Implementer context

```yaml
context_packs:
  implementer_context:
    include:
      - accepted_plan
      - AGENTS.md
      - relevant_files
      - acceptance_criteria
      - test_commands
    exclude:
      - non_task_files
      - protected_paths
```

### 9.3 UI verifier context

```yaml
context_packs:
  ui_verifier_context:
    include:
      - task_spec
      - route_or_page
      - component_files
      - design_system_docs
      - dev_server_url
      - screenshots
    exclude:
      - backend_internals_unless_needed
```

### 9.4 Reviewer context

```yaml
context_packs:
  reviewer_context:
    include:
      - original_task
      - accepted_plan
      - implementation_diff
      - test_report
      - ui_review
      - risk_log
    exclude:
      - unrelated_repo_files
```

---

## 10. Structured Artifact Contract

Agents should not hand off raw chat transcripts. They should produce typed artifacts.

### 10.1 PlanArtifact

Produced by:

```text
planner
```

Default agent:

```text
Claude
```

Path:

```text
.parallel-code/artifacts/runs/<run-id>/plan.md
```

Required fields:

```text
- assumptions
- files likely involved
- implementation steps
- acceptance criteria
- risks
- test plan
```

### 10.2 ImplementationArtifact

Produced by:

```text
implementer
```

Default agent:

```text
Codex
```

Path:

```text
.parallel-code/artifacts/runs/<run-id>/implementation.diff
.parallel-code/artifacts/runs/<run-id>/test-report.json
```

Required fields:

```text
- files changed
- diff
- commands run
- test results
- known risks
```

### 10.3 UiReviewArtifact

Produced by:

```text
ui_verifier
```

Default agent:

```text
Google Visual Agent: Gemini / Antigravity
```

Path:

```text
.parallel-code/artifacts/runs/<run-id>/ui-review.md
.parallel-code/artifacts/runs/<run-id>/screenshots/
```

Required fields:

```text
- visual verdict
- responsive behavior notes
- screenshots
- browser recording if available
- accepted / rejected state
- specific fixes
```

### 10.4 CodeReviewArtifact

Produced by:

```text
reviewer
```

Default agent:

```text
Claude
```

Path:

```text
.parallel-code/artifacts/runs/<run-id>/code-review.md
```

Required fields:

```text
- blocking issues
- non-blocking suggestions
- security concerns
- missing tests
- maintainability concerns
- merge recommendation
```

### 10.5 FinalSummaryArtifact

Produced by:

```text
fixer or conductor
```

Default agent:

```text
Codex + Conductor synthesis
```

Path:

```text
.parallel-code/artifacts/runs/<run-id>/final-summary.md
```

Required fields:

```text
- final files changed
- tests passed
- issues fixed
- issues deferred
- risks
- recommended PR title/body
```

---

## 11. Roadmap Loader Behavior

The application should load the roadmap at the start of each conductor run.

### 11.1 Load order

```text
1. CLI flag: /conduct --roadmap path/to/file.md
2. .parallel-code/conductor.yaml project.roadmap_file
3. .parallel-code/roadmap.md
4. ROADMAP.md
5. docs/roadmap.md
```

### 11.2 Validation

The roadmap is valid if it contains:

```text
- schema frontmatter or recognizable roadmap heading
- at least one goal, milestone, task, or acceptance criteria section
```

If invalid:

```text
Conductor should ask the user whether to:
  - create a default roadmap
  - continue without roadmap context
  - select another file
```

### 11.3 Runtime extraction

The app should extract:

```text
- active milestone
- relevant task title
- acceptance criteria
- constraints
- protected areas
- role preferences if present
```

### 11.4 Roadmap-to-task mapping

The conductor should map user prompts to roadmap items by:

```text
- exact task ID
- title match
- milestone match
- semantic match
- manual user selection
```

Example:

```text
/conduct M1.2
```

resolves to:

```text
Roadmap milestone M1, task 2.
```

---

## 12. Conductor Run Lifecycle

A conductor run has this lifecycle:

```text
Created
  ↓
RoadmapLoaded
  ↓
ConfigLoaded
  ↓
RolesResolved
  ↓
WorkflowSelected
  ↓
ContextPacked
  ↓
WorktreeCreated
  ↓
AgentThreadsCreated
  ↓
PlanGenerated
  ↓
PlanApproved
  ↓
ImplementationRunning
  ↓
TestsRunning
  ↓
ReviewRunning
  ↓
FixesRunning
  ↓
FinalApprovalPending
  ↓
Completed
```

Possible failure states:

```text
AuthFailed
ConfigInvalid
AgentUnavailable
WorktreeFailed
PermissionDenied
TestsFailed
ReviewBlocked
UserCancelled
```

---

## 13. Permission Policy

Default:

```yaml
permissions:
  planner:
    file_read: allow
    file_write: deny
    terminal: ask
    browser: deny
    git_commit: deny
    git_push: deny

  implementer:
    file_read: allow
    file_write: allow_in_worktree
    terminal_safe_command: allow
    terminal_mutating_command: ask
    package_install: ask
    database_migration: ask
    git_commit: ask
    git_push: deny

  ui_verifier:
    file_read: allow
    file_write: ask
    browser_localhost: allow
    browser_external: ask
    terminal: ask
    git_commit: deny
    git_push: deny

  reviewer:
    file_read: allow
    file_write: deny
    terminal: ask
    browser: ask
    git_commit: deny
    git_push: deny

  fixer:
    file_read: allow
    file_write: allow_in_worktree
    terminal_safe_command: allow
    terminal_mutating_command: ask
    git_commit: ask
    git_push: deny
```

---

## 14. Protected Paths Policy

File:

```text
.parallel-code/policies/protected-paths.yaml
```

Example:

```yaml
protected_paths:
  deny_write:
    - .env
    - .env.*
    - secrets/**
    - credentials/**
    - infra/prod/**
    - .github/workflows/deploy.yml

  ask_before_write:
    - package.json
    - pnpm-lock.yaml
    - yarn.lock
    - Cargo.toml
    - Cargo.lock
    - migrations/**
    - db/schema/**
    - terraform/**
    - k8s/**
```

---

## 15. Auth Inspector

The conductor should perform an auth inspection before starting a run.

### 15.1 Codex inspection

Check:

```text
- active Codex auth method
- CODEX_API_KEY
- OPENAI_API_KEY
- ~/.codex/auth.json presence
```

If user preference is subscription auth and API keys are detected:

```text
Warning:
Codex may use API billing instead of ChatGPT subscription access.
Continue?
[Use ChatGPT login] [Use API key once] [Cancel]
```

### 15.2 Claude inspection

Check:

```text
- Claude Code /status if available
- ANTHROPIC_API_KEY
- Console API credit mode if detectable
```

If `ANTHROPIC_API_KEY` is detected:

```text
Warning:
ANTHROPIC_API_KEY is set. Claude Code may use API configuration instead of plan allocation.
Continue?
[Unset for this run] [Use API key once] [Cancel]
```

### 15.3 Google inspection

Check:

```text
- GEMINI_API_KEY
- GOOGLE_AI_API_KEY
- Gemini CLI auth state
- Antigravity CLI availability
```

If both Gemini CLI and Antigravity CLI are present:

```text
Prefer Antigravity for UI/browser verification unless user config says otherwise.
```

---

## 16. UI Requirements

The feature should add a new agent/thread type:

```text
Conductor Thread
```

The Conductor Thread should show:

```text
- active workflow
- resolved roles
- selected agents
- auth mode
- worktree paths
- step status
- artifacts
- approval gates
- warnings
```

Example UI:

```text
Conductor Run: Build onboarding flow

Roadmap: .parallel-code/roadmap.md
Workflow: ui-build-verify

Roles:
  Planner: Claude
  Implementer: Codex
  UI Verifier: Antigravity
  Reviewer: Claude
  Fixer: Codex

Steps:
  [✓] Load roadmap
  [✓] Claude plan
  [✓] Human approve plan
  [●] Codex implement
  [ ] Antigravity visual verification
  [ ] Claude review
  [ ] Codex fix
  [ ] Final human approval

Artifacts:
  plan.md
  implementation.diff
  test-report.json
```

---

## 17. Commands

### 17.1 Conduct command

```text
/conduct <task>
```

Examples:

```text
/conduct Build the dashboard from roadmap item M2.1
/conduct Fix login redirect bug
/conduct Implement the onboarding flow using ui-build-verify
```

### 17.2 Explicit role override

```text
/conduct <task> --planner=claude --implementer=codex --ui=google_visual --reviewer=claude
```

### 17.3 Workflow override

```text
/conduct <task> --workflow=ui-build-verify
```

### 17.4 Roadmap override

```text
/conduct <task> --roadmap docs/product-roadmap.md
```

### 17.5 Dry run

```text
/conduct <task> --dry-run
```

Dry run should output:

```text
- selected workflow
- role assignments
- agents to be launched
- worktrees to be created
- permissions required
- likely artifacts
```

---

## 18. Built-In Defaults

If no project config exists, the conductor should offer to create:

```text
.parallel-code/roadmap.md
.parallel-code/conductor.yaml
.parallel-code/workflows/
.parallel-code/policies/
```

Default role map:

```yaml
roles:
  planner:
    primary: claude
    mode: read_only

  implementer:
    primary: codex
    mode: writable

  reviewer:
    primary: claude
    mode: read_only

  ui_verifier:
    primary: google_visual
    mode: browser_or_read_only

  fixer:
    primary: codex
    mode: writable
```

Default workflow:

```text
plan-implement-review
```

Default UI workflow:

```text
ui-build-verify
```

---

## 19. Acceptance Criteria

The feature is complete when:

```text
1. The app can read `.parallel-code/roadmap.md`.
2. The app can read `.parallel-code/conductor.yaml`.
3. The user can bind Codex, Claude, and Gemini/Antigravity to roles.
4. `/conduct` creates a Conductor Run.
5. The run resolves a workflow template.
6. The run creates or selects worktrees according to policy.
7. The run creates external agent threads using role bindings.
8. The planner role produces a PlanArtifact.
9. The implementer role consumes the PlanArtifact and produces a diff/test report.
10. The UI verifier role can consume the implementation artifact and produce UI artifacts.
11. The reviewer role consumes diff/test/UI artifacts and produces a review artifact.
12. The fixer role applies accepted fixes only.
13. Artifacts are written to `.parallel-code/artifacts/runs/<run-id>/`.
14. The user must approve plan and final merge.
15. The app warns if API keys may bypass preferred subscription auth.
16. The app blocks or asks before protected operations.
```

---

## 20. Non-Goals

This feature should not initially attempt to:

```text
- build a new LLM provider
- proxy model calls through a central billing layer
- replace Codex, Claude Code, Gemini CLI, or Antigravity
- auto-merge to main
- auto-push to remote
- train a model to route tasks
- guarantee agent correctness
- support every agent protocol on day one
```

The first version should be deterministic and explicit.

---

## 21. MVP Roadmap

### Phase 0: Config and Roadmap Loader

Deliver:

```text
- `.parallel-code/roadmap.md` detection
- `.parallel-code/conductor.yaml` parser
- default config generator
- validation errors in UI
```

### Phase 1: Role Resolver

Deliver:

```text
- role-to-agent binding
- fallback resolution
- explicit command-line overrides
- auth warning system
```

### Phase 2: Manual Conductor Run

Deliver:

```text
- `/conduct --dry-run`
- run preview
- workflow selection
- artifact folder creation
```

### Phase 3: Thread Creation

Deliver:

```text
- create Codex thread for implementer
- create Claude thread for planner/reviewer
- create Google Visual thread for UI verifier where available
- link threads under one Conductor Run
```

### Phase 4: Structured Handoff

Deliver:

```text
- PlanArtifact
- ImplementationArtifact
- UiReviewArtifact
- CodeReviewArtifact
- FinalSummaryArtifact
```

### Phase 5: Worktree Automation

Deliver:

```text
- automatic worktree creation
- one writable worktree per implementation task
- read-only review mode
- protected path checks
```

### Phase 6: Approval Gates

Deliver:

```text
- approve plan
- approve protected operation
- approve review items
- approve final merge
```

### Phase 7: UI Integration

Deliver:

```text
- Conductor Thread UI
- step timeline
- artifact tabs
- role map display
- warning display
```

---

## 22. Implementation Notes

### 22.1 Rust module sketch

```text
src/conductor/
  src/
    lib.rs
    roadmap.rs
    config.rs
    roles.rs
    workflows.rs
    runs.rs
    thread_bridge.rs
    auth_inspector.rs
    worktrees.rs
    artifacts.rs
    permissions.rs
    ui_model.rs
```

### 22.2 Key structs

```rust
struct ConductorConfig {
    project: ProjectConfig,
    agents: HashMap<AgentId, AgentConfig>,
    roles: HashMap<RoleName, RoleBinding>,
    workflow: WorkflowConfig,
    worktrees: WorktreeConfig,
    artifacts: ArtifactConfig,
    approval: ApprovalConfig,
    auth_policy: AuthPolicy,
    budget_policy: BudgetPolicy,
}

struct RoleBinding {
    primary: AgentId,
    fallback: Vec<AgentId>,
    mode: RoleMode,
    purpose: String,
}

struct ConductorRun {
    id: RunId,
    task: String,
    roadmap: RoadmapRef,
    workflow: WorkflowTemplate,
    role_assignments: HashMap<RoleName, AgentId>,
    status: RunStatus,
    artifacts: Vec<ArtifactRef>,
}
```

### 22.3 Agent bridge

```rust
trait AgentThreadBridge {
    fn create_thread(&self, agent: AgentId, worktree: WorktreeRef) -> Result<ThreadId>;
    fn send_prompt(&self, thread: ThreadId, prompt: String, context: ContextPack) -> Result<()>;
    fn collect_artifacts(&self, thread: ThreadId) -> Result<Vec<Artifact>>;
}
```

---

## 23. Example First Project Files

### 23.1 `.parallel-code/roadmap.md`

```markdown
---
schema: agent-conductor-roadmap/v1
project: local-agent-conductor
default_workflow: plan-implement-review
---

# Roadmap

## M1: Role-Aware Conductor MVP

Status: planned

Goal:
Build the first end-to-end conductor flow:
Claude plans, Codex implements, Claude reviews, Codex fixes.

Acceptance Criteria:
- `/conduct` loads this roadmap
- role config is loaded from conductor.yaml
- Codex, Claude, and Google Visual roles are resolved
- artifacts are written to `.parallel-code/artifacts/runs/<run-id>/`
- no final merge happens without human approval
```

### 23.2 `.parallel-code/conductor.yaml`

```yaml
schema: agent-conductor/v1

roles:
  planner:
    primary: claude
    mode: read_only

  implementer:
    primary: codex
    mode: writable

  reviewer:
    primary: claude
    mode: read_only

  ui_verifier:
    primary: google_visual
    mode: browser_or_read_only

  fixer:
    primary: codex
    mode: writable

workflow:
  default: plan-implement-review

auth_policy:
  prefer_subscription_auth: true
  warn_on_api_keys: true
  block_api_keys_unless_explicit: true

approval:
  before_first_write: true
  before_commit: true
  before_merge: true
  before_push: true
```

---

## 24. Final Definition

The Role-Aware Conductor is:

```text
A local desktop workflow controller that reads a project roadmap and YAML config,
assigns external coding agents to explicit roles, creates structured handoffs
between those roles, preserves first-party CLI/subscription auth where possible,
runs work in isolated worktrees, captures artifacts, and requires human approval
for high-impact operations.
```

The feature is not:

```text
a new model
a new billing platform
a generic chatbot
a fully autonomous merge bot
```

It is:

```text
the missing conductor layer between Codex, Claude, Gemini/Antigravity, Git worktrees,
project roadmap, and human approval.
```



---

# Latest Alignment Update: Parallel Code Fork, No Zed Yet

**Update date:** 2026-06-01 13:30:34 UTC

The latest clarified direction is:

```text
We are based on a Parallel Code fork.
We should import/reuse much of Parallel Code’s UI and local workflow machinery.
We should amend that base into a stronger frontend, task consumer/tracker, conductor, and dispatcher.
We do not want Zed editor integration yet.
```

This means the MVP is:

```text
Parallel Code fork
+ improved frontend/task dashboard
+ automatic role-aware dispatch
+ conductor run tracking
+ local CLI process management
+ worktree isolation
+ structured artifact handoff
+ subscription-aware scheduler
+ health/retry/escalation
+ human approval gates
```

Editor integration becomes optional and later.

Updated naming:

```text
Repo:      local-agent-conductor
App:       Parallel Code with Agent Conductor
Base:      Parallel Code fork
Config:    .parallel-code/conductor.yaml
Command:   /conduct
```

Current product description:

```text
A Parallel Code fork that turns manual AI-agent selection into local role-aware workflows for Codex, Claude, and Gemini/Antigravity, with task tracking, worktree isolation, structured handoffs, subscription-aware scheduling, and human approval gates.
```
