## Why

The conductor currently assumes that heterogeneous coding agents can be driven
through one generic PTY contract. Current provider tooling exposes stronger,
structured control surfaces: Codex app-server provides JSON-RPC lifecycle,
approval, auth, and rate-limit events; Claude and Gemini provide structured
non-interactive streams. Raw terminal parsing is still needed for agents that
have no supported control surface, but it is too fragile to be the primary
integration contract.

This change defines provider-neutral agent adapters while preserving each
provider's official authentication owner. It does not make a provider SDK or
protocol the conductor's workflow authority.

## What Changes

- Define one `AgentAdapter` contract for capability discovery, launch, events,
  approvals, cancellation, auth posture, and provider backpressure.
- Prefer supported structured provider interfaces and use PTY parsing only as a
  declared fallback.
- Keep official CLIs responsible for OAuth tokens and subscription credentials;
  adapters never extract or replay provider credentials.
- Version adapter capabilities and fail closed when a required capability is
  unavailable.

## Capabilities

### New Capabilities

- `conductor-agent-adapters`: Provider-specific structured control adapters
  behind one provider-neutral conductor contract.

## Impact

- **Code (new):** `electron/conductor/adapters/` and shared adapter payload
  types in `src/ipc/types.ts`.
- **Depends on:** `add-conductor-config`.
- **Consumed by:** auth inspection, scheduling, dry-run, and execution adapter.
- **Preserves:** existing PTY/manual task behavior outside conductor runs.
