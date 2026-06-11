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

### Requirement: Execution preserves approved installed-CLI subscription routes

The execution adapter SHALL launch the installed official CLI and billing route
frozen in the approved manifest. It SHALL NOT translate a subscription-backed
step into SDK credits, headless credits, API-key billing, cloud credentials,
enterprise credentials, or another provider. Structured interfaces SHALL be
preferred only when they preserve that route.

#### Scenario: Codex subscription execution

- **WHEN** the approved Codex route is managed ChatGPT login
- **THEN** execution uses Codex App Server with that login or the approved
  native interactive Codex PTY fallback
- **AND** never substitutes API-key billing

#### Scenario: Claude subscription execution

- **WHEN** the approved Claude route is subscription OAuth
- **THEN** execution launches native interactive `claude`
- **AND** omits configured Claude API-key variables from the child environment
- **AND** never launches `claude -p` or Agent SDK credits

#### Scenario: Antigravity subscription execution

- **WHEN** the approved Google route is Antigravity account login
- **THEN** execution launches native interactive `agy` using its approved
  native profile
- **AND** never substitutes Gemini CLI or API-key billing

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

Provider-specific native profiles MAY expose only the provider-owned login
facility required by the approved subscription CLI. Such access SHALL be
declared in the manifest, SHALL NOT expose credential values to the conductor,
and SHALL NOT broaden repository, environment, network, or privileged-effect
permissions.

#### Scenario: Read-only profile unavailable

- **WHEN** a planner or reviewer requires a read-only profile
- **AND** the platform cannot enforce it
- **THEN** the step does not launch

#### Scenario: Native subscription login needs provider-owned credential access

- **WHEN** an approved native CLI requires its provider-owned OAuth or keychain
  login facility
- **THEN** the provider-specific native profile grants only that declared login
  access
- **AND** the conductor neither reads nor copies credential values
- **AND** all non-required environment keys and privileged effects remain
  blocked

### Requirement: Run store owns lifecycle and reconciliation

The execution adapter SHALL persist lifecycle transitions, admissions, provider
correlations, and effect results through `add-conductor-run-store`; it SHALL NOT
maintain a separate durable state file.

#### Scenario: Restart during execution

- **WHEN** the app restarts during a step or effect
- **THEN** the adapter reconciles external state against durable intents/events
- **AND** provider or PTY state alone cannot advance the workflow

### Requirement: Step retries are bounded and evidence-grounded

For reversible step attempts, the execution adapter SHALL record external
feedback and failure classification before retry. A retry SHALL remain within
the approved attempt budget and SHALL change inputs, strategy, or
preconditions. Reflection without observed evidence SHALL NOT authorize a
retry. Protected or ambiguous effects SHALL use their gate and reconciliation
requirements instead of this retry path.

#### Scenario: Deterministic check fails

- **WHEN** a reversible step fails a declared deterministic check
- **AND** a changed retry strategy and attempt budget remain
- **THEN** the adapter records the failure evidence and changed strategy
- **AND** it may launch the next attempt

#### Scenario: Retry would repeat the same attempt

- **WHEN** a step has no new evidence, changed strategy, inputs, or preconditions
- **THEN** the adapter does not retry
- **AND** the step stops or escalates according to the approved manifest

### Requirement: Final review advances through conductor synthesis

The execution adapter SHALL advance a completed Claude intent/security review
through conductor-owned final synthesis before final approval. It SHALL verify
all declared evidence inputs, invoke `final-summary.md` synthesis, verify the
resulting artifact, and SHALL NOT launch a model role to produce or replace
canonical `final-summary.md`.

#### Scenario: Claude review completes

- **WHEN** the reviewer produces valid `code-review.md`
- **THEN** the adapter invokes conductor synthesis from verified declared
  artifacts
- **AND** the final-approval gate remains unavailable until canonical
  `final-summary.md` verifies

#### Scenario: Model-authored summary is offered

- **WHEN** a model role offers a file as canonical `final-summary.md`
- **THEN** the adapter refuses it as a workflow input
- **AND** invokes only the conductor-owned synthesis path

### Requirement: Manual task behavior is unchanged

The privileged broker and conductor restrictions SHALL be scoped so existing
non-conductor manual task flows retain their current behavior.

#### Scenario: Manual task launches

- **WHEN** a task is launched outside a conductor run
- **THEN** conductor manifest and gate requirements are not applied to it
