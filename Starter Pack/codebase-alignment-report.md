# Codebase ↔ Starter Pack Alignment Report

**Date:** 2026-06-01
**Author:** Alignment review pass
**Scope:** Parallel Code repository (current `main`) vs. the Starter Pack product/discovery docs
**Status:** Complete — remediation artifacts created (see §6)

This report records the gap between what the repository actually contains and
what the Starter Pack specifies, and explains how the gap was closed using the
repository's own software-development methodology (OpenSpec, spec-driven
changes, human-gated delivery).

---

## 1. Method

Reviewed:

- Repo source: `src/`, `electron/`, `electron/ipc/`, `electron/mcp/`,
  `electron/remote/`, and the build/config tooling.
- Repo methodology: `CLAUDE.md`, `AGENTS.md`, `openspec/config.yaml`,
  `openspec/specs/`, and all 16 existing `openspec/changes/`.
- Starter Pack: the feature spec, runbook, architecture, rationale, market
  research, deep-research reports, the prior `alignment-review.md`, and the
  Starter Pack `README.md`.

Tooling checks attempted: `openspec` CLI (not installed in this environment),
`npm run typecheck` (requires installed deps). Structural validation of the new
change artifacts was done by hand against the existing changes' format.

---

## 2. What Is Actually in the Repo Today

The repo is the **unmodified Parallel Code base** plus its normal change
pipeline. Confirmed primitives that the conductor MVP can build on:

- Electron + SolidJS + strict TypeScript, npm, Vitest.
- Real local CLI agents already wired as data-driven `AgentDef`s in
  `electron/ipc/agents.ts` (Claude Code, Codex, Gemini CLI, OpenCode, Copilot,
  and **Antigravity `agy`** — added in the most recent change).
- PTY process management (`electron/ipc/pty.ts`), git operations
  (`electron/ipc/git.ts`), tasks/persistence, PR/CI status, MCP coordinator
  backend (`electron/mcp/`), steps tracking, remote access.
- A mature OpenSpec workflow: capability specs in `openspec/specs/`, proposals
  in `openspec/changes/<name>/` with `proposal.md` + `tasks.md` +
  `specs/<cap>/spec.md` (+ optional `design.md`), validated with
  `openspec validate --all --strict`.

**There is no conductor code anywhere.** A repo-wide search for `conductor`,
role routing, workflow recipes, artifact handoff, auth inspection, or capacity
scheduling returns nothing in `src/` or `electron/`. The `role` matches found
are unrelated (MiniMax `ask-code` and MCP tool-list code).

## 3. What the Starter Pack Specifies

A complete product: the **Role-Aware Conductor** — task classification, role
routing, deterministic workflow recipes, structured artifact handoff,
worktree isolation, auth/billing inspection, subscription-aware capacity
scheduling, basic retry/escalation states, per-run role traceability, and
human approval gates, all on top of the Parallel Code/Electron base. The MVP
cutline (feature spec §29A and first-build tickets §52) is well-scoped and
realistic.

## 4. Alignment Findings

### 4.1 Strategic direction — ALIGNED

The Starter Pack's chosen direction (Parallel Code/Electron fork first, real
first-party CLIs, `.worktrees/` isolation, `.parallel-code/` canonical config,
editor as an optional bridge, **not** a Zed fork) is consistent with the actual
repo. The prior `alignment-review.md` already resolved the earlier Zed-first vs.
Electron-first drift. No change needed to the strategy.

### 4.2 Methodology — **MISALIGNED (primary finding)**

The repo mandates (in `CLAUDE.md` / `AGENTS.md` / `openspec/config.yaml`) that
**new behavior is proposed as an OpenSpec change before it is built**, with
SHALL/MUST requirements and WHEN/THEN scenarios, and validated strictly.

The entire conductor feature lived **outside** that pipeline — as ~10 long-form
Markdown discovery docs in `Starter Pack/`. That is the right shape for product
discovery, but it is not an executable, reviewable, testable unit of work in
this repo's process. Consequences:

- No requirement is expressed as a verifiable SHALL with scenarios, so nothing
  is `openspec validate`-able and nothing maps cleanly to tests.
- No decomposition into the repo's change unit, so Claude Code / Codex / Gemini
  have no in-pipeline entry point to start implementing safely.
