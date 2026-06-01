# Conductor Artifacts Specification

## ADDED Requirements

### Requirement: Per-run artifact directory

The app SHALL create a per-run artifact directory at
`.parallel-code/artifacts/runs/<run-id>/` when a conductor run starts, and SHALL
write all run artifacts beneath it.

#### Scenario: Run directory created

- **WHEN** a conductor run with id `<run-id>` starts
- **THEN** the directory `.parallel-code/artifacts/runs/<run-id>/` exists
- **AND** subsequent artifact writes for that run are placed within it

### Requirement: Canonical artifact names

The app SHALL write each role's output to a canonical filename, exposed to the
renderer as typed `ArtifactRef`s via `ConductorListArtifacts`.

#### Scenario: Planner artifact

- **WHEN** the planner role writes its output for a run
- **THEN** it is stored as `plan.md` in the run directory
- **AND** `ConductorListArtifacts` returns an `ArtifactRef` of kind `plan` for
  that path

#### Scenario: Implementer artifacts

- **WHEN** the implementer role completes
- **THEN** its diff is stored as `implementation.diff`
- **AND** its test results are stored as `test-report.json`

#### Scenario: Reviewer and final artifacts

- **WHEN** the reviewer role completes
- **THEN** its output is stored as `code-review.md`
- **AND** the final summary is stored as `final-summary.md`

### Requirement: Artifacts, not transcripts, are handed off

The app SHALL pass declared artifacts between steps and SHALL NOT use raw chat
transcripts as the handoff payload between roles.

#### Scenario: Reviewer consumes declared inputs

- **WHEN** the reviewer step starts
- **THEN** it is given the `accepted-plan.md`, `implementation.diff`, and
  `test-report.json` artifacts as inputs
- **AND** it is not given the implementer's full chat transcript as the handoff
  payload

### Requirement: Missing required artifact blocks a dependent step

The app SHALL verify that every required input artifact exists before a
dependent step starts, and SHALL block the step when a required artifact is
missing rather than silently skipping it.

#### Scenario: Required input missing

- **WHEN** a step declares `implementation.diff` as a required input
- **AND** that artifact does not exist in the run directory
- **THEN** the step is blocked
- **AND** the run does not advance past it silently

#### Scenario: Optional artifact may be absent

- **WHEN** a step declares `ui-review.md` as an optional input
- **AND** that artifact does not exist
- **THEN** the step is not blocked on that artifact's absence
