# Feature Specification: Role-Aware Conductor

**Feature name:** Role-Aware Conductor
**Suggested file name:** `role-aware-conductor-feature-with-antfarm-and-gas-town-and-subscription-capacity-constraint.md`
**Product context:** Parallel Code with Agent Conductor
**Project context:** Parallel Code/Electron app first; optional editor bridge later
**Feature type:** Local desktop multi-agent CLI orchestration with editor bridge
**Status:** Broad product-intent reference. `Goal.md` fixes the MVP scope;
OpenSpec changes define executable requirements; `Plan.md` defines delivery
order and records discoveries.

> **Superseded implementation guidance:** This document preserves broad product
> intent and historical exploration. Commands, phases, tickets, state models,
> auth assumptions, and configuration examples below are not implementation
> authority. Use `Starter Pack/README.md`, `Goal.md`, `Plan.md`,
> `openspec/conductor-governance.json`, and the ten active OpenSpec changes.
> **Date:** 2026-06-01
>
> **Current operating correction (2026-06-10):** Historical "plan first"
> guidance below means plan enough to choose a safe action. Current authority
> uses a risk-calibrated `reason -> act -> observe -> reflect -> retry` loop for
> reversible, evaluable probes, with bounded retries. Protected, irreversible,
> or ambiguous effects remain plan-first, human-gated, and never blindly
> retried.
>
> Current `plan-implement-review` authority also requires: Claude secure design,
> Codex repository validation, human/spec approval where required, one small
> Codex implementation work unit, deterministic test/security evidence,
> evidence-grounded Codex fixes, Claude intent/security review, conductor-owned
> final evidence synthesis, and final human approval. Baked-in model guardrails
> alone do not replace a reviewable threat model.

---

## 0. Starting Baseline Decision

This file is the starting specification for the first build.

The current implementation decision is:

```text
Start with a Parallel Code-style Electron desktop app.
Use real local CLIs for Codex, Claude, and Gemini/Antigravity.
Use git worktrees for isolated writable work.
Use the configured editor through generic "open in editor" actions; do not couple the MVP to Zed.
Do not fork Zed first.
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

Editors remain strategically important, but as integration targets first:

```text
MVP:
  Electron conductor app + real CLIs + .worktrees + generic Open in Editor.

Later:
  Zed extension, ACP bridge, or another editor-native path if deep integration becomes necessary.
```

This corrects the earlier Zed-first language in older documents. When this file says “editor cockpit,” the MVP interpretation is:

```text
the conductor app is the workflow cockpit
the configured editor is the code editor
Git is the source of truth
```

The future editor-native version should be treated as a later product path, not the first implementation.

## 1. Feature Summary

The **Role-Aware Conductor** is a local desktop orchestration feature that lets the user assign external coding agents to explicit roles, then execute structured multi-agent workflows through real first-party CLIs. The first implementation should be an Electron/Parallel Code-style sidecar app, with editor integration kept optional. A future editor-native path remains a later option, not the starting base.

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

As a developer using a local desktop conductor with Zed as my preferred editor, I want to define which AI agent performs which role, so that I can run a coordinated multi-agent coding workflow without manually copying plans, diffs, screenshots, and review comments between tools.

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

Current caveat: this repository already treats `.parallel-code/` as ignored
runtime state for MCP/Docker coordination. If `.parallel-code/` also becomes
canonical project configuration, separate durable config files from generated
runtime state inside that directory.

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

### 7A.3 Editor integration path

The Electron app should include editor bridge actions:

```text
Open Worktree in Editor
Open Changed File in Editor
Open Diff in Editor
Copy Artifact Path
Reveal Artifact Folder
```

The app should not assume editor-specific internals in the MVP. It should work with a generic editor bridge:

```yaml
editor_bridge:
  preferred_editor: configured_editor
  commands:
    open_project: '{editor} {worktree_path}'
    open_file: '{editor} {file_path}'
```

## 8. Main Config: `.parallel-code/conductor.yaml`

This is the main machine-readable configuration for the feature.

Example:

```yaml
schema: parallel-code-conductor/v1

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
    env_api_keys:
      - GEMINI_API_KEY
      - GOOGLE_API_KEY

roles:
  planner:
    primary: claude
    fallback:
      - codex
    mode: read_only
    purpose: 'Architecture, planning, decomposition, risk analysis.'

  implementer:
    primary: codex
    fallback:
      - claude
    mode: writable
    purpose: 'Implementation, test repair, bug fixing, PR preparation.'

  reviewer:
    primary: claude
    fallback:
      - codex
    mode: read_only
    purpose: 'Code review, security review, maintainability review.'

  ui_verifier:
    primary: google_visual
    fallback:
      - claude
    mode: browser_or_read_only
    purpose: 'UI verification, screenshots, browser checks, responsive review.'

  fixer:
    primary: codex
    fallback:
      - claude
    mode: writable
    purpose: 'Apply accepted review fixes only.'

