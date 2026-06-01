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
- src/shared/conductor-config.ts
- src/main/config-store.ts

## Acceptance Criteria

- User can select "Ameen's Default".
- Role dropdowns display installed agents.
- Settings persist to `.zed-conductor/conductor.yaml`.
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

git worktree add .zed-conductor/worktrees/feat-role-settings -b feat/role-settings
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
.zed-conductor/worktrees/<task-type>-<short-slug>-<date>/
```

Examples:

```text
.zed-conductor/worktrees/feat-role-settings-20260601/
.zed-conductor/worktrees/fix-auth-warning-20260601/
.zed-conductor/worktrees/ui-dashboard-review-20260601/
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
  "cwd": ".zed-conductor/worktrees/feat-role-settings-20260601",
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
.zed-conductor/conductor.yaml
.zed-conductor/policies/permissions.yaml
.zed-conductor/policies/protected-paths.yaml
.zed-conductor/workflows/*.yaml
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
.zed-conductor/artifacts/runs/run_20260601_001/plan.md
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
- Add parser for `.zed-conductor/conductor.yaml`.
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
