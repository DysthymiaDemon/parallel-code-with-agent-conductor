## 1. Adapter contract

- [ ] 1.1 Define `AgentAdapter`, adapter capabilities, version, structured
      lifecycle events, approval requests, auth posture, backpressure, and
      cancellation results in `src/ipc/types.ts`.
- [ ] 1.2 Add an adapter registry under `electron/conductor/adapters/` keyed by
      existing `AgentDef` ids.
- [ ] 1.3 Represent unsupported required capabilities explicitly and fail
      closed before launch.

## 2. Provider adapters

- [ ] 2.1 Implement a Codex app-server adapter using only its stable API
      surface, managed ChatGPT login, and version-matched generated schema;
      provide native interactive Codex PTY fallback.
- [ ] 2.2 Implement native interactive Claude PTY for subscription OAuth; do
      not use `claude -p` or Agent SDK credits under subscription-only policy.
- [ ] 2.3 Implement native interactive Antigravity PTY using Google-account
      keychain login and fail closed for Docker execution while unsupported.
- [ ] 2.4 Mark consumer Gemini CLI unavailable after June 18, 2026; any
      enterprise/API-key adapter is non-default and requires explicit policy.
- [ ] 2.5 Make approved billing route the first adapter-selection constraint;
      structured-interface preference applies only within that route.

## 3. Credential ownership

- [ ] 3.1 Invoke official provider auth flows and probes without reading or
      copying credential values.
- [ ] 3.2 Never silently fall back to another provider billing route.
- [ ] 3.3 Reuse installed provider CLIs and provider-owned login state without
      extracting, copying, or proxying credentials.

## 4. Verification

- [ ] 4.1 Contract tests replay recorded secret-free provider event fixtures.
- [ ] 4.2 Tests prove unsupported capabilities fail closed and manual PTY tasks
      remain unchanged.
- [ ] 4.3 Tests prove subscription-only selection chooses ChatGPT-backed Codex,
      interactive Claude, and native Antigravity; rejects Claude Agent SDK,
      Docker Antigravity, consumer Gemini after transition, and implicit API-key
      routes.
- [ ] 4.4 `npm run check:spec`, `npm run typecheck`, and `npm test` pass.
