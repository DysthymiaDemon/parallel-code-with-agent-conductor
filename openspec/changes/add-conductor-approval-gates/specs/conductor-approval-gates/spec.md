# Conductor Approval Gates Specification

## ADDED Requirements

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
