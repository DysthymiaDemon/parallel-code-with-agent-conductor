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
- [ ] 2.3 Treat a **missing** `conductor.yaml` as an in-memory default with no
      filesystem write, and a **malformed** one as a hard error (never
      silent-fallback to defaults).

## 3. Default preset generation

- [ ] 3.1 Provide **Ameen's Default — Subscription Aware** in memory when no
      config exists: roles `planner→claude-code`, `implementer→codex`,
      `reviewer→claude-code`, `ui_verifier→antigravity` (fallback `gemini`),
      `fixer→codex`; capacity `mode: consumer_conservative`,
      `target_active_agents: 3`, `max_active_agents: 6`, `default_effort: medium`.
- [ ] 3.2 Never overwrite an existing committed `conductor.yaml`/`roles.yaml`.
- [ ] 3.3 Add narrow rules and negations to the **root** `.gitignore` so
      committed config (`conductor.yaml`, `roles.yaml`, `workflows/`, `policies/`)
      is trackable while runtime `state/`, `artifacts/`, and `agents/` remain
      ignored. Verify with `git add -An`; a nested `.parallel-code/.gitignore`
      cannot rescue a directory already ignored by the root.
- [ ] 3.4 Provide the following protected-path policy in memory when its file
      is absent; persist it only through an explicit initialize action:
  ```yaml
  deny_write:
    - .env
    - .env.*
    - secrets/**
    - credentials/**
  ask_before_write:
    - package.json
    - package-lock.json
    - migrations/**
  ```

## 4. Role resolver

- [ ] 4.1 Add `electron/conductor/roles.ts` resolving a role to a concrete agent
      with precedence: conduct-request override → `roles.yaml` (overlay) →
      `conductor.yaml` → built-in defaults.
- [ ] 4.2 Fall back primary→first-available-fallback; if none resolve, return an
      explicit unresolved result (no silent substitution).

## 5. IPC surface

- [ ] 5.1 Add `ConductorLoadConfig` (`'conductor_load_config'`),
      `ConductorValidateConfig` (`'conductor_validate_config'`),
      `ConductorSaveConfig` (`'conductor_save_config'`), and `ConductorResolveRole`
      (`'conductor_resolve_role'`) to the `IPC` enum in
      `electron/ipc/channels.ts`; re-export to the preload allowlist in
      `electron/preload.cjs`.
- [ ] 5.2 Add the request/response payload types to `src/ipc/types.ts`.

## 6. Verification

- [ ] 6.1 Unit tests: valid config loads; malformed config errors with a path;
      missing config returns defaults without writing; explicit initialize persists
      missing files without overwriting; unknown agent id is rejected; resolver
      honors override > file > defaults and the fallback chain.
- [ ] 6.2 `npm run typecheck` clean (renderer + electron).
- [ ] 6.3 `openspec validate --all --strict` passes.
