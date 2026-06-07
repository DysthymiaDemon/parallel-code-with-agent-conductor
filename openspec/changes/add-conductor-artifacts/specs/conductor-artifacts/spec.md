# Conductor Artifacts Specification

## ADDED Requirements

### Requirement: Run store allocates artifact identity

The app SHALL create `.parallel-code/artifacts/runs/<run-id>/` using a unique
run ID allocated transactionally by `add-conductor-run-store`. The artifact
layer SHALL NOT maintain a separate run counter or lifecycle store.

#### Scenario: Concurrent run allocation

- **WHEN** two runs start concurrently
- **THEN** the run store assigns distinct run IDs
- **AND** each run writes to a distinct artifact directory

### Requirement: Artifact references are verifiable and provenance-bearing

The canonical `ArtifactRef` SHALL include `runId`, `kind`, relative `path`,
`schemaVersion`, `mediaType`, `digest`, `sizeBytes`, `producedByStepId`,
`producedByAttempt`, `producedBy`, `declaredInputs`, and `createdAt`.
`producedBy` SHALL support a role, `conductor`, or `gate`.

#### Scenario: Artifact is listed

- **WHEN** a step writes a declared artifact
- **THEN** its reference records the content digest and producer attempt
- **AND** a later consumer verifies the digest before use

#### Scenario: Path traversal is rejected

- **WHEN** an artifact write resolves outside its run directory
- **THEN** the write is refused
- **AND** no outside path is modified

### Requirement: Canonical artifacts have one owner

Canonical names SHALL include `plan.md`, `accepted-plan.md`,
`implementation.diff`, `test-report.json`, `code-review.md`, optional
`ui-review.md` and `screenshots/`, and `final-summary.md`. The conductor SHALL
produce `final-summary.md` from completed run records and declared role
artifacts; no role step SHALL directly own that canonical file.

#### Scenario: Final summary is synthesized

- **WHEN** the workflow reaches final review
- **THEN** the conductor writes `final-summary.md`
- **AND** its reference declares the role artifacts used as inputs

### Requirement: Only declared artifacts are handed off

The app SHALL pass only declared, verified artifacts between steps and SHALL
NOT pass raw transcripts as role handoff payloads.

#### Scenario: Missing required input blocks

- **WHEN** a required input is absent or fails verification
- **THEN** the dependent step is blocked
- **AND** execution does not advance silently
