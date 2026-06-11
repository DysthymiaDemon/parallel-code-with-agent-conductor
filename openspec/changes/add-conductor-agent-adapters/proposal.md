## Why

Parallel Code launches locally installed coding CLIs as PTY subprocesses and
those CLIs own their interactive login and subscription usage. The conductor
must preserve that product model and must not silently replace an installed CLI
session with SDK, headless-credit, API-key, cloud, or enterprise billing.
Provider tooling may expose stronger structured control surfaces, but a
structured adapter is preferred only when it preserves the approved billing
route. Raw terminal control remains required for subscription-backed CLIs that
do not expose a supported structured interface.

This change defines provider-neutral agent adapters while preserving each
provider's official authentication owner. It does not make a provider SDK or
protocol the conductor's workflow authority.

## What Changes

- Define one `AgentAdapter` contract for capability discovery, launch, events,
  approvals, cancellation, auth posture, and provider backpressure.
- Preserve the approved billing route before preferring a structured provider
  interface; use native PTY control when that is the supported subscription
  route.
- Keep official CLIs responsible for OAuth tokens and subscription credentials;
  adapters never extract or replay provider credentials.
- Default to installed-CLI subscription usage: Codex App Server with managed
  ChatGPT login, native interactive Claude Code, and native interactive
  Antigravity.
- Do not use consumer Gemini CLI after its June 18, 2026 service transition and
  never replace it with an API-key route implicitly.
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
