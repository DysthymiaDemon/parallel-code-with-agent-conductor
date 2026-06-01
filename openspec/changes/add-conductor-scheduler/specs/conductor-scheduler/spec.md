# Conductor Scheduler Specification

## ADDED Requirements

### Requirement: Consumer Subscription is the default capacity mode

The app SHALL default to a `consumer_subscription` capacity mode with a target
of 3 active agents and a hard maximum of 6, and SHALL apply this mode whenever
the config does not specify another.

#### Scenario: Default caps applied

- **WHEN** a `ConductorConfig` does not specify a capacity mode
- **THEN** capacity evaluation uses `target_active_agents = 3` and
  `max_active_agents = 6`

### Requirement: Evaluate a planned set of agents against capacity

The app SHALL evaluate a planned set of agents/steps and report whether it fits
within the active caps, which steps would queue, or whether it exceeds the hard
cap. Evaluation is exposed through `ConductorEvaluateCapacity`.

#### Scenario: Plan fits

- **WHEN** a plan requests 3 concurrently-active agents under the default mode
- **THEN** the evaluation result is `fits`
- **AND** no step is queued

#### Scenario: Plan exceeds the hard cap

- **WHEN** a plan requests 7 concurrently-active agents under the default mode
- **THEN** the evaluation result is `exceeds_hard_cap`
- **AND** the result identifies that `max_active_agents` (6) is exceeded

#### Scenario: Per-agent cap queues excess

- **WHEN** a plan requests 3 concurrent `claude` agents
- **AND** `max_parallel_claude` is 1
- **THEN** the evaluation queues the 2nd and 3rd `claude` steps
- **AND** the result records the reason as the per-agent Claude cap

### Requirement: Refuse agent-swarm fan-out under consumer subscription

Under `consumer_subscription`, the app SHALL refuse a plan that requests a
20–30 agent fan-out and SHALL require an explicit switch to a higher-capacity
mode before exceeding the hard cap.

#### Scenario: Large fan-out refused

- **WHEN** a plan requests 20 active agents under `consumer_subscription`
- **THEN** the evaluation result is `exceeds_hard_cap`
- **AND** the result states that an explicit capacity-mode change is required to
  proceed

#### Scenario: Higher mode permits more, still capped

- **WHEN** the active mode is `api_budget` (max 12)
- **AND** a plan requests 10 active agents
- **THEN** the evaluation result is `fits`

### Requirement: Per-role reasoning-effort defaults

The app SHALL assign a default reasoning effort per role — medium for planning,
implementation, and review roles; low for routine fixer, UI-verifier, and
tester roles — and SHALL mark high/maximum effort as requiring approval.

#### Scenario: Routine role defaults to low effort

- **WHEN** capacity is evaluated for a step whose role is `ui_verifier` or
  `fixer`
- **THEN** the result assigns that step `effort: low`

#### Scenario: Planning role defaults to medium effort

- **WHEN** capacity is evaluated for a step whose role is `planner`,
  `implementer`, or `reviewer`
- **THEN** the result assigns that step `effort: medium`

#### Scenario: High effort requires approval

- **WHEN** a step requests high or maximum reasoning effort
- **THEN** the evaluation marks that step as `effort_approval_required`
