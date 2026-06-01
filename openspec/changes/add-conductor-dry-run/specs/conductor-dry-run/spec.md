# Conductor Dry-Run Specification

## ADDED Requirements

### Requirement: Deterministic task classification

The app SHALL map a described task to a workflow using deterministic rules, and
SHALL prefer an explicit `--workflow=` override over classification. The result
SHALL report which signals drove the selection.

#### Scenario: UI task selects ui-build-verify

- **WHEN** a `/conduct` task contains UI signals (e.g. "responsive onboarding
  screen")
- **THEN** the classifier selects the `ui-build-verify` workflow
- **AND** the result lists the matched UI signals

#### Scenario: Backend task selects plan-implement-review

- **WHEN** a `/conduct` task has no UI signals (e.g. "fix the login token
  refresh bug")
- **THEN** the classifier selects the `plan-implement-review` workflow

#### Scenario: Explicit workflow override wins

- **WHEN** a `/conduct` task passes `--workflow=plan-implement-review`
- **AND** the task text would otherwise classify as `ui-build-verify`
- **THEN** the selected workflow is `plan-implement-review`

### Requirement: Dry-run preview without side effects

When invoked with `--dry-run`, the app SHALL produce a preview of the planned
run and SHALL NOT launch any agent, create any worktree, or write any project
file. The preview is produced through the `ConductorDryRun` IPC channel.

#### Scenario: Preview contents

- **WHEN** the renderer sends `ConductorDryRun` for a task
- **THEN** the result includes the selected workflow, the role→agent
  assignments, the planned worktree paths, the required permissions, the
  expected artifacts, the capacity plan, and any auth warnings

#### Scenario: No side effects during dry run

- **WHEN** `ConductorDryRun` completes
- **THEN** no agent process has been spawned
- **AND** no directory has been created under `.worktrees/`
- **AND** no file has been written under the project working tree

### Requirement: Role overrides apply before resolution

The app SHALL apply command-line role overrides before resolving roles to
agents in the preview.

#### Scenario: Implementer override changes the assignment

- **WHEN** a `/conduct` task passes `--implementer=codex`
- **AND** the config binds `implementer→claude`
- **THEN** the preview's `implementer` assignment is `codex`

### Requirement: Explicit approval gate before proceeding

The app SHALL require an explicit approve or cancel decision after the preview,
and a cancel SHALL leave the system unchanged.

#### Scenario: Cancel leaves no trace

- **WHEN** the user cancels after viewing a dry-run preview
- **THEN** no run is started
- **AND** no worktree, artifact directory, or agent process is created

#### Scenario: Approval is required to advance

- **WHEN** a dry-run preview is shown
- **THEN** the run does not advance to execution until the user explicitly
  approves it
