# Conductor Artifacts Specification

## ADDED Requirements

### Requirement: Per-run artifact directory utility

The app SHALL provide a utility that creates a per-run artifact directory at
`.parallel-code/artifacts/runs/<run-id>/` and writes all run artifacts beneath
it. This change **provides** the utility; the run-start trigger that invokes it
lives in `add-conductor-approval-gates` (a run directory is created when the
user approves a dry-run). This split avoids a circular dependency: artifacts
owns the directory mechanics, approval-gates owns the moment a run begins.

Run IDs SHALL be formatted as `run_<YYYYMMDD>_<NNN>` — a zero-padded 3-digit
counter per day (e.g. `run_20260601_001`). The counter is persisted in
`.parallel-code/state/run-counter.json` and resets per calendar day.

#### Scenario: Run directory created by the utility

- **WHEN** the run-directory utility is invoked with id `<run-id>`
- **THEN** the directory `.parallel-code/artifacts/runs/<run-id>/` exists
- **AND** subsequent artifact writes for that run are placed within it

#### Scenario: Run id format and counter

- **WHEN** a run id is assigned on `2026-06-01` and it is the first run that day
- **THEN** the run id is `run_20260601_001`
- **AND** the counter is persisted in `.parallel-code/state/run-counter.json`
- **AND** the next run that day is `run_20260601_002`

### Requirement: Canonical artifact names

The app SHALL write each role's output to a canonical filename, exposed to the
renderer as typed `ArtifactRef`s via `ConductorListArtifacts`.

The typed reference is `ArtifactRef` (the single canonical name — not
`ConductorArtifact`), defined in `src/ipc/types.ts`:

```
ArtifactRef {
  runId: string
  kind: 'plan' | 'accepted-plan' | 'diff' | 'test-report' | 'code-review' | 'ui-review' | 'final-summary'
  path: string             // relative to the artifact run dir
  producedByRole: RoleName
  createdAt: string        // ISO 8601
}
```

Canonical filename ↔ `kind` mapping:

| Filename | `kind` | Produced by |
|---|---|---|
| `plan.md` | `plan` | planner |
| `accepted-plan.md` | `accepted-plan` | (plan-approval gate) |
| `implementation.diff` | `diff` | implementer / fixer |
| `test-report.json` | `test-report` | implementer / fixer |
| `code-review.md` | `code-review` | reviewer |
| `ui-review.md` | `ui-review` | ui_verifier |
| `final-summary.md` | `final-summary` | conductor |

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
