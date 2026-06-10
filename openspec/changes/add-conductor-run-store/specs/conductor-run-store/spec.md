# Conductor Run Store Specification

## ADDED Requirements

### Requirement: Conductor control state is transactional

The app SHALL persist conductor runs, steps, queue entries, operations,
approvals, artifact metadata, and schema version in one transactional local
control store. A state transition and its corresponding append-only event SHALL
commit atomically.

#### Scenario: Crash during state transition

- **WHEN** the app crashes before a state-transition transaction commits
- **THEN** neither the event nor its materialized projection is visible
- **AND** the store does not expose mutually inconsistent partial state

### Requirement: Run history is append-only and versioned

Each durable transition SHALL record a versioned append-only event containing a
unique event id, event type, run id, sequence, occurrence time, actor,
correlation/causation identifiers, and a payload digest.

#### Scenario: Projection can be replayed

- **WHEN** the current run projection is rebuilt from its ordered events
- **THEN** the rebuilt lifecycle and operation state matches the persisted
  projection

### Requirement: External effects use durable intents

Before an external effect is attempted, the app SHALL persist an immutable
effect intent with a unique operation id, bound parameters, expected-state
digest, and reconciliation class. After restart, ambiguous effects SHALL be
reconciled before retry and non-reconcilable ambiguity SHALL require human
recovery.

#### Scenario: Restart after effect begins

- **WHEN** the app restarts after an effect began but before completion was
  durably recorded
- **THEN** the app does not blindly repeat the effect
- **AND** the operation enters recovery pending reconciliation

### Requirement: Run lifecycle fields are orthogonal

The app SHALL model phase, execution state, outcome, readiness, and retry policy
as separate fields rather than one overloaded flat state union.

#### Scenario: Waiting for approval

- **WHEN** an executing run reaches a human gate
- **THEN** its execution state is `waiting-human`
- **AND** its outcome and readiness remain independently representable

### Requirement: Attempt feedback and retry rationale are durable

The app SHALL persist each conductor step attempt, its declared evaluator,
observed external feedback, failure classification, retry decision, changed
strategy or preconditions, attempt budget, and stop or escalation reason.

#### Scenario: Failed step is retried

- **WHEN** a failed reversible step is admitted for another attempt
- **THEN** the prior attempt evidence and changed retry rationale are durable
- **AND** replay reconstructs the same retry decision

### Requirement: Approved run manifest is immutable

Approving a dry-run SHALL persist an immutable versioned run manifest containing
the selected workflow, resolved roles/adapters, effective config and policy
digests, planned steps, permissions, gates, artifact contracts, and manifest
digest. For retry-capable steps it SHALL also contain the evaluator, attempt
budget, and stop or escalation condition. Execution SHALL use that approved
manifest.

#### Scenario: Config changes after approval

- **WHEN** config changes after a dry-run was approved
- **THEN** the active run continues from its approved manifest
- **AND** the changed config does not silently alter the run
