## Why

The conductor must not silently change a provider billing route. Environment
variables can indicate API billing, but their absence does not prove that a CLI
is using a consumer subscription. Provider helpers, cloud credentials, and
enterprise login routes also make auth posture uncertain. The conductor needs a
secret-safe, provider-aware inspection result before launch.

## What Changes

- Inspect configured API-key variable names and adapter-reported auth metadata
  without reading secret values.
- Classify each provider as `api_key_detected`, `confirmed_subscription`,
  `cloud_or_enterprise`, `unknown`, or `unauthenticated`.
- Treat missing key variables as `unknown`, never as proof of subscription auth.
- Record an explicit per-run billing-route decision when posture is uncertain
  or an API key is detected.
- Provide the execution adapter a strict child-environment decision; enforcement
  occurs at the launch boundary.

## Capabilities

### New Capabilities

- `conductor-auth-inspector`: Secret-safe provider auth and billing-route
  inspection before an agent launch.

## Impact

- **Code (new):** `electron/conductor/auth-inspector.ts`; shared payloads in
  `src/ipc/types.ts`; `ConductorInspectAuth` IPC channel.
- **Depends on:** `add-conductor-config`, `add-conductor-agent-adapters`.
- **Security:** secret values never enter results, artifacts, events, or logs.
- **No launch or auth mutation** occurs in this change.
