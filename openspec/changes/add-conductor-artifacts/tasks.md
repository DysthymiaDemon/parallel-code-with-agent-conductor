## 1. Artifact store

- [ ] 1.1 Add `electron/conductor/artifacts.ts` providing a utility that creates
  `.parallel-code/artifacts/runs/<run-id>/`. The run-start trigger lives in
  `add-conductor-approval-gates` (invoked on dry-run approval); this change
  provides the directory mechanics only. Assign run ids as
  `run_<YYYYMMDD>_<NNN>` (zero-padded 3-digit per-day counter persisted in
  `.parallel-code/state/run-counter.json`).
- [ ] 1.2 Define canonical artifact names/paths: `plan.md`, `accepted-plan.md`,
  `implementation.diff`, `test-report.json`, `code-review.md`,
  `final-summary.md`, and optional `ui-review.md` + `screenshots/`.
- [ ] 1.3 Define an `ArtifactRef` type (`runId`, `kind`, `path`,
  `producedByRole`, `createdAt`) in `src/ipc/types.ts` — the single canonical
  name; do not introduce `ConductorArtifact`.

## 2. Handoff contract

- [ ] 2.1 Provide read/write helpers so a step writes its declared output
  artifacts and reads only the declared input artifacts of prior steps.
- [ ] 2.2 Validate that every required input artifact for a step exists before
  the step is allowed to start; a missing required artifact blocks the step.
- [ ] 2.3 Do not pass raw chat transcripts as handoff payloads.

## 3. IPC surface

- [ ] 3.1 Add `ConductorWriteArtifact` (`'conductor_write_artifact'`) and
  `ConductorListArtifacts` (`'conductor_list_artifacts'`) to the `IPC` enum and
  preload allowlist.
- [ ] 3.2 Add payload types to `src/ipc/types.ts`.
- [ ] 3.3 Add a `src/conductor/artifacts.ts` renderer helper for an artifact
  list/viewer.

## 4. Verification

- [ ] 4.1 Unit tests: starting a run creates the run dir; writing an artifact
  produces the canonical filename; listing returns the written refs; a step with
  a missing required input artifact is blocked; optional artifacts may be absent
  without blocking.
- [ ] 4.2 `npm run typecheck` clean.
- [ ] 4.3 `openspec validate --all --strict` passes.
