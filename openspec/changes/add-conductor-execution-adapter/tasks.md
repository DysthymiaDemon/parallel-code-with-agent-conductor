## 1. Approved-manifest execution

- [ ] 1.1 Load and verify the approved manifest from the run store.
- [ ] 1.2 Translate each step into an `AgentAdapter` request using only declared
      inputs, capabilities, permissions, and outputs.
- [ ] 1.3 Preserve existing manual task behavior outside conductor runs.
- [ ] 1.4 Preserve approved installed-CLI subscription routes; structured
      preference never changes billing route or provider.

## 2. Privileged-operation broker

- [ ] 2.1 Add immutable effect intents and authorization checks at final
      backend file/Git/install/migration/delete/push entrypoints.
- [ ] 2.2 Enforce protected paths, expected-state digests, approval decisions,
      sender/run authorization, and at-most-once reconciliation.
- [ ] 2.3 Neutralize autonomous conductor commit/landing paths.

## 3. Sandbox and environment

- [ ] 3.1 Define enforceable macOS/Linux writable and read-only role profiles;
      fail closed when unavailable.
- [ ] 3.2 Build child environments from a minimal allowlist and the recorded
      auth decision; never inherit the full host environment.
- [ ] 3.3 Treat canonical paths, symlinks, shared Git metadata, dependencies,
      and outside-cwd access as explicit tests.
- [ ] 3.4 Add provider-specific native subscription profiles that expose only
      declared provider-owned login facilities; keep Antigravity native while
      Docker/keychain login is unsupported.

## 4. Lifecycle and recovery

- [ ] 4.1 Emit step/provider/effect events and orthogonal lifecycle transitions
      through the run store.
- [ ] 4.2 Execute scheduler admissions and reconcile sessions, PTYs, worktrees,
      artifacts, and ambiguous effects after restart.
- [ ] 4.3 Test cancellation, provider backpressure, duplicate resolution, and
      manual-flow regression.
- [ ] 4.4 Enforce evidence-grounded bounded step retries: record evaluator
      feedback and failure class, require a changed strategy/input/precondition,
      and stop or escalate when the budget is exhausted or evidence is
      ambiguous.
- [ ] 4.5 After Claude intent/security review, invoke conductor-owned final
      synthesis from verified declared evidence and block final approval until
      canonical `final-summary.md` verifies.

## 5. Verification

- [ ] 5.1 Run `npm run check:governance`, `npm run check:spec`,
      `npm run typecheck`, and the conductor integration suite.
