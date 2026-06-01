This index defines the current Starter Pack source order for Parallel Code with Agent Conductor.

# Starter Pack

## Current Decision

Build **Parallel Code with Agent Conductor** as a Parallel Code/Electron-first product:

- Base: Parallel Code fork
- Stack: Electron, SolidJS, TypeScript, Node.js
- Agent model: real local CLIs for Codex, Claude Code, Gemini/Antigravity, and future compatible agents
- Isolation: git branches and `.worktrees/`
- Canonical project config: `.parallel-code/`
- Editor integration: optional future bridge, not MVP base

## Authoritative Docs

Read these first:

1. `role-aware-conductor-feature-with-antfarm-and-gas-town-and-subscription-capacity-constraint.md` — primary feature spec.
2. `project-runbook-safe-ai-agent-development.md` — safe development runbook.
3. `meta_orchestrator_architecture.md` — architecture direction for the Parallel Code fork.
4. `meta_orchestrator_rationale.md` — product and technical rationale.

## Supporting Research

Use these as context, not as implementation authority:

- `online_research_agent_orchestrator_consensus_and_products.md`
- `Deep Research/gemini_claude_codex_strengths_architecture_handoff.md`
- `Deep Research/Frontier model comparison of Claude, Codex, Gemini and DeepSeek_deep-research-report.md`

Research may mention Zed, ACP, editor-native paths, or older product comparisons. Treat those as market evidence or future options unless the authoritative docs say otherwise.

## Handoff Context

`agent_conductor_full_chat_context.md` is a long context bundle. Use it to recover conversation history, but resolve conflicts in this order:

1. Current repo state
2. This `README.md`
3. Primary feature spec
4. Runbook
5. Architecture/rationale docs
6. Research snapshots

## Known Caveat

`.parallel-code/` is currently ignored by the repo and used by Parallel Code runtime features such as MCP/Docker coordination. If it becomes canonical project configuration, implementation must separate durable config from generated runtime state under that directory.
