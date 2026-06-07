# ADR 0001: Internal Conductor Is Workflow Authority

- Status: Accepted
- Date: 2026-06-07

## Decision

Keep a deterministic conductor inside Parallel Code as the workflow authority.
Do not adopt an external orchestration framework for the MVP.

## Rationale

The repository already has task, worktree, PTY, diff, and coordinator plumbing.
The missing work is enforceable integration, durability, and provider
adaptation. An external framework would add a second workflow/state authority
without removing those responsibilities.

## Consequences

Provider sessions correlate to runs but cannot advance workflow state alone.
Revisit only if future requirements exceed fixed local workflows and the
replacement can preserve the same safety/durability contracts.
