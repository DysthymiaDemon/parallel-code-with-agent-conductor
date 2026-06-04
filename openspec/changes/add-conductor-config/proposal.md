## Why

Parallel Code lets a user pick an agent per task by hand. The Role-Aware
Conductor's differentiator is letting the user *describe a task* and have the
app dispatch the right role→agent workflow. Every other conductor capability
(dry-run, worktrees, artifacts, scheduler, approval gates) depends on one
foundation: a project-local, validated configuration that binds roles
(planner, implementer, reviewer, ui_verifier, fixer) to the agents already in
the registry, with a sensible default preset. Today no such config, role
model, or resolver exists in the codebase.

This change delivers only that foundation: read/validate `.parallel-code/`
conductor config, ship the **Ameen's Default — Subscription Aware** preset, and
resolve a role to a concrete agent with a deterministic precedence order. No
agents are launched and nothing is written to the working tree by this change.

## What Changes

- Define a project-local config root for durable conductor configuration:
  `.parallel-code/conductor.yaml` and `.parallel-code/roles.yaml`.
- Parse and **validate** that config; on invalid config, surface a precise,
  actionable error instead of failing silently.
- Generate a default `conductor.yaml` (the **Ameen's Default** preset) when none
  exists, binding `planner→claude-code`, `implementer→codex`,
  `reviewer→claude-code`, `ui_verifier→antigravity` (fallback `gemini`),
  `fixer→codex`, with Consumer Subscription capacity defaults.
- Implement a **role resolver** with precedence: explicit command override →
  `conductor.yaml` → `roles.yaml` → built-in defaults.
- Keep durable committed config separate from generated runtime state inside
  `.parallel-code/` (see `design.md`).

## Capabilities

### New Capabilities

- `conductor-config`: The project-local configuration and role-binding model
  for the Role-Aware Conductor — how conductor config is located, parsed,
  validated, defaulted, and how a workflow role resolves to a concrete
  registered agent.

## Impact

- **Code (new):** `electron/conductor/config.ts` (locate/parse/validate/default),
  `electron/conductor/roles.ts` (resolver). New IPC channels on the `IPC` enum
  in `electron/ipc/channels.ts` (e.g. `ConductorLoadConfig`,
  `ConductorResolveRole`) with payload types in `src/ipc/types.ts` and preload
  allowlist entries in `electron/preload.cjs`.
- **Reuse:** agent ids resolve against the existing `AgentDef` registry in
  `electron/ipc/agents.ts` — no new agent plumbing.
- **Filesystem:** introduces `.parallel-code/conductor.yaml` and
  `.parallel-code/roles.yaml` as committed config; `.parallel-code/state/` and
  `.parallel-code/artifacts/` remain generated/ignored.
- **Dependencies:** a YAML parser (the lockfile already carries `yaml`; confirm
  before adding).
- **No behavior change** to existing manual agent selection.