- No traceability from the spec's acceptance criteria (§20, §45) to tasks.

**Remediation:** the MVP has been decomposed into seven sequenced OpenSpec
changes (see §6) that carry the Starter Pack's intent into the repo's real
process.

### 4.3 Document-internal inconsistencies — **FIXED**

Corrected in the feature spec during this pass:

- `schema: zed-conductor/v1` → `parallel-code-conductor/v1` (1 occurrence) and
  `schema: zed-conductor-workflow/v1` → `parallel-code-conductor-workflow/v1`
  (2 occurrences). The `zed-conductor` schema name contradicted the
  `.parallel-code/` canonical decision recorded in `alignment-review.md`.
- Broken source-of-truth references in §48: `zed_meta_orchestrator_rationale.md`
  and `zed_meta_orchestrator_architecture.md` → the real filenames
  `meta_orchestrator_rationale.md` / `meta_orchestrator_architecture.md`, and
  `gemini_claude_codex_strengths_architecture_handoff.md` → its real path under
  `Deep Research/`.

Left intentionally unchanged: the `meta_orchestrator_*.md` docs keep their
Zed/editor-native framing because the spec explicitly files them as the
"original editor-native path, now a later-stage option."

### 4.4 Config-directory caveat — OPEN (carried forward)

`.parallel-code/` is already `.gitignore`d and used for runtime MCP/Docker
coordination state. If it also becomes canonical durable config, the
implementation MUST separate committed config (`conductor.yaml`, `roles.yaml`,
`workflows/`, `policies/`) from generated runtime state (`state/`, `artifacts/`,
`agents/`). This constraint is now encoded in the `add-conductor-config`
change's design, not just prose.

### 4.5 Multi-agent authoring — **ADDRESSED**

Claude Code reads `CLAUDE.md`, Codex reads `AGENTS.md`, Gemini reads
`GEMINI.md`. The repo had identical `CLAUDE.md`/`AGENTS.md` and **no
`GEMINI.md`**. All three are now aligned and point to the conductor specs and
the OpenSpec workflow so any of the three agents follows the same methodology.

## 5. Risk If Left Unaligned

Without the methodology bridge, the first implementation attempt would likely
start from a 3,900-line narrative spec with no acceptance scenarios — exactly
the "out-of-scope actions / unclear scope" failure mode the project runbook
(§1) is built to avoid. Spec-driven changes with scenarios and human gates are
the mitigation the repo already trusts.

## 6. Remediation Artifacts Produced

Documentation:

- This report.
- `conductor-mvp-roadmap.md` — phases, dependency order, and acceptance
  traceability mapping each MVP capability to its OpenSpec change.
- Fixes applied to the feature spec (§4.3).
- `CLAUDE.md`, `AGENTS.md`, `GEMINI.md` aligned (§4.5).

OpenSpec changes (in `openspec/changes/`), in dependency order:

1. `add-conductor-config` — config + role resolver + Ameen's Default preset.
2. `add-conductor-auth-inspector` — API-key detection + subscription warnings.
3. `add-conductor-scheduler` — subscription-aware concurrency caps (3 / 6).
4. `add-conductor-dry-run` — task classifier, workflow selection, capacity plan.
5. `add-conductor-worktrees` — worktree creation + protected-path policy.
6. `add-conductor-artifacts` — structured artifact handoff.
7. `add-conductor-approval-gates` — human gates before risky operations, plus
   ready-for-review / ready-for-merge / blocked / failed / needs-human /
   retry-once states.

Each carries `proposal.md`, `tasks.md`, and a `specs/<cap>/spec.md` with
SHALL/MUST requirements and WHEN/THEN scenarios; `add-conductor-config` also
carries a `design.md` for the committed-vs-runtime directory split.

## 7. Recommended Next Steps

1. Install OpenSpec and run `openspec validate --all --strict`; fix any nits.
2. Implement in the §6 order — `add-conductor-config` first; it unblocks the
   rest.
3. Keep the Starter Pack as the durable "why"; keep `openspec/changes/` as the
   authoritative "what/▸how" once a change ships and is archived into
   `openspec/specs/`.
4. Defer everything in feature spec §29A "Explicitly defer" and §53 "Do Not
   Build Yet" until the MVP proves the core loop.
