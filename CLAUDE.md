# Parallel Code

Electron desktop app — SolidJS frontend, Node.js backend. Published for **macOS and Linux only** (no Windows).

## Stack

- **Frontend:** SolidJS, TypeScript (strict), Vite
- **Backend:** Node.js (Electron, node-pty)
- **Package manager:** npm

## Commands

- `npm run dev` — start Electron app in dev mode
- `npm run build` — build production Electron app
- `npm run typecheck` — run TypeScript type checking

## Project Structure

- `src/` — SolidJS frontend (components, store, IPC, lib)
- `src/lib/` — frontend utilities (IPC wrappers, window management, drag, zoom)
- `electron/` — Electron main process (IPC handlers, preload)
- `electron/ipc/` — backend IPC handlers (pty, git, tasks, persistence)
- `src/store/` — app state management

## Conventions

- Functional components only (SolidJS signals/stores, no classes)
- Electron IPC for all frontend-backend communication
- IPC channel names defined in `electron/ipc/channels.ts` (shared enum)
- `strict: true` TypeScript, no `any`

## Specs

This repo uses OpenSpec. Capability specs for current behavior live under
`openspec/specs/`. For new or changed behavior, propose a change in
`openspec/changes/<name>/` (e.g. via `/opsx:propose`) rather than editing
specs directly — the change is archived into `specs/` when it ships. Run
`openspec validate --all --strict` before committing.

## Agent Conductor (active initiative)

This repo is being extended with the **Role-Aware Conductor**: describe a task
and the app dispatches the right role→agent workflow (Claude plans/reviews,
Codex implements/fixes, Gemini/Antigravity verifies UI), with worktree
isolation, structured artifacts, subscription-aware capacity, and human gates.

- **Why / product intent (durable):** `Starter Pack/` — start with
  `codebase-alignment-report.md` and `conductor-mvp-roadmap.md`, then the
  feature spec
  `role-aware-conductor-feature-with-antfarm-and-gas-town-and-subscription-capacity-constraint.md`
  and the safety protocol `project-runbook-safe-ai-agent-development.md`.
- **What / how (authoritative for delivery):** the seven sequenced
  `openspec/changes/add-conductor-*` proposals. Implement in the roadmap's
  dependency order, starting with `add-conductor-config`.
- **Non-negotiables:** spec before code; Consumer Subscription default (3
  active agents, 6 hard cap); never merge/push/install/migrate or write a
  protected path without a human gate; never log secret values.

## ExecPlans

When writing the conductor MVP or any feature spanning multiple OpenSpec
changes, use an ExecPlan (as described in `PLANS.md`). Read `PLANS.md` before
beginning any multi-change implementation. The conductor MVP ExecPlan is at
`Starter Pack/Plan.md` — read it before starting any conductor work.

## For all agents (Claude Code, Codex, Gemini)

`CLAUDE.md`, `AGENTS.md`, and `GEMINI.md` are kept identical on purpose. Edit
all three together so whichever agent is driving follows the same conventions,
methodology, and conductor plan.
