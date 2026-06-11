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
`security-design.md`, `repository-validation.md`, `implementation.diff`,
`test-report.json`, `security-check-report.json`, `code-review.md`, optional
`ui-review.md` and `screenshots/`, and `final-summary.md`. The conductor SHALL
produce `final-summary.md` from completed run records and verified declared role
artifacts after review and before final approval; no role step SHALL directly
own or write that canonical file.

#### Scenario: Final summary is synthesized

- **WHEN** the workflow completes Claude intent/security review
- **THEN** the conductor writes `final-summary.md`
- **AND** its reference declares the role artifacts used as inputs
- **AND** final approval remains blocked until the summary and all declared
  inputs verify successfully

#### Scenario: Model role attempts to write final summary

- **WHEN** any planner, validator, implementer, tester, fixer, reviewer, or UI
  verifier attempts to write canonical `final-summary.md`
- **THEN** the artifact layer refuses the write
- **AND** canonical summary ownership remains with the conductor

### Requirement: Security evidence is explicit and provenance-bearing

`security-design.md` SHALL identify whether it was produced with
`security-threat-model` or as a labeled model fallback. A fallback SHALL contain
trust boundaries, assets, attackers, abuse cases, mitigations, and residual
risks. `repository-validation.md` SHALL record Codex's implementability
findings. `security-check-report.json` SHALL record deterministic security
checks and results. Baked-in model guardrails alone SHALL NOT be represented as
security evidence.

#### Scenario: Guardrails offered without security artifact

- **WHEN** a trust-boundary workflow provides model guardrails but no valid
  `security-design.md`
- **THEN** artifact validation fails
- **AND** the workflow cannot advance to plan approval

### Requirement: Final summary synthesizes verified evidence

The conductor-owned `final-summary.md` SHALL summarize the secure design,
approved plan, Codex repository validation, implementation diff, deterministic
test and security-check results, evidence-grounded fixes, Claude
intent/security review, unresolved risks, and pending or resolved human
decisions. It SHALL reference verified artifact digests and SHALL NOT use raw
transcripts.

#### Scenario: Required evidence is missing

- **WHEN** final synthesis lacks a required declared artifact or its digest
  fails verification
- **THEN** the conductor does not produce canonical `final-summary.md`
- **AND** final approval remains blocked

### Requirement: Only declared artifacts are handed off

The app SHALL pass only declared, verified artifacts between steps and SHALL
NOT pass raw transcripts as role handoff payloads.

#### Scenario: Missing required input blocks

- **WHEN** a required input is absent or fails verification
- **THEN** the dependent step is blocked
- **AND** execution does not advance silently
