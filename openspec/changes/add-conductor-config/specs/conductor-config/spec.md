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

### Requirement: Missing config generates the default preset

When a project has no `.parallel-code/conductor.yaml`, the app SHALL generate
one containing the **Ameen's Default — Subscription Aware** preset rather than
treating the absence as an error.

#### Scenario: First load on a project without config

- **WHEN** the renderer sends `ConductorLoadConfig` for a project that has no
  `.parallel-code/conductor.yaml`
- **THEN** the main process writes a default `conductor.yaml` binding
  `planner→claude`, `implementer→codex`, `reviewer→claude`,
  `ui_verifier→google_visual`, and `fixer→codex`
- **AND** the generated capacity block sets `mode: consumer_subscription`,
  `target_active_agents: 3`, `max_active_agents: 6`, and `default_effort: medium`
- **AND** the returned `ConductorConfig` reflects that generated file

#### Scenario: Defaulting never overwrites committed config

- **WHEN** a `.parallel-code/conductor.yaml` already exists
- **THEN** the app does not overwrite or regenerate it
- **AND** the existing file's contents are loaded as-is

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
precedence: explicit command override, then `conductor.yaml`, then `roles.yaml`,
then built-in defaults. Resolution SHALL be exposed through the
`ConductorResolveRole` IPC channel and SHALL never silently substitute an agent
the configuration did not specify.

#### Scenario: Command override wins

- **WHEN** the renderer sends `ConductorResolveRole` for `implementer` with an
  override `codex`
- **AND** `conductor.yaml` binds `implementer→claude`
- **THEN** the resolver returns `codex`

#### Scenario: Config used when no override

- **WHEN** `ConductorResolveRole` is sent for `planner` with no override
- **AND** `conductor.yaml` binds `planner→claude`
- **THEN** the resolver returns `claude`

#### Scenario: Fallback when primary unavailable

- **WHEN** a role's primary agent is not present in the registry
- **AND** a fallback agent is present
- **THEN** the resolver returns the first available fallback

#### Scenario: No resolvable agent

- **WHEN** neither the primary nor any fallback for a role is present in the
  registry
- **THEN** the resolver returns an explicit unresolved result for that role
- **AND** does not substitute an unrelated agent
