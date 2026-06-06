## Why

The conductor's core promise is to preserve first-party CLI/subscription auth
(ChatGPT, Claude Pro/Max, Google account) and avoid silently spending
pay-as-you-go API credits. The risk is concrete: if `OPENAI_API_KEY`,
`CODEX_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, or `GOOGLE_AI_API_KEY`
are present in the environment, a launched agent may bill against an API account
instead of the user's subscription — without the user realizing it. The user
should be warned **before** an agent thread starts, and given an explicit
choice. No such inspection exists today.

This change adds a read-only auth inspection step that detects these env vars
per agent and produces a structured warning with explicit options. It does not
launch agents, does not read secret *values*, and does not change auth itself.

## What Changes

- Add an auth inspector that, for each agent the conductor intends to use,
  reports whether subscription-bypassing API-key env vars are present.
- Per `auth_policy` in `conductor.yaml` (`warn_on_api_keys`,
  `prefer_subscription_auth`, `block_api_keys_unless_explicit`), classify each
  agent's auth posture as `subscription_preferred`, `api_key_detected`, or
  `unknown`.
- Surface a structured per-run auth decision the UI can render with options
  (use subscription login / use API key once / unset for this run / cancel) —
  the *decision plumbing* only; enforcement of "block unless explicit" is
  asserted here, while the actual launch happens in a later change.
- Detect only the **presence** of the named env vars; never log or return secret
  values.

## Capabilities

### New Capabilities

- `conductor-auth-inspector`: Pre-launch inspection of agent authentication
  posture — detecting subscription-bypassing API-key environment variables per
  agent and producing a structured, secret-safe warning and per-run decision.

## Impact

- **Code (new):** `electron/conductor/auth-inspector.ts`. New IPC channel
  `ConductorInspectAuth` on the `IPC` enum (`electron/ipc/channels.ts`) +
  preload allowlist; payload types in `src/ipc/types.ts`.
- **Depends on:** `add-conductor-config` (reads `auth_policy` and the resolved
  agents).
- **Security:** only env-var *names* are inspected; values are never read into
  the result or logs. Aligns with the runbook's "no hidden API billing" and
  "no secrets in logs" rules.
- **No agent launches** in this change.
