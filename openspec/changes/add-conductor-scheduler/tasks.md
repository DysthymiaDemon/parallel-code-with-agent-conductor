## 1. Capacity modes

- [ ] 1.1 Add `electron/conductor/scheduler.ts` defining the three capacity
  modes with their caps: `consumer_subscription` (target 3, max 6, expensive 2),
  `api_budget` (target 6, max 12, budget cap required), `enterprise_or_research`
  (max 30, admin-unlock required).
- [ ] 1.2 Read the active mode and caps from the `ConductorConfig` capacity
  block; default to `consumer_subscription`.

## 2. Admission evaluation

- [ ] 2.1 Implement `evaluateCapacity(plannedAgents)` returning: `fits` /
  `queued` (which steps wait and why) / `exceeds_hard_cap`.
- [ ] 2.2 Enforce per-agent caps (`max_parallel_claude` default 1,
  `max_parallel_codex` default 2, `max_parallel_google_visual` default 1) and
  the global `max_active_agents`.
- [ ] 2.3 Under `consumer_subscription`, refuse any plan requesting more than 6
  active agents and flag 20–30 agent fan-out as requiring an explicit mode
  switch.

## 3. Reasoning effort

- [ ] 3.1 Provide per-role effort defaults: medium for planner/implementer/
  reviewer/architect; low for fixer/ui_verifier/test_runner/docs_writer; high
  requires approval for all roles.
- [ ] 3.2 Expose the chosen effort per step in the evaluation result.

## 4. IPC surface

- [ ] 4.1 Add `ConductorEvaluateCapacity` to the `IPC` enum and preload
  allowlist.
- [ ] 4.2 Add payload types to `src/ipc/types.ts`.

## 5. Verification

- [ ] 5.1 Unit tests: a 3-agent plan fits under default mode; a 7-agent plan
  exceeds the hard cap; per-agent caps queue the right steps; a 20-agent plan is
  refused under `consumer_subscription`; routine roles default to low effort;
  high effort flagged as approval-required.
- [ ] 5.2 `npm run typecheck` clean.
- [ ] 5.3 `openspec validate --all --strict` passes.
