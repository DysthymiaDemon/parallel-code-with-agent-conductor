This goal defines the durable Codex objective for the MVP Guided Role-Aware Conductor.

# Goal

Implement the MVP Guided Role-Aware Conductor for Parallel Code.

## Objective

Turn the existing Parallel Code app from manual parallel-agent task launching into a safe guided workflow conductor. Add role presets, fixed workflow presets, conduct dry-run approval, worktree-backed agent launch, artifact capture, auth/billing warnings, and human-gated risky actions.

## Success

A user can enter one task, see selected roles/workflow before launch, approve execution, get agents launched through existing Parallel Code task/worktree plumbing, receive artifacts under `.parallel-code/artifacts/runs/<run-id>/`, see auth/billing warnings when relevant API env vars are present, and retain human approval before merge or risky actions.

## In Scope

- Ameen's Default role preset.
- Fixed workflow presets: `simple-codex`, `plan-implement-review`, `ui-build-verify`, `bug-hunt`.
- Fixed workflow recipe schema for the MVP presets; no editor or marketplace.
- Conduct dry-run screen.
- Consumer scheduling: 3 active agents normal, 6 hard cap, queue excess work, show capacity plan.
- Artifact files: `plan.md`, `implementation-summary.md`, `test-report.md`, `ui-review.md`, `code-review.md`, `final-summary.md`.
- Per-run traceability: run step -> role -> agent -> task id -> artifact.
- Warnings for `OPENAI_API_KEY`, `CODEX_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `GOOGLE_AI_API_KEY`.
- Human gates for merge, push, package install, migration, destructive filesystem actions.
- Basic run states: `ready-for-review`, `ready-for-merge`, `blocked`, `failed`, `needs-human`, `retry-once`.

## Out Of Scope

- Zed fork.
- Full ACP rewrite.
- Autonomous merge queue; MVP only tracks human-approved review/merge readiness.
- 20+ agent scheduler; MVP only supports 3-normal/6-hard-cap consumer scheduling.
- Complex retry/escalation engine; MVP only supports basic blocked/failed/retry-once/needs-human states.
- Persistent long-term agent identity; MVP only records per-run role/agent/task/artifact traceability.
- General workflow DSL editor; MVP only supports fixed workflow recipe schema/presets.
- Enterprise/API budget mode; MVP only supports consumer subscription mode and API-env warnings.

## Constraints

Use existing Electron/SolidJS/Node architecture. Preserve existing manual Parallel Code task flow. Prefer existing task, agent, worktree, diff, and MCP plumbing over new abstractions.
