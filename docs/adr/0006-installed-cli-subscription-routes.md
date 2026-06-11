# ADR 0006: Preserve Installed-CLI Subscription Routes

- Status: Accepted
- Date: 2026-06-11

## Decision

Preserve the approved provider billing route before preferring adapter
structure. The built-in conductor auth policy is `subscription_only` and uses
locally installed official CLIs with provider-owned login:

- Codex App Server with managed ChatGPT login, or native Codex PTY fallback.
- Native interactive Claude Code with subscription OAuth.
- Native interactive Antigravity with Google-account/keychain login.

Consumer Gemini CLI is not a built-in fallback after June 18, 2026. API-key,
cloud, enterprise, SDK-credit, and headless-credit routes require explicit
non-default policy and never replace subscription usage silently.

## Rationale

Parallel Code launches installed CLIs as local PTY subprocesses so users can
reuse provider login and subscription usage. Choosing a more structured
interface is a regression if it silently changes billing. Native PTY control is
therefore a first-class adapter when it is the supported subscription route.

## Consequences

Dry-run and approved manifests record billing route, installed CLI command,
adapter kind, and launch profile. Conductor child environments exclude detected
API-key variables under `subscription_only`. Provider-owned credentials remain
opaque to the conductor. Antigravity runs natively while its keychain login
cannot authenticate inside Docker.