workflow:
  default: plan-implement-review
  templates_dir: .parallel-code/workflows
  require_plan_approval: true
  require_final_approval: true
  allow_parallel_review: true

worktrees:
  enabled: true
  root: .worktrees
  naming: '{workflow}-{role}-{slug}-{timestamp}'
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
  mode: subscription_only
  warn_on_api_keys: true
  block_api_keys_unless_explicit: true
  prefer_subscription_auth: true
  exclude_detected_api_keys: true
  never_switch_billing_route: true
  codex_preferred_login: chatgpt
  claude_preferred_login: subscription_oauth
  google_preferred_login: antigravity_account

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
schema: parallel-code-conductor-workflow/v1
name: plan-implement-review
description: 'Claude plans, Codex implements, Claude reviews, Codex fixes.'

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
    prompt: 'Approve this plan for implementation?'

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
    prompt: 'Select which blocking issues Codex should fix.'

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
    prompt: 'Approve final diff for commit/merge?'
```

### 10.2 `ui-build-verify.yaml`

```yaml
schema: parallel-code-conductor-workflow/v1
name: ui-build-verify
description: 'Codex implements UI, Google Visual verifies, Claude reviews if needed.'

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
    condition: 'change_size != small'
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
[Use installed Codex CLI with ChatGPT login]
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
[Use native Claude subscription login]
[Cancel]
```

### 16.3 Antigravity and Gemini CLI transition

Check:

```text
GEMINI_API_KEY
GOOGLE_API_KEY
Antigravity CLI availability
```

For the built-in consumer-subscription profile:

```text
Use native interactive Antigravity.
Do not launch Antigravity in Docker while keychain login is unavailable there.
Do not use consumer Gemini CLI as a fallback after June 18, 2026.
Do not silently switch to Gemini API-key or enterprise billing.
```

---

## 17. Editor UI

The feature should add a new primary view:

```text
Conductor Run View
```

If the product later becomes a future editor-native path or Zed extension, this can map to a Zed `Conductor Thread`.

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

## 21. Historical Implementation Phases (Superseded)

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
electron/conductor/
  config.ts
  roles.ts
  workflows.ts
  runs.ts
  dispatcher.ts
  auth-inspector.ts
  artifacts.ts
  permissions.ts
  scheduler.ts

src/conductor/
  ConductorDashboard.tsx
  RoleSettings.tsx
  RunTimeline.tsx
  artifacts.ts

src/ipc/conductor-types.ts
```

Key types:

```ts
interface ConductorConfig {
  project: ProjectConfig;
  agents: Record<AgentId, AgentConfig>;
  roles: Record<RoleName, RoleBinding>;
  workflow: WorkflowConfig;
  worktrees: WorktreeConfig;
  artifacts: ArtifactConfig;
  approval: ApprovalConfig;
  authPolicy: AuthPolicy;
  budgetPolicy: BudgetPolicy;
}

interface RoleBinding {
  primary: AgentId;
  fallback: AgentId[];
  mode: RoleMode;
  purpose: string;
}

interface ConductorRun {
  id: RunId;
  task: string;
  workflow: WorkflowTemplate;
  roleAssignments: Record<RoleName, AgentId>;
  status: RunStatus;
  artifacts: ArtifactRef[];
}
```

Agent bridge:

```ts
interface AgentTaskBridge {
  createTask(input: CreateConductorTaskInput): Promise<TaskId>;
  sendPrompt(taskId: TaskId, prompt: string, context: ContextPack): Promise<void>;
  collectArtifacts(taskId: TaskId): Promise<ArtifactRef[]>;
}
```

---

## 23. Final Definition

The Role-Aware Conductor is:

