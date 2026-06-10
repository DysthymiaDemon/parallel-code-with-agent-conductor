## 1. Artifact store

- [ ] 1.1 Add per-run artifact directory helpers using a run ID allocated by
      `add-conductor-run-store`; do not maintain a separate counter file.
- [ ] 1.2 Define canonical names: `plan.md`, `accepted-plan.md`,
      `implementation.diff`, `test-report.json`, `code-review.md`, optional
      `ui-review.md`/`screenshots/`, and conductor-owned `final-summary.md`.
- [ ] 1.3 Define `ArtifactRef` with run, kind, relative path, schema version,
      media type, digest, size, producer step/attempt, producer identity,
      declared-input provenance, and creation time.

## 2. Handoff and validation

- [ ] 2.1 Permit a step to read only declared prior artifacts and write only
      declared outputs.
- [ ] 2.2 Verify path containment, digest, schema, size limits, and required
      inputs before use.
- [ ] 2.3 Reject transcript handoffs and conflicting writes to canonical names.

## 3. IPC and verification

- [ ] 3.1 Add write/list artifact IPC channels and secret-free shared payloads.
- [ ] 3.2 Test traversal rejection, digest mismatch, missing required inputs,
      retry provenance, canonical final-summary ownership, and optional artifacts.
- [ ] 3.3 Run `npm run typecheck` and `npm run check:spec`.
