# Conductor Execution Adapter Specification

## ADDED Requirements

### Requirement: Execution uses the approved manifest

The app SHALL execute only the immutable approved run manifest loaded from the
run store and SHALL verify its digest before launch.

#### Scenario: Config changes after approval

- **WHEN** mutable config changes after approval
- **THEN** the active run continues from the approved manifest
- **AND** execution does not silently adopt the change

### Requirement: Steps launch through capable provider adapters

Each step SHALL launch through its selected `AgentAdapter`. The adapter SHALL
meet every capability required by the approved manifest; otherwise launch SHALL
fail closed. Structured interfaces SHALL be preferred over PTY fallback.

#### Scenario: PTY fallback lacks a required capability

- **WHEN** a PTY fallback cannot provide a capability required by the step
- **THEN** the step does not launch
- **AND** the unsupported capability is recorded

### Requirement: Privileged effects are brokered at final entrypoints

The app SHALL execute conductor file writes, Git mutations, installs,
migrations, deletes, pushes, and remote mutations only through a
privileged-operation broker. The broker SHALL require a persisted immutable
effect intent, valid run/sender authorization, expected-state match, policy
result, and required approval. Prompts and adapter flags SHALL NOT be treated as
the enforcement boundary.

#### Scenario: Autonomous landing is attempted

- **WHEN** a conductor agent or provider attempts to commit or land without an
  authorized effect intent
- **THEN** the final backend entrypoint refuses the operation
- **AND** no commit or merge occurs

#### Scenario: Duplicate or ambiguous effect

- **WHEN** an effect may already have executed or its expected state changed
- **THEN** the broker does not blindly retry it
- **AND** the operation enters reconciliation or human recovery

### Requirement: Conductor roles run in enforceable sandbox profiles

The app SHALL launch conductor roles with explicit macOS/Linux sandbox profiles,
canonical path controls, separately scoped artifact access, and minimal
allowlisted child environments. Read-only roles SHALL have no writable
repository view. If a required profile cannot be enforced, launch SHALL fail.
A worktree SHALL NOT be described as filesystem containment.

#### Scenario: Read-only profile unavailable

- **WHEN** a planner or reviewer requires a read-only profile
- **AND** the platform cannot enforce it
- **THEN** the step does not launch

### Requirement: Run store owns lifecycle and reconciliation

The execution adapter SHALL persist lifecycle transitions, admissions, provider
correlations, and effect results through `add-conductor-run-store`; it SHALL NOT
maintain a separate durable state file.

#### Scenario: Restart during execution

- **WHEN** the app restarts during a step or effect
- **THEN** the adapter reconciles external state against durable intents/events
- **AND** provider or PTY state alone cannot advance the workflow

### Requirement: Manual task behavior is unchanged

The privileged broker and conductor restrictions SHALL be scoped so existing
non-conductor manual task flows retain their current behavior.

#### Scenario: Manual task launches

- **WHEN** a task is launched outside a conductor run
- **THEN** conductor manifest and gate requirements are not applied to it