```text
A Parallel Code/Electron workflow controller that assigns external coding agents to explicit roles,
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
editor-native review
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
      status_marker: 'STATUS: verified'
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

| Source   | Feature / Rule                                             | Present in Parallel Code? | Present in Previous MD? |  Add to This Project? | Priority |
| -------- | ---------------------------------------------------------- | ------------------------: | ----------------------: | --------------------: | -------: |
| Antfarm  | Deterministic workflow contracts                           |                        No |                 Partial |                   Yes |       P0 |
| Antfarm  | Planner/developer/verifier/tester/reviewer role separation |                        No |                 Partial |                   Yes |       P0 |
| Antfarm  | Fresh context per step                                     |                        No |                    Weak |                   Yes |       P0 |
| Antfarm  | Retry and escalate                                         |                        No |                    Weak |                   Yes |       P0 |
| Antfarm  | Step expected-output markers                               |                        No |                      No |                   Yes |       P1 |
| Antfarm  | YAML/Markdown workflow packs                               |                        No |                 Partial |                   Yes |       P0 |
| Antfarm  | Workflow registry security review                          |                        No |                      No |                   Yes |       P1 |
| Antfarm  | Dashboard for run progress/logs                            |                   Partial |                 Partial |                   Yes |       P1 |
| Antfarm  | Resume failed run                                          |                        No |                      No |                   Yes |       P1 |
| Gas Town | Top coordinator as primary interface                       |                        No |                 Partial |                   Yes |       P0 |
| Gas Town | Work tracker: run/work item/step hierarchy                 |                        No |                 Partial |                   Yes |       P0 |
| Gas Town | Persistent agent identity                                  |                        No |                      No |                   Yes |       P1 |
| Gas Town | Persistent work state survives crashes                     |                   Partial |                 Partial |                   Yes |       P0 |
| Gas Town | Watchdog / health monitoring                               |                        No |                      No |                   Yes |       P0 |
| Gas Town | Problems view                                              |                        No |                      No |                   Yes |       P1 |
| Gas Town | Nudge/handoff/retry/reassign recovery                      |                        No |                      No |                   Yes |       P0 |
| Gas Town | Activity feed / event stream                               |                        No |                    Weak |                   Yes |       P1 |
| Gas Town | Scheduler / concurrency cap                                |                        No |                      No |                   Yes |       P0 |
| Gas Town | Severity-based escalation                                  |                        No |                    Weak |                   Yes |       P0 |
| Gas Town | Merge queue                                                |                        No |                      No | Yes, simplified first |       P1 |
| Gas Town | Bors-style bisecting merge queue                           |                        No |                      No |                 Later |       P2 |
| Gas Town | Formulas/recipes                                           |                        No |                 Partial |                   Yes |       P1 |
| Gas Town | Context recovery / prime                                   |                        No |                      No |                   Yes |       P1 |

## 29. Updated MVP Based on Research

The previous MVP should be adjusted.

### P0 Must-Haves

```text
1. Role profile settings
2. Ameen’s Default preset
3. Automatic task classification
4. Deterministic workflow templates
5. Fixed workflow recipe schema for the MVP presets
6. Fresh context per step
7. Structured artifacts
8. Per-run role/agent/task/artifact traceability
9. Worktree isolation
10. Auth/billing inspector
11. Scheduler/concurrency limits
12. Basic states: ready_for_review/ready_for_merge/blocked/failed/needs_human/retry_once
13. Simple retry/escalate policy
14. Human approval gates
```

### P1 Strong Additions

```text
1. Problems view
2. Activity feed
3. Workflow recipe manager UI
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
15. queue excess steps and show capacity plan before launch
16. per-run role/agent/task/artifact traceability
17. basic run states: ready-for-review, ready-for-merge, blocked, failed, needs-human, retry-once
18. human approval before merge/push/protected operations
```

Explicitly defer:

```text
- remote workflow registry
- 20–30 agent swarms
- autonomous background patrol agents
- autonomous/batched merge queue, including bors-style bisecting merge queue
- persistent long-term agent identity or memory
- general workflow DSL editor
- full ACP rewrite
- multi-project federation
- future editor-native path
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
open worktree in configured editor
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
    - 'No parallel swarm required.'
    - 'UI verification runs only after implementation.'
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
  The feature was framed mainly as a editor-native conductor or future editor-native path feature.

Now:
  The feature starts as a Parallel Code-style Electron desktop app,
  with the configured editor used through a generic editor bridge.
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

Deep Research/gemini_claude_codex_strengths_architecture_handoff.md
  Rationale for role assignment across Codex, Claude, and Gemini/Antigravity.

online_research_agent_orchestrator_consensus_and_products.md
  Market/product research and gap analysis.

meta_orchestrator_rationale.md
  Original rationale for preserving first-party subscriptions and role-based orchestration.

meta_orchestrator_architecture.md
  Original editor-native architecture path, now treated as a later-stage option.
```

Precedence order:

```text
1. This file.
2. Project runbook.
3. Strengths/architecture/handoff document.
4. Online research document.
5. Older Zed-first rationale/architecture documents.
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
  - the configured editor as an optional bridge
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
parallel-code-with-agent-conductor
```

but the MVP is not a future editor-native path.

Recommended naming stack:

```text
Repo:              parallel-code-with-agent-conductor
App name:          Parallel Code with Agent Conductor
Feature name:      Role-Aware Conductor
Default profile:   Ameen’s Default — Subscription Aware
Config dir:         .parallel-code/
Main config:        .parallel-code/conductor.yaml
Command:            /conduct
```

Reason:

```text
The name keeps the Parallel Code base visible,
while making the new conductor layer explicit.
```

## 52. Historical First Build Tickets (Superseded)

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
- full future editor-native path
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
+ Zed editor bridge
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
  closest future editor-native target,
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
and Zed-first editor bridging.
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
5. Keep the configured editor as an optional bridge.
6. Do not fork Zed first.
```

The differentiator remains:

```text
Parallel Code asks the user to pick an agent.
Role-Aware Conductor lets the user describe the task and automatically dispatches the configured role-agent workflow.
```
