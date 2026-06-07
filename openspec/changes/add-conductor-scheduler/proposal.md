## Why

A normal user should not accidentally launch a large local swarm across
consumer-backed coding agents. Providers do not expose consistent APIs for
remaining quota, reset time, per-task cost, or concurrent-session entitlement,
so the product cannot honestly claim to measure subscription capacity. This
change adds a conservative local admission policy the rest of the conductor
consults before starting work.

This change is pure policy: it computes how many agents may be active and
queues the rest. It does not launch agents itself; the dry-run preview and the
execution layer consult it.

## What Changes

- Ship exactly one **active capacity mode** in the MVP: `consumer_conservative`
  (default, target 3 / max 6), which Ameen's Default uses. The mode field is an
  enum reserving `api_budget` and `enterprise_or_research` as **future,
  non-selectable** values (enterprise/API-budget mode is out of MVP scope per
  `Goal.md`); the MVP neither enables nor capacity-plans for them.
- Enforce caps: total active agents, expensive-agent concurrency, and per-agent
  caps (`max_parallel_claude_code`, `max_parallel_codex`,
  `max_parallel_antigravity`), with excess work **queued** rather than spawned.
- Provide a capacity-evaluation function: given a planned set of steps/agents,
  return whether it fits, what would queue, and whether it exceeds the hard cap.
- Refuse a 20–30 agent fan-out under `consumer_conservative`; no higher mode is
  selectable in the MVP.
- Consume provider backpressure and rate-limit metadata when an adapter exposes
  it, without treating missing metadata as available capacity.
- Per-role reasoning-effort defaults (medium default; low for routine
  fixer/ui_verifier/tester; high requires approval).

## Capabilities

### New Capabilities

- `conductor-scheduler`: The conservative local admission model that bounds how
  many agents may run concurrently, queues excess work, selects per-role
  reasoning effort, and gates agent-swarm fan-out behind explicit capacity
  modes.

## Impact

- **Code (new):** `electron/conductor/scheduler.ts`. New IPC channel
  `ConductorCheckCapacity` (`'conductor_check_capacity'`) on the `IPC` enum +
  preload allowlist; payload types in `src/ipc/types.ts`.
- **Depends on:** `add-conductor-config` and `add-conductor-agent-adapters`.
- **Consumed by:** `add-conductor-dry-run` (capacity plan) and the later
  execution layer (admission control).
- **No agent launches** in this change; it is admission policy only.
