## 1. Artifact store

- [ ] 1.1 Add per-run artifact directory helpers using a run ID allocated by
      `add-conductor-run-store`; do not maintain a separate counter file.
- [ ] 1.2 Define canonical names: `plan.md`, `accepted-plan.md`,
      `security-design.md`, `repository-validation.md`, `implementation.diff`,
      `test-report.json`, `security-check-report.json`, `code-review.md`,
      optional `ui-review.md`/`screenshots/`, and conductor-owned
      `final-summary.md`.
- [ ] 1.3 Define `ArtifactRef` with run, kind, relative path, schema version,
      media type, digest, size, producer step/attempt, producer identity,
      declared-input provenance, and creation time.

## 2. Handoff and validation

- [ ] 2.1 Permit a step to read only declared prior artifacts and write only
      declared outputs.
- [ ] 2.2 Verify path containment, digest, schema, size limits, and required
      inputs before use.
- [ ] 2.3 Reject transcript handoffs and conflicting writes to canonical names.
- [ ] 2.4 Validate threat-model provenance and fallback fields; guardrails alone
      are not a security artifact.
- [ ] 2.5 Synthesize `final-summary.md` from verified declared evidence after
      Claude review and before final approval; reject every role-owned write.

## 3. IPC and verification

- [ ] 3.1 Add write/list artifact IPC channels and secret-free shared payloads.
- [ ] 3.2 Test traversal rejection, digest mismatch, missing required inputs,
      retry provenance, threat-model fallback validation, canonical final-summary
      synthesis/ownership, blocked final approval, and optional artifacts.
- [ ] 3.3 Run `npm run typecheck` and `npm run check:spec`.
