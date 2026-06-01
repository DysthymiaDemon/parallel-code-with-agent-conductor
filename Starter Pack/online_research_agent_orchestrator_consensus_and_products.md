# Online Research: Is the Zed Meta-Orchestrator Idea Common, and Does a Product Already Exist?

**Date:** 2026-06-01  
**Question:** Is the reasoning behind a Zed-based meta-orchestrator for Codex, Claude, and Gemini/Antigravity common among agent-using developers? Does a product already exist that serves this need, and what are its cons versus Zed?

---

## Executive Conclusion

The short answer:

```text
Yes, the reasoning is broadly aligned with current agent-using developer practice.

No, it is not yet a settled "universal consensus" in the formal sense.

Yes, products already exist that partially serve the need.

No, I did not find a product that cleanly combines all of the following:
  - editor-native Zed workflow
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
A Zed fork as the ideal implementation surface.
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

This is extremely close to the reasoning behind the proposed Zed meta-orchestrator.

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
The exact neutral, subscription-preserving, editor-native orchestrator remains underdeveloped.
```

---

## 3. Is There a Product That Already Does This?

## 3.1 Product landscape summary

| Product | How close is it? | Best description | Main weakness versus Zed fork |
|---|---:|---|---|
| Zed | High substrate, incomplete orchestrator | Editor-native ACP cockpit | No full meta-orchestrator yet |
| Parallel Code | Very close operationally | Standalone multi-agent worktree manager | Not editor-native; less deep code/symbol/diff integration than a Zed fork |
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

## 5.3 Cons versus a Zed fork

```text
- standalone Electron app, not editor-native
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

But it does not eliminate the case for a Zed fork, because it is not editor-native
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

## 6.2 Cons versus a Zed fork

```text
- Mac app
- homepage focuses on Codex + Claude Code, not Gemini/Antigravity
- not clearly an editor-native Zed-style environment
- may be less suitable if the user wants Zed as the main coding cockpit
- unknown depth of subscription-preserving behavior beyond running native agents
- not clearly a role-based meta-orchestrator across three providers
```

## 6.3 Verdict

```text
Conductor is a strong existing competitor for the "parallel Codex + Claude" part.

It does not obviously cover the full desired target:
Codex + Claude + Gemini/Antigravity in a neutral Zed-native orchestrator with role-based handoffs.
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
- not as natural as a Zed fork for code/symbol/diff/editor-native workflows
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
- less local-editor-native
- not designed around preserving ChatGPT Pro Codex CLI usage or Claude Pro Claude Code usage
- more platform-centric than local cockpit-centric
```

## 11.3 Verdict

```text
GitHub Agent HQ validates the multi-agent direction.
It does not replace the need for a local Zed-centered cockpit if the user wants first-party CLI/subscription preservation.
```

---

## 12. The API-vs-CLI/Subcription Usage Question

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
editor-native, subscription-preserving, role-aware, multi-provider orchestration
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
A Zed fork is the ideal implementation.
```

Zed is a strong candidate because of ACP, external agents, ChatGPT subscription support, and editor-native architecture. But Parallel Code and Conductor show that standalone orchestration apps are also viable.

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
It is not Zed-native and not a full meta-orchestrator.
```

## 15.2 Best editor-native substrate

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
Credit economics and terminal-first design are less aligned with a Zed-based editor-native cockpit.
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

## 16. Implications for the Zed Fork

The online research suggests the Zed fork should not try to prove that multi-agent coding is useful from scratch. That is already happening.

Instead, it should target the unsolved gap:

```text
Make Zed the native cockpit for multi-provider, subscription-preserving agent orchestration.
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
  best editor-native substrate, but missing the conductor layer
```

The most defensible conclusion:

```text
A product category already exists.

But the exact product you want does not appear to exist yet:
a Zed-native, ACP-based, multi-provider, subscription-preserving conductor
that routes Claude, Codex, and Gemini/Antigravity by role
with structured handoffs, worktrees, artifacts, permissions, and human gates.
```

That remains a credible product gap.
