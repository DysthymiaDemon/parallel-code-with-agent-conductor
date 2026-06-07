# Current Rationale Decision: Parallel Code First

**Update date:** 2026-06-01 13:32:40 UTC
**Status:** Retained product rationale; not implementation authority. Use
`README.md`, `Goal.md`, `Plan.md`, and OpenSpec for current delivery decisions.

```text
The MVP is a Parallel Code fork amended into Parallel Code with Agent Conductor.
The immediate product is a good frontend, task consumer/tracker, conductor, dispatcher, worktree manager, and safe local CLI workflow.
Editor integration is optional and later.
```

---

# Rationale for a Parallel Code-Based Parallel Code with Agent Conductor

**Update date:** 2026-06-01 13:30:34 UTC
**Current status:** This rationale has been realigned away from a Zed-first plan.

The project is now:

```text
Parallel Code fork first
Parallel Code with Agent Conductor product
Editor-neutral MVP
Optional editor bridge later
```

The reason is practical: the immediate product is a good frontend, task consumer/tracker, conductor, dispatcher, worktree manager, and safe local CLI workflow. Parallel Code already supplies the closest base for that: Electron UI, local CLI agents, branches/worktrees, session panes, and diff review.

---

# Rationale for a Parallel Code-Based Parallel Code with Agent Conductor

## Executive Summary

The reason for proposing a Parallel Code fork with a Role-Aware Conductor is straightforward: the current AI coding tool market gives strong individual agents and Parallel Code gives a useful local multi-agent shell, but cross-agent role routing and structured handoff remain weak.

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

## 4. Why Parallel Code Is the Better Starting Point

Parallel Code became the preferred base because it is closer to the desired local desktop conductor app.

The important Parallel Code properties are:

```text
- Electron/SolidJS desktop UI
- local CLI process spawning
- Codex support
- Claude Code support
- Gemini CLI / Antigravity support
- branch and worktree isolation
- diff review surfaces
- coordinator MCP backend
- no pooled model-credit layer
```

The key difference:

```text
Cursor wants to be the AI IDE.
Warp wants to be the agentic terminal.
Parallel Code can plausibly become the neutral local agent cockpit.
```

This matters because the user’s ideal setup is not one vendor’s agent. It is:

```text
Codex + Claude + Gemini
each through its own best access path
coordinated in one development surface
```

Parallel Code is not yet a role-aware conductor. But it is the closest practical substrate for one.

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

## 16. Why This Should Start From Parallel Code Rather Than a Fresh Separate App

A fresh orchestration app is possible, but a Parallel Code fork has advantages:

```text
- agents need task/session context
- diffs need to be inspected near the terminal output
- worktrees need project awareness
- terminals need to sit near code
- artifacts should be tied to files and branches
- the user needs one cockpit, not another dashboard
```

Parallel Code is already a desktop multi-agent app, so orchestration can be close to:

```text
- task/session panes
- agent terminals
- git worktrees
- diffs
- remote/mobile monitoring
- coordinator MCP state
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
It is a workflow graph of specialized agents, each using its strongest native environment, coordinated inside the local development app.
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
5. Parallel Code is a plausible neutral cockpit because it already supports local CLI agents, worktrees, and task panes.
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

# Updated Rationale Summary

The current rationale is:

```text
Parallel Code already solves the local shell:
  desktop UI
  task/session tracking
  real CLI agents
  git worktrees
  diff review
  no extra model proxy

The project adds the missing conductor:
  automatic role-aware dispatch
  deterministic workflows
  artifact handoffs
  scheduler/capacity limits
  health/retry/escalation
  human approval gates
```

Therefore:

```text
Fork Parallel Code first.
Do not build on Zed first.
Do not require editor integration for MVP.
Keep Zed/editor integration as optional later work.
```
