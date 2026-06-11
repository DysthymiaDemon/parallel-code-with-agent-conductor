# Conductor Scheduler Specification

## ADDED Requirements

### Requirement: Consumer Conservative is the default capacity mode

The app SHALL default to a `consumer_conservative` capacity mode with a target
of 3 active agents and a hard maximum of 6, and SHALL apply this mode whenever
the config does not specify another. These limits SHALL be described as
user-configured local safety policy, not measured provider entitlement.

#### Scenario: Default caps applied

- **WHEN** a `ConductorConfig` does not specify a capacity mode
- **THEN** capacity evaluation uses `target_active_agents = 3` and
  `max_active_agents = 6`

### Requirement: Evaluate a planned set of agents against capacity

The app SHALL evaluate a planned set of agents/steps and report whether it fits
within the active caps, which steps would queue, or whether it exceeds the hard
cap. Evaluation is exposed through `ConductorCheckCapacity`.

#### Scenario: Plan fits

- **WHEN** a plan requests 3 concurrently-active agents under the default mode
- **THEN** the evaluation result is `fits`
- **AND** no step is queued

#### Scenario: Plan exceeds the hard cap

- **WHEN** a plan requests 7 concurrently-active agents under the default mode
- **THEN** the evaluation result is `exceeds_hard_cap`
- **AND** the result identifies that `max_active_agents` (6) is exceeded

#### Scenario: Per-agent cap queues excess

- **WHEN** a plan requests 3 concurrent `claude-code` agents
- **AND** `max_parallel_claude_code` is 1
- **THEN** the evaluation queues the 2nd and 3rd `claude-code` steps
- **AND** the result records the reason as the per-agent Claude cap

### Requirement: Refuse agent-swarm fan-out under conservative mode

Under `consumer_conservative`, the app SHALL refuse a plan that requests a
20–30 agent fan-out. No higher-capacity mode is selectable in the MVP.

#### Scenario: Large fan-out refused

- **WHEN** a plan requests 20 active agents under `consumer_conservative`
- **THEN** the evaluation result is `exceeds_hard_cap`
- **AND** the result states that no supported MVP mode permits it

#### Scenario: Exceeding the hard cap requires an out-of-scope mode change

- **WHEN** a plan requests more than 6 active agents under `consumer_conservative`
- **THEN** the evaluation result is `exceeds_hard_cap`
- **AND** no higher mode is selectable in the MVP: only `consumer_conservative` is
  enabled, and `api_budget` / `enterprise_or_research` are reserved future modes
  (out of MVP scope per `Goal.md`)

### Requirement: Provider backpressure reduces admission

The app SHALL consume secret-safe backpressure and rate-limit metadata exposed
by an agent adapter and SHALL pause admission for an affected provider. Missing
or unknown provider capacity SHALL NOT be interpreted as spare capacity.

#### Scenario: Provider reports limit reached

- **WHEN** an adapter reports that its provider is rate limited
- **THEN** queued steps for that provider remain queued
- **AND** unrelated providers may continue within the local caps

### Requirement: Per-role reasoning-effort defaults

The app SHALL assign a default reasoning effort per role — medium for planning,
validation, implementation, and review roles; low for routine fixer,
UI-verifier, and tester roles — and SHALL mark high/maximum effort as requiring
approval.

#### Scenario: Routine role defaults to low effort

- **WHEN** capacity is evaluated for a step whose role is `ui_verifier`,
  `tester`, or `fixer`
- **THEN** the result assigns that step `effort: low`

#### Scenario: Planning role defaults to medium effort

- **WHEN** capacity is evaluated for a step whose role is `planner`,
  `validator`, `implementer`, or `reviewer`
- **THEN** the result assigns that step `effort: medium`

#### Scenario: High effort requires approval

- **WHEN** a step requests high or maximum reasoning effort
- **THEN** the evaluation marks that step as `effort_approval_required`
