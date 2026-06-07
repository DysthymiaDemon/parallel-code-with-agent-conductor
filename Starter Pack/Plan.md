# ExecPlan: MVP Guided Role-Aware Conductor

Read `Starter Pack/README.md`, `Starter Pack/Goal.md`, `PLANS.md`, and
`openspec/conductor-governance.json` before implementation. OpenSpec owns
behavior; this plan owns sequence, progress, discoveries, and decisions.

## Purpose / Big Picture

Deliver a local, human-gated conductor on the existing Parallel Code app. The
conductor remains the deterministic workflow authority while official provider
software owns provider auth and execution integration.

## Context and Orientation

- Existing execution: `electron/mcp/coordinator.ts`, `electron/ipc/pty.ts`,
  `electron/ipc/tasks.ts`, `electron/ipc/git.ts`.
- Shared contracts: `src/ipc/types.ts`, `electron/ipc/channels.ts`,
  `electron/preload.cjs`.
- Governance graph: `openspec/conductor-governance.json`.
- Durable decisions: `docs/adr/`.
- Generated runtime data: `.parallel-code/state/` and
  `.parallel-code/artifacts/`; durable user config is separately trackable.

Key terms: `AgentAdapter` is the provider boundary; approved manifest is the
immutable execution input; privileged-operation broker is the final mutation
authorization boundary; run store is the sole durable workflow authority.

## Plan of Work

| Phase | OpenSpec change | Outcome |
|---|---|---|
| Preflight | governance/tooling | Aligned authority docs, valid graph, baseline checks |
| 0a | `add-conductor-config` | Validated config and role resolution |
| 0b | `add-conductor-agent-adapters` | Structured provider adapters and explicit PTY fallback |
| 0c | `add-conductor-auth-inspector` | Secret-safe, uncertainty-aware auth posture |
| 0d | `add-conductor-scheduler` | Consumer-conservative pure admission policy |
| 0e | `add-conductor-run-store` | Transactional state, events, intents, immutable manifests |
| 1 | `add-conductor-dry-run` | Zero-side-effect preview and manifest draft |
| 2a | `add-conductor-worktrees` | Git integration isolation and protected-path policy |
| 2b | `add-conductor-artifacts` | Verified artifacts-only handoff |
| 2c | `add-conductor-execution-adapter` | Sandboxed adapter execution and privileged broker |
| 3 | `add-conductor-approval-gates` | Bound human decisions and final authorization |

## Concrete Steps

```bash
npm run check:governance
npm run check:spec
npm run typecheck
npm test
npm run lint:arch
npm run lint:dead
```

Do not install dependencies merely to run a check; installs require an explicit
human gate.

## Validation and Acceptance

- Governance graph, authority docs, and identical agent instructions agree.
- Dry-run performs no filesystem, process, provider, or run-store mutation.
- Approval freezes a versioned manifest and execution never re-resolves it.
- Missing adapter/sandbox capability fails closed.
- Final backend mutation entrypoints reject unauthorized conductor effects.
- Crash/restart and duplicate decisions do not blindly repeat effects.
- Artifact traversal, digest mismatch, secret leakage, symlink/canonical-path,
  shared Git metadata, and manual-flow regression have tests.

## Idempotence and Recovery

The transactional run store commits projections with append-only events.
External effects require immutable intents before execution. On restart,
provider sessions, PTYs, worktrees, artifacts, and external effects are
reconciled against durable state. Ambiguous effects enter recovery; they are
never retried from assumption. Missing config/presets resolve in memory and are
persisted only through explicit initialization.

## Interfaces and Dependencies

OpenSpec owns schemas and IPC channels. Dependency order is machine-readable in
`openspec/conductor-governance.json`. The run store owns durable workflow
state; artifacts own content; adapters own provider integration; execution owns
launch/reconciliation; approval gates authorize immutable effect intents.

## Review and Research Tooling

