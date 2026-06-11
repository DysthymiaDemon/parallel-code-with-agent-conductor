# Design - Conductor Agent Adapters

## Boundary

The internal conductor remains authoritative for workflow selection, durable
run state, approvals, and artifacts. Provider adapters translate that internal
contract to supported provider interfaces.

## Adapter Preference

1. Preserve the approved billing route and official provider authentication
   owner.
2. Prefer a stable structured provider control plane only when it preserves
   that route.
3. Use native interactive PTY control for subscription-backed CLIs without a
   supported structured control plane.
4. Fail closed rather than silently switching to SDK credits, API-key billing,
   cloud credentials, enterprise credentials, or another provider.

Initial adapter targets:

- Codex: `codex app-server` stable API surface with managed ChatGPT login and
  generated schema pinned to the detected Codex version. Native interactive
  Codex PTY is the fallback.
- Claude: native interactive `claude` PTY using subscription OAuth. Do not use
  `claude -p` or Agent SDK credits in the subscription-only default.
- Antigravity: native interactive `agy` PTY using its Google-account/keychain
  login. Do not launch it in Docker while that login cannot authenticate there.
- Gemini CLI: unavailable for the consumer-subscription profile after June 18, 2026. Enterprise or API-key use is outside the subscription-only default and
  requires an explicit non-default policy and billing-route approval.

## Security

Adapters invoke official provider software and may ask it for auth mode or
rate-limit metadata. They never read, copy, return, or persist OAuth tokens,
refresh tokens, API-key values, or credential files.

Provider-native approvals are useful signals but do not replace conductor
backend-operation gates.

## Parallel Code Integration

Adapters reuse the existing installed-command registry and `node-pty` launch
path. Provider auth stays inside the installed CLI. The conductor may ask a
supported provider control surface for secret-safe auth metadata, but it never
reads credential files or turns provider credentials into conductor-managed
tokens.
