# Conductor Approval Gates Specification

## ADDED Requirements

### Requirement: Approving a dry-run starts the run

When the user approves a dry-run, the app SHALL freeze its immutable approved
manifest, allocate the run transactionally through `add-conductor-run-store`,
and create the run directory through `add-conductor-artifacts`.

#### Scenario: Approval creates the run directory

- **WHEN** the user approves a dry-run
- **THEN** a run directory `.parallel-code/artifacts/runs/<run-id>/` is created
- **AND** a unique run id is assigned transactionally

#### Scenario: Cancel creates no run directory

- **WHEN** the user cancels the dry-run
- **THEN** no run id is assigned
- **AND** no run directory is created

### Requirement: Plan approval before implementation

The app SHALL require explicit human approval of the plan before the
implementer step starts, and SHALL record the approved plan.

#### Scenario: Implementer blocked until plan approved

- **WHEN** a run has produced `plan.md` and reached the plan-approval gate
- **THEN** the implementer step does not start
- **AND** it starts only after the user approves
- **AND** on approval the app records `accepted-plan.md`

#### Scenario: Plan rejected

- **WHEN** the user rejects the plan at the plan-approval gate
- **THEN** the implementer step does not start

#### Scenario: Trust-boundary fallback requires explicit approval

- **WHEN** `security-design.md` declares a model-generated fallback because
  `security-threat-model` was unavailable
- **THEN** writable implementation remains blocked at plan approval
- **AND** baked-in model guardrails alone cannot satisfy or bypass the gate

### Requirement: Final approval requires conductor-synthesized evidence

The app SHALL block final approval until the conductor has synthesized and
verified canonical `final-summary.md` from all required declared artifacts. A
model-authored summary SHALL NOT satisfy this gate.

#### Scenario: Claude review complete but summary absent

- **WHEN** Claude has produced `code-review.md`
- **AND** conductor-owned `final-summary.md` is absent or fails verification
- **THEN** the final-approval gate does not open

### Requirement: Final approval before commit or merge

The app SHALL require explicit human approval before any commit or merge of
conductor work.

#### Scenario: Merge blocked until final approval

- **WHEN** a run reaches the final-approval gate
- **THEN** no commit or merge occurs
- **AND** a commit/merge occurs only after the user approves

### Requirement: Risky operations are gated per policy

The app SHALL block commit, push, merge, package installation, database
migration, and delete operations behind an approval gate when the `approval`
policy enables that gate, and SHALL NOT perform the operation without an
`approved` decision.

#### Scenario: Package install gated

- **WHEN** a step requests a package install
- **AND** `approval.before_package_install` is true
- **THEN** the install is held at a gate
- **AND** proceeds only on an explicit approve

#### Scenario: Push without approval never happens

- **WHEN** any step would push a branch
- **THEN** the push does not occur unless `approval.before_push` is satisfied by
  an explicit approve

### Requirement: Denied protected paths are refused outright

The app SHALL refuse a write classified `deny` by the protected-paths policy
with no approval option, and SHALL raise an approval gate for a write classified
`ask`.

#### Scenario: Denied path cannot be approved

- **WHEN** a write targets a path classified `deny` (e.g. `.env`)
- **THEN** the write is refused
- **AND** no approval option is offered that would allow it
- **AND** the run transitions to `failed` with error detail identifying the
  denied path

#### Scenario: Ask path raises a gate

- **WHEN** a write targets a path classified `ask` (e.g. `package.json`)
- **THEN** an approval gate is raised
- **AND** the write proceeds only on an explicit approve

### Requirement: Unresolved gate leaves the operation undone

The app SHALL treat a gate that is rejected or never resolved as leaving the
gated operation not performed.

#### Scenario: Rejection is safe

- **WHEN** an approval gate is rejected
- **THEN** the gated operation does not run
- **AND** the run does not advance past the gate

### Requirement: Pending gates persist across restarts

The app SHALL persist pending gate state transactionally through
`add-conductor-run-store` and SHALL re-present a pending gate after restart
rather than auto-rejecting or auto-approving it.

#### Scenario: Pending gate survives a restart

- **WHEN** the app restarts while a gate is pending
- **THEN** the gate is presented again on restart
- **AND** it is not auto-rejected
- **AND** the gated operation has not run

#### Scenario: Gate state is persisted

- **WHEN** a gate becomes pending or resolved
- **THEN** its state transition and event commit atomically in the run store

### Requirement: Approved operations execute at most once

Each gate SHALL bind the immutable effect intent defined by
`add-conductor-run-store`. Resolution SHALL transition execution state
atomically and SHALL NOT execute the bound operation more than once. An
ambiguous state after restart SHALL block for recovery rather than retrying.

#### Scenario: Duplicate approval resolution is harmless

- **WHEN** the same gate approval is resolved more than once
- **THEN** the bound operation executes at most once

#### Scenario: Restart during execution blocks ambiguous retry

- **WHEN** the app restarts after a gated operation entered execution but before
  completion was durably recorded
- **THEN** the app does not automatically retry the operation
- **AND** the run enters a recovery-required state

### Requirement: Gates update orthogonal lifecycle fields

The app SHALL update the run store's separate execution, readiness, outcome,
and retry-policy fields rather than an overloaded flat `RunState`.

#### Scenario: Denied path transitions to failed

- **WHEN** a write targets a `deny`-classified protected path
- **THEN** the run's outcome transitions to `failed`

#### Scenario: Pending gate transitions to needs-human

- **WHEN** a gate is raised for any gated operation
- **THEN** the run's execution state transitions to `waiting-human` until the
  gate is resolved

#### Scenario: Review complete transitions to ready-for-review

- **WHEN** a reviewer step completes and produces `code-review.md`
- **THEN** the run's readiness transitions to `ready-for-review`

#### Scenario: Final approval transitions to ready-for-merge

- **WHEN** the user approves the final-approval gate
- **AND** conductor-owned `final-summary.md` and its declared inputs verify
- **THEN** the run's readiness transitions to `ready-for-merge`
