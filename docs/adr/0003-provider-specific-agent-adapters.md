# ADR 0003: Provider-Specific Agent Adapters

- Status: Accepted
- Date: 2026-06-07

## Decision

Drive agents through a provider-neutral `AgentAdapter` contract implemented by
provider-specific adapters. Prefer official structured interfaces; treat PTY
control as an explicit reduced-capability fallback.

## Rationale

Terminal-text parsing is fragile and cannot reliably expose lifecycle,
approvals, cancellation, auth posture, or backpressure. Provider-specific
integration can use supported capabilities while preserving one conductor
workflow contract.

## Consequences

Dry-run must show adapter capabilities. Steps fail closed when their approved
manifest requires a capability the selected adapter lacks. Provider credentials
remain provider-owned and secret values never enter conductor state.
