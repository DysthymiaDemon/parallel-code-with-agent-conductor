## 1. Inspection

- [ ] 1.1 Add `electron/conductor/auth-inspector.ts` that combines configured
      key-name presence with secret-safe adapter auth metadata.
- [ ] 1.2 Support the MVP key names: Codex/OpenAI `OPENAI_API_KEY` and explicit
      `CODEX_API_KEY`; Claude `ANTHROPIC_API_KEY`; Gemini/Google
      `GEMINI_API_KEY` and `GOOGLE_API_KEY`.
- [ ] 1.3 Inspect names and posture metadata only; never read, return, persist,
      or log credential values.
- [ ] 1.4 Classify posture as `api_key_detected`, `confirmed_subscription`,
      `cloud_or_enterprise`, `unknown`, or `unauthenticated`.

## 2. Decisions

- [ ] 2.1 Produce per-agent posture records and a per-run aggregate.
- [ ] 2.2 Require an explicit billing-route decision for `api_key_detected`,
      `cloud_or_enterprise`, or `unknown` according to `auth_policy`.
- [ ] 2.3 Represent launch decisions as `use_provider_default`,
      `use_api_key_once`, `exclude_detected_keys`, or `cancel`.
- [ ] 2.4 Hand the execution adapter a strict child-environment decision;
      never mutate `process.env`.

## 3. IPC and verification

- [ ] 3.1 Add `ConductorInspectAuth` to the IPC enum and preload allowlist, with
      secret-free payload types in `src/ipc/types.ts`.
- [ ] 3.2 Test all classifications, unknown-on-key-absence, explicit decisions,
      and redaction from results/events/logs.
- [ ] 3.3 Run `npm run typecheck` and `npm run check:spec`.
