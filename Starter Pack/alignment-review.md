This review records how the Starter Pack was aligned to the Parallel Code with Agent Conductor direction.

# Alignment Review

## Reviewed

- Root repo docs and package metadata
- Existing Parallel Code app structure: `src/`, `electron/`, `electron/mcp/`, `openspec/`
- Starter Pack primary spec, runbook, rationale, architecture, research, and handoff files
- Zed external-agent and parallel-agent docs
- OpenSpec CLI validation docs

## Drift Found

- Starter Pack mixed three implementation directions: Zed-first, generic local conductor, and Parallel Code fork first.
- Current-path examples used `.zed-conductor/` and `.agent-conductor/` while the chosen canonical directory is `.parallel-code/`.
- Some architecture sections still described Rust/Zed crates instead of Electron/TypeScript modules.
- Product naming varied between `Local Agent Conductor`, Zed conductor wording, and Parallel Code fork wording.
- The primary spec filename reference contained a typo and was corrected to `antfarm`.

## Decisions Applied

- Product name: `Parallel Code with Agent Conductor`
- MVP base: Parallel Code fork using Electron, SolidJS, TypeScript, and Node.js
- Canonical config root: `.parallel-code/`
- Worktree root: `.worktrees/`
- Zed/ACP/editor-native integrations: optional future paths, not MVP implementation base
- Research files remain supporting context; implementation authority lives in the feature spec, runbook, architecture, and current repo state.

## Remaining Caveats

- `.parallel-code/` is ignored and already used for runtime coordination state in the repo. Durable conductor config should be kept separate from generated files if implemented there.
- `npx openspec validate --all --strict` was planned, but the local environment may not have an executable OpenSpec package available.
- `npm run typecheck` requires installed dependencies; earlier local check failed because `tsc` was unavailable.

## Update — 2026-06-01: Codebase Pass + Methodology Bridge

A second pass reviewed the Starter Pack against the actual repository state and
closed the methodology gap. See `codebase-alignment-report.md` for the full
findings. Summary:

- **Strategy is aligned**; the primary gap was **methodology**: the conductor
  feature lived entirely outside the repo's mandatory OpenSpec change pipeline.
- The MVP was decomposed into **seven sequenced OpenSpec changes**
  (`openspec/changes/add-conductor-*`) with SHALL/MUST requirements and
  WHEN/THEN scenarios. Sequencing and acceptance traceability are in
  `conductor-mvp-roadmap.md`.
- Fixed document-internal drift in the feature spec: `zed-conductor*` schema
  strings → `parallel-code-conductor*`; corrected broken source-of-truth file
  references in §48.
- Aligned `CLAUDE.md` / `AGENTS.md` and added `GEMINI.md` so Claude Code,
  Codex, and Gemini all follow the same specs and workflow.
