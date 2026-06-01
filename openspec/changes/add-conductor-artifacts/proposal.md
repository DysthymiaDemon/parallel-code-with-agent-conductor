## Why

Agents must hand off *structured artifacts*, not raw chat transcripts. Passing
whole transcripts bloats context, leaks stale state, and makes runs
unauditable. The conductor's reliability depends on each role producing a named
artifact at a known path that the next role consumes: planner → `plan.md`,
implementer → `implementation.diff` + `test-report.json`, reviewer →
`code-review.md`, fixer/conductor → `final-summary.md`. This change defines that
artifact store and the handoff contract. It supports the "fresh context per
step, artifacts-only handoff" policy from the feature spec (§11, §26.3).

## What Changes

- Create a per-run artifact directory at
  `.parallel-code/artifacts/runs/<run-id>/` when a run starts.
- Define the required artifacts and their canonical filenames/paths, and a
  typed reference (`ArtifactRef`) the conductor passes between steps.
- Enforce the handoff contract: a step consumes only the declared input
  artifacts of prior steps, not transcripts.
- Validate that a required artifact exists before a dependent step is allowed to
  start (a missing required artifact blocks, it does not get silently skipped).

## Capabilities

### New Capabilities

- `conductor-artifacts`: The structured artifact store and handoff contract for
  conductor runs — per-run artifact directories, canonical artifact
  names/paths, and the rule that steps hand off declared artifacts rather than
  raw transcripts.

## Impact

- **Code (new):** `electron/conductor/artifacts.ts` (create run dir, write/read
  artifact refs, validate presence), `src/conductor/artifacts.ts` (renderer
  helper for the artifact viewer). New IPC channels `ConductorWriteArtifact`,
  `ConductorListArtifacts` on the `IPC` enum + preload allowlist; payload types
  in `src/ipc/types.ts`.
- **Depends on:** `add-conductor-config` (artifact root path) and
  `add-conductor-worktrees` (run/work-item identity).
- **Filesystem:** writes under `.parallel-code/artifacts/runs/<run-id>/` (a
  generated, git-ignored area).
- **No agent launches** are introduced here; this is the storage/handoff layer
  the execution layer will use.
