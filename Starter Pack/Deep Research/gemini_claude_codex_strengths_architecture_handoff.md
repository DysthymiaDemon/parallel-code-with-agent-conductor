# Gemini vs Claude vs Codex: Strengths, Role Assignment, and Ideal Multi-Agent Architecture

**Date:** 2026-06-01  
**Goal:** Compare Gemini/Antigravity, Claude/Claude Code, and OpenAI Codex for an agentic coding workflow, then define an ideal architecture and handoff model for a Zed-based multi-agent orchestrator.

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

This matters for a Zed fork because Zed’s current external-agent docs list Gemini CLI. The architecture should therefore avoid hard-coding Gemini CLI as the long-term Google adapter.

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
Zed Conductor
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
Zed Conductor
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
2. Zed Conductor classifies task as backend feature.
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
2. Zed Conductor classifies task as UI feature.
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
  ├── .zed-conductor/worktrees/feat-auth-codex
  ├── .zed-conductor/worktrees/feat-dashboard-ui
  └── .zed-conductor/worktrees/review-auth-claude
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

## 12. Ideal Zed Fork Implementation

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

Use Zed’s Agent Panel:

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
Zed Conductor
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

Zed Conductor:
  "Route the work, preserve context, capture artifacts, enforce boundaries."

Human:
  "Approve the plan, accept the risk, merge the code."
```

The strongest reason to build the Zed fork is that it would combine four things that current tools rarely combine cleanly:

```text
1. first-party subscription preservation
2. cross-company agent orchestration
3. editor-native workflow and diff review
4. worktree-based safety with structured handoffs
```

That is the product gap.
