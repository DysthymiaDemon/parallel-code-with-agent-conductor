# Design - Conductor Agent Adapters

## Boundary

The internal conductor remains authoritative for workflow selection, durable
run state, approvals, and artifacts. Provider adapters translate that internal
contract to supported provider interfaces.

## Adapter Preference

1. Stable structured provider control plane.
2. Supported structured headless CLI stream.
3. Generic PTY fallback with explicitly reduced capabilities.

Initial adapter targets:

- Codex: `codex app-server` stable API surface, with generated schema pinned to
  the detected Codex version.
- Claude: supported structured CLI or Agent SDK surface, with billing route
  represented explicitly.
- Gemini: headless `stream-json` output.
- Antigravity and other agents: PTY fallback until a supported structured
  interface exists.

## Security

Adapters invoke official provider software and may ask it for auth mode or
rate-limit metadata. They never read, copy, return, or persist OAuth tokens,
refresh tokens, API-key values, or credential files.

Provider-native approvals are useful signals but do not replace conductor
backend-operation gates.
