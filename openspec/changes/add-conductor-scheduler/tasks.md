## 1. Capacity modes

- [ ] 1.1 Add `electron/conductor/scheduler.ts` implementing only the
      `consumer_conservative` mode (target 3, max 6, expensive 2). Type the `mode`
      field as an enum that _reserves_ `api_budget` and `enterprise_or_research` as
      future values, but do **not** implement caps or admission for them (out of MVP
      scope per `Goal.md`); selecting a reserved mode is rejected.
- [ ] 1.2 Read the active mode and caps from the `ConductorConfig` capacity
      block; default to `consumer_conservative`.

## 2. Admission evaluation

- [ ] 2.1 Implement `evaluateCapacity(plannedAgents)` returning: `fits` /
      `queued` (which steps wait and why) / `exceeds_hard_cap`.
- [ ] 2.2 Enforce per-agent caps (`max_parallel_claude_code` default 1,
      `max_parallel_codex` default 2, `max_parallel_antigravity` default 1) and
      the global `max_active_agents`.
- [ ] 2.3 Under `consumer_conservative`, refuse any plan requesting more than 6
      active agents and state that no higher-capacity mode is selectable in MVP.
- [ ] 2.4 Consume secret-safe provider backpressure/rate-limit metadata from
      adapters when available; missing metadata never increases admission.

## 3. Reasoning effort

- [ ] 3.1 Provide per-role effort defaults: medium for planner/validator/
      implementer/reviewer/architect; low for fixer/ui_verifier/tester/
      test_runner/docs_writer; high requires approval for all roles.
- [ ] 3.2 Expose the chosen effort per step in the evaluation result.

## 4. IPC surface

- [ ] 4.1 Add `ConductorCheckCapacity` (`'conductor_check_capacity'`) to the
      `IPC` enum and preload allowlist.
- [ ] 4.2 Add payload types to `src/ipc/types.ts`.

## 5. Verification

- [ ] 5.1 Unit tests: a 3-agent plan fits under default mode; a 7-agent plan
      exceeds the hard cap; per-agent caps queue the right steps; a 20-agent plan is
      refused under `consumer_conservative`; provider backpressure pauses the
      affected provider; routine roles default to low effort;
      high effort flagged as approval-required.
- [ ] 5.2 `npm run typecheck` clean.
- [ ] 5.3 `openspec validate --all --strict` passes.
