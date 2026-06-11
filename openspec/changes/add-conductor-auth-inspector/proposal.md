## Why

Parallel Code normally launches installed interactive CLIs that own login and
subscription usage. The conductor must preserve that behavior while preventing
ambient API-key variables, provider helpers, cloud credentials, or enterprise
credentials from silently changing billing. Environment-variable absence does
not prove subscription login, so unknown posture must remain visible without
forcing the user onto an API-key route.

## What Changes

- Inspect configured API-key variable names and adapter-reported auth metadata
  without reading secret values.
- Classify each provider as `api_key_detected`, `confirmed_subscription`,
  `cloud_or_enterprise`, `unknown`, or `unauthenticated`.
- Treat missing key variables as `unknown`, never as proof of subscription auth.
- Record an explicit per-run billing-route decision when posture is uncertain
  or an API key is detected.
- Make `subscription_only` the built-in policy: use installed provider CLIs,
  exclude detected API-key variables from child environments, permit
  provider-owned interactive login, and reject other billing routes.
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
