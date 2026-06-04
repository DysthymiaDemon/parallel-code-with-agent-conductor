# Conductor Approval Gates Specification

## ADDED Requirements

### Requirement: Approving a dry-run starts the run

When the user approves a dry-run, the app SHALL assign a run id and create the
run directory by invoking the run-directory utility provided by
`add-conductor-artifacts`. This requirement owns the run-start trigger;
`add-conductor-artifacts` owns the directory mechanics. (This split resolves the
circular dependency where artifacts could not own "a run starts" because a run
only starts on approval.)

#### Scenario: Approval creates the run directory

- **WHEN** the user approves a dry-run
- **THEN** a run directory `.parallel-code/artifacts/runs/<run-id>/` is created
- **AND** a run id formatted `run_<YYYYMMDD>_<NNN>` is assigned

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

The app SHALL persist pending gate state in
`.parallel-code/state/pending-gates.json` and SHALL re-present a pending gate
after an app restart rather than auto-rejecting or auto-approving it.

#### Scenario: Pending gate survives a restart

- **WHEN** the app restarts while a gate is pending
- **THEN** the gate is presented again on restart
- **AND** it is not auto-rejected
- **AND** the gated operation has not run

#### Scenario: Gate state is persisted

- **WHEN** a gate becomes pending
- **THEN** its state is written to `.parallel-code/state/pending-gates.json`
- **AND** a resolved gate is removed from that file