- Planning gate: Claude drafts conceptual architecture and UI direction; Codex
  must inspect the repository and revise the plan with real files, existing
  patterns, tests, edge cases, dependencies, migration/recovery risks, and a
  safer implementation order before the plan is executable.
- Use repository-grounded security threat modeling before writable execution
  and security-best-practice review before merging the broker/sandbox boundary.
- Use the Browser/frontend-testing plugin for the dry-run and approval UI.
- Use GitHub/CI tooling to inspect failing checks after each implementation
  phase.
- Use official OpenAI/provider documentation skills for provider contracts.
  Context7 may supplement them with current, version-specific library
  documentation, but it is not a runtime dependency or authority; verify
  safety-critical claims against primary provider docs, pinned versions, and
  repository behavior.
- Before enabling any external MCP/plugin/skill, review its permissions and
  provenance, grant least privilege, and require human approval for write-capable
  integrations. Never provide secrets merely to improve documentation retrieval.
- Parallel research agents may investigate independent read-only questions, but
  Codex must synthesize and verify their findings before changing the plan.

Primary references for this policy:

- Context7 documentation: `https://context7.com/docs`
- MCP security best practices:
  `https://modelcontextprotocol.io/specification/2025-06-18/basic/security_best_practices`
- MCP client best practices:
  `https://modelcontextprotocol.io/docs/develop/clients/client-best-practices`

## Progress

- [x] Preflight: consolidate documentation authority (2026-06-07)
- [x] Preflight: add ten-change governance graph and checker (2026-06-07)
- [x] Preflight: define agent-adapter and transactional run-store changes (2026-06-07)
- [x] Preflight: align existing OpenSpec contracts with revised architecture (2026-06-07)
- [ ] Preflight: establish passing governance/OpenSpec/tooling baseline
- [ ] Phase 0a: `add-conductor-config`
- [ ] Phase 0b: `add-conductor-agent-adapters`
- [ ] Phase 0c: `add-conductor-auth-inspector`
- [ ] Phase 0d: `add-conductor-scheduler`
- [ ] Phase 0e: `add-conductor-run-store`
- [ ] Phase 1: `add-conductor-dry-run`
- [ ] Phase 2a: `add-conductor-worktrees`
- [ ] Phase 2b: `add-conductor-artifacts`
- [ ] Phase 2c: `add-conductor-execution-adapter`
- [ ] Phase 3: `add-conductor-approval-gates`

## Surprises & Discoveries

- 2026-06-07: Existing coordinator/worktree/PTY plumbing is substantial; the
  missing boundary is provider adaptation plus enforceable privileged effects.
- 2026-06-07: Worktrees share Git metadata and do not contain filesystem or
  process effects.
- 2026-06-07: API-key absence cannot prove consumer-subscription auth.
- 2026-06-07: Separate JSON counters, gates, and queue files would create
  crash-consistency gaps; one transactional store is required.
- 2026-06-07: The original flat run-state union mixed execution, readiness,
  outcome, and retry policy.
- 2026-06-07: Official OpenSpec releases show `v1.4.1` as current; CI pins that
  exact CLI version instead of following `latest`.

## Decision Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-06-07 | Keep an internal deterministic conductor | Existing app plumbing and product scope do not justify adopting an external workflow framework |
| 2026-06-07 | Add provider-specific `AgentAdapter` contracts | Structured interfaces are safer and more durable than terminal parsing |
| 2026-06-07 | Use one transactional run store | Lifecycle, gates, queue, and effects require atomic recovery |
| 2026-06-07 | Freeze approved manifests | Mutable config must not silently change an active run |
| 2026-06-07 | Enforce privilege at final backend entrypoints | Prompts, UI gates, and adapter flags are bypassable |
| 2026-06-07 | Call scheduling `consumer_conservative` | Provider subscription quota is not reliably measurable |
| 2026-06-08 | Require Claude concept plan followed by Codex repository validation | Separates broad design strength from grounded implementation evidence and catches file, test, dependency, migration, and edge-case drift before code |

## Outcomes & Retrospective

Fill after implementation ships.
