# ADR 0005: Require Secure Design and Conductor-Owned Final Synthesis

- **Status:** Accepted
- **Date:** 2026-06-10

## Context

Trust-boundary changes need reviewable security evidence. A model's baked-in
guardrails can reduce unsafe output, but they are not a repository-grounded
threat model, cannot prove what was considered, and are not an auditable gate.

The final report also needs trustworthy provenance. Letting one model role write
the canonical summary would allow it to omit or reinterpret evidence produced
by other roles and deterministic checks.

## Decision

Security-sensitive `plan-implement-review` work follows:

```text
Claude secure design
-> Codex repository validation
-> human/spec approval where required
-> Codex small implementation
-> deterministic tests/security checks
-> Codex evidence-grounded fixes
-> Claude intent/security review
-> conductor synthesizes final evidence summary
-> human final approval
```

Trust-boundary work uses `security-threat-model` when available. If unavailable,
Claude may produce a clearly labeled repository-grounded fallback threat model
with the same required fields. Baked-in model guardrails alone never satisfy
the planning gate, and fallback use requires explicit human approval before
writable implementation.

Only the conductor may produce canonical `final-summary.md`. It synthesizes the
summary from verified declared artifacts after Claude review and before final
approval. Model roles may produce review artifacts, but cannot own or write the
canonical summary.

## Consequences

- Default roles include Codex `validator` and `tester` roles.
- Secure workflows declare threat-model provenance and explicit security
  evidence artifacts.
- Final approval remains blocked until conductor synthesis and all required
  artifact digests verify.
- Model guardrails remain defense-in-depth, not authorization or evidence.
