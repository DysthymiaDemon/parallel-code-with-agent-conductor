## 1. Config location & parsing

- [ ] 1.1 Add `electron/conductor/config.ts` that locates
  `.parallel-code/conductor.yaml` relative to the selected project root and
  parses it with the YAML parser already in the lockfile (confirm `yaml` is
  present before adding any dependency).
- [ ] 1.2 Parse the optional `.parallel-code/roles.yaml` overlay when present.
- [ ] 1.3 Represent the parsed config with a `ConductorConfig` type in
  `src/ipc/types.ts` (project, agents, roles, workflow, worktrees, approval,
  authPolicy, capacity blocks) — strict, no `any`.

## 2. Validation

- [ ] 2.1 Validate that every `roles.<role>.primary` and each `fallback` entry
  is an agent id present in the live `AgentDef` registry (`electron/ipc/agents.ts`).
- [ ] 2.2 Validate required top-level blocks and enum-valued fields (role
  `mode`, capacity `mode`); return the first problem with a dotted path and a
  human-readable message.
- [ ] 2.3 Treat a **missing** `conductor.yaml` as "generate default", and a
  **malformed** one as a hard error (never silent-fallback to defaults).

## 3. Default preset generation

- [ ] 3.1 Generate `conductor.yaml` = **Ameen's Default — Subscription Aware**
  when none exists: roles `planner→claude`, `implementer→codex`,
  `reviewer→claude`, `ui_verifier→google_visual` (Antigravity preferred, Gemini
  fallback), `fixer→codex`; capacity `mode: consumer_subscription`,
  `target_active_agents: 3`, `max_active_agents: 6`, `default_effort: medium`.
- [ ] 3.2 Never overwrite an existing committed `conductor.yaml`/`roles.yaml`.
- [ ] 3.3 Ensure generated runtime dirs (`state/`, `artifacts/`, `agents/`)
  remain git-ignored while `conductor.yaml`/`roles.yaml`/`workflows/`/
  `policies/` are trackable (see `design.md`).

## 4. Role resolver

- [ ] 4.1 Add `electron/conductor/roles.ts` resolving a role to a concrete agent
  with precedence: command override → `conductor.yaml` → `roles.yaml` →
  built-in defaults.
- [ ] 4.2 Fall back primary→first-available-fallback; if none resolve, return an
  explicit unresolved result (no silent substitution).

## 5. IPC surface

- [ ] 5.1 Add `ConductorLoadConfig` and `ConductorResolveRole` to the `IPC`
  enum in `electron/ipc/channels.ts`; re-export to the preload allowlist in
  `electron/preload.cjs`.
- [ ] 5.2 Add the request/response payload types to `src/ipc/types.ts`.

## 6. Verification

- [ ] 6.1 Unit tests: valid config loads; malformed config errors with a path;
  missing config generates the default; unknown agent id is rejected; resolver
  honors override > file > defaults and the fallback chain.
- [ ] 6.2 `npm run typecheck` clean (renderer + electron).
- [ ] 6.3 `openspec validate --all --strict` passes.
