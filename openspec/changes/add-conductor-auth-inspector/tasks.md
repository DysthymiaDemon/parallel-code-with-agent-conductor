## 1. Inspector logic

- [ ] 1.1 Add `electron/conductor/auth-inspector.ts` that, given the resolved
  agents for a run, checks `process.env` for the agent's configured
  `env_api_keys` (`codex`: `CODEX_API_KEY`, `OPENAI_API_KEY`; `claude-code`:
  `ANTHROPIC_API_KEY`; `antigravity`/`gemini`: `GEMINI_API_KEY`,
  `GOOGLE_AI_API_KEY`).
- [ ] 1.2 Inspect only key **presence** (`key in process.env`); never read,
  return, or log the value.
- [ ] 1.3 Classify each agent as `subscription_preferred`, `api_key_detected`,
  or `unknown` using `auth_policy` from the loaded `ConductorConfig`.

## 2. Decision model

- [ ] 2.1 Produce a per-agent warning record (agent id, detected key names,
  classification, recommended action) and a per-run aggregate.
- [ ] 2.2 Represent the user's per-run decision options as data:
  `use_subscription`, `use_api_key_once`, `unset_for_this_run`, `cancel`.
  `unset_for_this_run` launches the agent subprocess without that env var in
  its environment without permanently mutating `process.env`.
- [ ] 2.3 When `auth_policy.block_api_keys_unless_explicit` is true and a key is
  detected, the default decision is `blocked_pending_explicit` until the user
  chooses `use_api_key_once`.

## 3. IPC surface

- [ ] 3.1 Add `ConductorInspectAuth` to the `IPC` enum in
  `electron/ipc/channels.ts` and the preload allowlist in
  `electron/preload.cjs`.
- [ ] 3.2 Add request/response payload types to `src/ipc/types.ts` (no secret
  fields).

## 4. Verification

- [ ] 4.1 Unit tests: key present → `api_key_detected` + warning; key absent →
  `subscription_preferred`; `block_api_keys_unless_explicit` yields
  `blocked_pending_explicit`; result contains no secret values.
- [ ] 4.2 Test that logs emitted during inspection contain no env-var values.
- [ ] 4.3 `npm run typecheck` clean.
- [ ] 4.4 `openspec validate --all --strict` passes.
