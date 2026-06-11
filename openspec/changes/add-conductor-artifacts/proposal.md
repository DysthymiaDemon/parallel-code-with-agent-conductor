## Why

Roles must exchange bounded, verifiable artifacts rather than transcripts.
Artifact identity and provenance must also survive restart and retries.

## What Changes

- Store run artifacts beneath `.parallel-code/artifacts/runs/<run-id>/`.
- Use run IDs allocated transactionally by `add-conductor-run-store`.
- Define canonical filenames and content-addressed `ArtifactRef` metadata.
- Permit only declared artifact inputs and outputs.
- Add explicit secure-design, repository-validation, and deterministic
  security-check evidence artifacts.
- Make the conductor the sole producer of the canonical `final-summary.md`,
  synthesized from verified evidence after Claude review and before final human
  approval.

## Capabilities

### New Capabilities

- `conductor-artifacts`: Structured, provenance-bearing run artifacts and
  artifacts-only handoff.

## Impact

- **Code:** `electron/conductor/artifacts.ts`, renderer viewer helper, and
  artifact IPC payloads.
- **Depends on:** `add-conductor-config`, `add-conductor-run-store`.
- **Filesystem:** generated files under `.parallel-code/artifacts/runs/`.
