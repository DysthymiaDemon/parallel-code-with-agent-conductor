# Conductor Config Specification

## ADDED Requirements

### Requirement: Locate and load project-local conductor config

The app SHALL read durable conductor configuration from
`.parallel-code/conductor.yaml` resolved relative to the selected project root,
and SHALL overlay an optional `.parallel-code/roles.yaml` when present. Loading
SHALL be exposed to the renderer through the `ConductorLoadConfig` IPC channel.

#### Scenario: Config present and well-formed

- **WHEN** the renderer sends `ConductorLoadConfig` for a project whose
  `.parallel-code/conductor.yaml` parses successfully
- **THEN** the main process returns a `ConductorConfig` with the project,
  agents, roles, workflow, worktrees, approval, authPolicy, and capacity blocks
  populated from the file
- **AND** if `.parallel-code/roles.yaml` exists, its role bindings overlay the
  ones from `conductor.yaml`

#### Scenario: roles.yaml absent

- **WHEN** `conductor.yaml` is present and `roles.yaml` is absent
- **THEN** the returned config uses only the `conductor.yaml` role bindings
- **AND** no error is raised for the missing overlay file

### Requirement: Missing config resolves to an in-memory default without writing

When a project has no `.parallel-code/conductor.yaml`, the app SHALL resolve the
effective config to the **Ameen's Default — Subscription Aware** preset
**in memory** and SHALL NOT write any file as a side effect of loading. Loading
never treats absence as an error. Persisting the default to disk is a separate,
explicit action (see the next requirement) so that read-only/preview flows such
as the dry-run produce no filesystem side effects.

#### Scenario: First load on a project without config writes nothing

- **WHEN** the renderer sends `ConductorLoadConfig` for a project that has no
  `.parallel-code/conductor.yaml`
- **THEN** the returned `ConductorConfig` is the in-memory default binding
  `planner→claude-code`, `validator→codex`, `implementer→codex`,
  `tester→codex`, `reviewer→claude-code`, `ui_verifier→antigravity`, and
  `fixer→codex`
- **AND** the capacity block is `mode: consumer_conservative`,
  `target_active_agents: 3`, `max_active_agents: 6`, `default_effort: medium`
- **AND** the auth policy is `mode: subscription_only`, excludes detected API
  keys from child environments, and never switches billing route
- **AND** no file is written under `.parallel-code/` or the project working tree

#### Scenario: Existing committed config is loaded as-is

- **WHEN** a `.parallel-code/conductor.yaml` already exists
- **THEN** the app does not overwrite or regenerate it
- **AND** the existing file's contents are loaded as-is

### Requirement: Persisting the default config is explicit, never implicit

The app SHALL write the default `conductor.yaml` (and any missing
workflow/policy presets) only in response to an explicit initialize action,
exposed through `ConductorSaveConfig`. Approving or starting a run SHALL
continue using the resolved in-memory config and SHALL NOT persist defaults as a
side effect. When initialization writes, it SHALL NOT overwrite an existing
committed file.

#### Scenario: Dry-run preview on an unconfigured project writes nothing

- **WHEN** a dry-run preview is built for a project that has no
  `.parallel-code/conductor.yaml`
- **THEN** the preview uses the in-memory default config
- **AND** no `conductor.yaml`, workflow, or policy file is written

#### Scenario: Explicit initialize persists the default

- **WHEN** the user explicitly initializes conductor config
- **THEN** the app writes `conductor.yaml` with the Ameen's Default preset
- **AND** it does not overwrite an existing committed `conductor.yaml`

#### Scenario: Run approval does not initialize config

- **WHEN** the user approves a run in a project with no persisted conductor
  config
- **THEN** the run uses the resolved in-memory defaults
- **AND** no config, workflow, or policy file is written by the approval

### Requirement: Invalid config fails loudly, never silently

The app SHALL reject a malformed or semantically invalid `conductor.yaml` with a
single actionable error identifying the offending path, and SHALL NOT silently
fall back to defaults when the file exists but is invalid.

#### Scenario: Malformed YAML

- **WHEN** `conductor.yaml` exists but does not parse as YAML
- **THEN** `ConductorLoadConfig` returns an error result whose message
  identifies the file and the parse failure
- **AND** no default config is generated to mask the error

#### Scenario: Role bound to an unknown agent

- **WHEN** a role's `primary` or a `fallback` entry names an id that is not in
  the agent registry (`AgentDef` list)
- **THEN** validation fails with a message of the form
  `roles.<role>.<field>: unknown agent '<id>'`
- **AND** the config is not returned as valid

#### Scenario: Invalid enum value

- **WHEN** a role `mode` or the capacity `mode` holds a value outside its
  allowed set
- **THEN** validation fails identifying the dotted path and the allowed values

### Requirement: Deterministic role resolution with precedence

The app SHALL resolve a workflow role to a concrete registered agent using the
precedence: explicit conduct-request override → `roles.yaml` (overlay) →
`conductor.yaml` (base) → built-in defaults. `roles.yaml` acts as an overlay: a
binding it defines replaces the entire corresponding binding from `conductor.yaml`
rather than merging with it. Resolution SHALL be exposed through the
`ConductorResolveRole` IPC channel and SHALL never silently substitute an agent
the configuration did not specify.

#### Scenario: Command override wins

- **WHEN** the renderer sends `ConductorResolveRole` for `implementer` with an
  override `codex`
- **AND** `conductor.yaml` binds `implementer→claude-code`
- **THEN** the resolver returns `codex`

