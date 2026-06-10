## 1. Adapter contract

- [ ] 1.1 Define `AgentAdapter`, adapter capabilities, version, structured
      lifecycle events, approval requests, auth posture, backpressure, and
      cancellation results in `src/ipc/types.ts`.
- [ ] 1.2 Add an adapter registry under `electron/conductor/adapters/` keyed by
      existing `AgentDef` ids.
- [ ] 1.3 Represent unsupported required capabilities explicitly and fail
      closed before launch.

## 2. Provider adapters

- [ ] 2.1 Implement a Codex app-server adapter using only its stable API surface
      and version-matched generated schema.
- [ ] 2.2 Implement a Claude structured adapter and distinguish interactive
      subscription use from non-interactive Agent SDK/credit use.
- [ ] 2.3 Implement a Gemini `stream-json` adapter.
- [ ] 2.4 Implement a declared PTY fallback adapter for providers without a
      supported structured control interface.

## 3. Credential ownership

- [ ] 3.1 Invoke official provider auth flows and probes without reading or
      copying credential values.
- [ ] 3.2 Never silently fall back to another provider billing route.

## 4. Verification

- [ ] 4.1 Contract tests replay recorded secret-free provider event fixtures.
- [ ] 4.2 Tests prove unsupported capabilities fail closed and manual PTY tasks
      remain unchanged.
- [ ] 4.3 `npm run check:spec`, `npm run typecheck`, and `npm test` pass.
