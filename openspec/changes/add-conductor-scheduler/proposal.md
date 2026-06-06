## Why

A normal user on ChatGPT Plus/Pro and Claude Pro/Max cannot sustainably run
20–30 concurrent agents — it is a capacity and cost constraint, not a
preference (feature spec §36–46). The product must be subscription-aware by
default: a small number of well-sequenced agents, not a swarm. Without an
explicit capacity policy, a workflow could fan out and exhaust the user's
allocation or trigger surprise API charges. This change adds the capacity model
the rest of the conductor consults before starting work.

This change is pure policy: it computes how many agents may be active and
queues the rest. It does not launch agents itself; the dry-run preview and the
execution layer consult it.

## What Changes

- Add named **capacity modes**: `consumer_subscription` (default,
  target 3 / max 6), `api_budget` (opt-in, budget-capped), and
  `enterprise_or_research` (admin-unlock only). Ameen's Default uses
  `consumer_subscription`.
- Enforce caps: total active agents, expensive-agent concurrency, and per-agent
  caps (`max_parallel_claude_code`, `max_parallel_codex`,
  `max_parallel_antigravity`), with excess work **queued** rather than spawned.
- Provide a capacity-evaluation function: given a planned set of steps/agents,
  return whether it fits, what would queue, and whether it exceeds the hard cap.
- Refuse a 20–30 agent fan-out under `consumer_subscription` and require an
  explicit mode switch to exceed 6 active agents.
- Per-role reasoning-effort defaults (medium default; low for routine
  fixer/ui_verifier/tester; high requires approval).

## Capabilities

### New Capabilities

- `conductor-scheduler`: The subscription-aware capacity model that bounds how
  many agents may run concurrently, queues excess work, selects per-role
  reasoning effort, and gates agent-swarm fan-out behind explicit capacity
  modes.

## Impact

- **Code (new):** `electron/conductor/scheduler.ts`. New IPC channel
  `ConductorCheckCapacity` (`'conductor_check_capacity'`) on the `IPC` enum +
  preload allowlist; payload types in `src/ipc/types.ts`.
- **Depends on:** `add-conductor-config` (reads the capacity block).
- **Consumed by:** `add-conductor-dry-run` (capacity plan) and the later
  execution layer (admission control).
- **No agent launches** in this change; it is admission policy only.