#### Scenario: Config used when no override and no roles.yaml

- **WHEN** `ConductorResolveRole` is sent for `planner` with no override
- **AND** no `roles.yaml` is present
- **AND** `conductor.yaml` binds `planner→claude-code`
- **THEN** the resolver returns `claude-code`

#### Scenario: Fallback when primary unavailable

- **WHEN** a role's registered primary agent has no available compatible adapter
- **AND** a registered fallback agent has an available compatible adapter
- **THEN** the resolver returns the first available fallback

#### Scenario: No resolvable agent

- **WHEN** neither the registered primary nor any registered fallback for a role
  has an available compatible adapter
- **THEN** the resolver returns an explicit unresolved result for that role
- **AND** does not substitute an unrelated agent

### Requirement: roles.yaml overlay takes priority over conductor.yaml

When `.parallel-code/roles.yaml` is present, the app SHALL replace, not merge,
its entries into the corresponding role bindings from `conductor.yaml`.
`roles.yaml` has higher precedence than `conductor.yaml` in the resolution
chain: conduct-request override → roles.yaml → conductor.yaml → built-in
defaults.

#### Scenario: roles.yaml entry replaces conductor.yaml entry

- **WHEN** `roles.yaml` contains a role entry that also exists in
  `conductor.yaml`
- **THEN** the `roles.yaml` entry replaces the entire role binding (not a
  field-level merge)
- **AND** any fields present in the `conductor.yaml` entry but absent from the
  `roles.yaml` entry are not carried forward

#### Scenario: Unknown agent in roles.yaml fails validation

- **WHEN** `roles.yaml` references an agent id not present in the `AgentDef`
  registry
- **THEN** validation fails with a clear error naming the unknown id and the
  roles.yaml file
- **AND** the config is not returned as valid

---

## TypeScript Contract

All conductor types are defined in `src/ipc/types.ts` (augmenting the existing
file). **Do not create a separate `src/ipc/conductor-types.ts`.** Keeping all
IPC types in one file ensures they remain discoverable.

```typescript
type RoleName =
  | 'planner'
  | 'validator'
  | 'implementer'
  | 'tester'
  | 'reviewer'
  | 'ui_verifier'
  | 'fixer';
type AgentId = string; // must exist in electron/ipc/agents.ts AgentDef registry

interface RoleBinding {
  roleId: RoleName;
  primary: AgentId;
  fallback?: AgentId;
  mode?: 'plan' | 'validate' | 'implement' | 'test' | 'review' | 'verify' | 'fix';
  purpose?: string;
}

interface CapacityConfig {
  // Field names mirror the YAML keys 1:1 to avoid the target/hard-cap ambiguity.
  mode: 'consumer_conservative'; // YAML: mode (only selectable MVP value)
  targetActiveAgents: number; // YAML: target_active_agents, default 3 (soft target)
  maxActiveAgents: number; // YAML: max_active_agents,    default 6 (hard cap)
  defaultEffort: 'low' | 'medium' | 'high'; // YAML: default_effort, default 'medium'
}

interface AuthPolicy {
  mode: 'subscription_only'; // only selectable MVP value
  warnOnApiKeys: boolean;
  preferSubscriptionAuth: boolean; // default true
  blockApiKeysUnlessExplicit: boolean; // default true
  excludeDetectedApiKeys: boolean; // default true
  neverSwitchBillingRoute: boolean; // default true
  codexPreferredLogin: 'chatgpt';
  claudePreferredLogin: 'subscription_oauth';
  googlePreferredLogin: 'antigravity_account';
  envApiKeys: string[];
}

interface ApprovalConfig {
  requirePlanApproval: boolean; // default true
  requireMergeApproval: boolean; // default true
  requireFixApproval: boolean; // default true
  requirePackageInstallApproval: boolean; // default true
  requireMigrationApproval: boolean; // default true
  requirePushApproval: boolean; // default true
  blockOnDenyPath: boolean; // default true
  persistGatesAcrossRestarts: boolean; // default true
  beforeFirstWrite: boolean; // default false
  beforeCommit: boolean; // default true
  beforeMerge: boolean; // default true
  beforePush: boolean; // default true
  beforePackageInstall: boolean; // default true
  beforeDatabaseMigration: boolean; // default true
  beforeDelete: boolean; // default true
  beforeTouchingProtectedPaths: boolean; // default true
}

interface WorktreeConfig {
  baseDir: string; // default '.worktrees' (matches existing project convention)
  branchPrefix: string; // default 'conductor'
}

interface ConductorConfig {
  schemaVersion: '1';
  project: { name: string };
  agents: {
    roles: RoleBinding[];
    capacity: CapacityConfig;
    authPolicy: AuthPolicy;
  };
  workflows: { presets: string[] };
  worktrees: WorktreeConfig;
  approval: ApprovalConfig;
}
```

## IPC Channel Names

New channels use the `Conductor*` prefix exclusively. The existing
`SetCoordinatorModeEnabled` and `MCP_*` channels in
`electron/ipc/channels.ts` belong to the separate `coordinator-mcp-backend`
OpenSpec change and must not be modified.

| Enum member               | String value                  |
| ------------------------- | ----------------------------- |
| `ConductorLoadConfig`     | `'conductor_load_config'`     |
| `ConductorValidateConfig` | `'conductor_validate_config'` |
| `ConductorSaveConfig`     | `'conductor_save_config'`     |
| `ConductorResolveRole`    | `'conductor_resolve_role'`    |
