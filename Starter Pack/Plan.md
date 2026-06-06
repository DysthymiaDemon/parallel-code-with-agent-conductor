# ExecPlan: MVP Guided Role-Aware Conductor

This is the living ExecPlan for the Conductor MVP. Read `PLANS.md` first if you
are unfamiliar with ExecPlan format. Read `Starter Pack/Goal.md` for the
durable objective and stop condition. The OpenSpec changes in
`openspec/changes/add-conductor-*/` are authoritative on *what* each capability
requires; this file records *why*, *in what order*, and *what was discovered*.

---

## Purpose / Big Picture

Turn the existing Parallel Code Electron app into a safe guided workflow
conductor: the user describes a task, the app selects the right role→agent
workflow, previews the full plan before launching anything, and only proceeds
after explicit approval — reusing the existing task, worktree, diff, and MCP
plumbing already in the codebase. The MVP ships role presets, four fixed
workflow presets, a dry-run preview with zero side effects, worktree-isolated
agent launches, structured artifact handoff, auth/billing warnings, and human
gates on all risky operations.

---

## Context and Orientation

**Architecture:** Electron desktop app (macOS/Linux only). SolidJS frontend
communicates with Node.js backend exclusively via Electron IPC. IPC channel
names live in `electron/ipc/channels.ts` (shared enum). Frontend uses strict
TypeScript with SolidJS signals/stores and functional components only.

**Agent division of labour:** Claude plans and reviews — it writes/refines the
OpenSpec changes before any code, then reviews Codex's output against the
WHEN/THEN scenarios for spec intent, cross-file consistency, and security/logic
smell. Codex implements — it works from the specs in `/goal` mode, stays
grounded in the real working tree, and runs `openspec validate`,
`npm run typecheck`, and `npm test`, acting on failures in a fix loop until all
validation passes. See `AGENTS.md` → "Agent Division of Labour" for the full
split.

**Key files:**
- `electron/ipc/agents.ts` — `AgentDef` registry; real agent ids are
  `claude-code`, `codex`, `gemini`, `antigravity`, `opencode`, `copilot`
- `electron/ipc/channels.ts` — `IPC` enum; add all new `Conductor*` channels here
- `electron/ipc/tasks.ts` — existing `createTask` plumbing; reuse for launch
- `electron/ipc/git.ts` — existing `createWorktree` plumbing; reuse for isolation
- `electron/preload.cjs` — preload allowlist; every new IPC channel needs an entry
- `src/ipc/types.ts` — shared TypeScript types; augment (do not create a new file)
- `.parallel-code/conductor.yaml` — durable committed conductor config (generated
  on first load if absent)
- `.parallel-code/roles.yaml` — optional role override overlay
- `.parallel-code/workflows/` — workflow preset YAMLs
- `.parallel-code/policies/protected-paths.yaml` — write-policy rules
- `.parallel-code/artifacts/runs/<run-id>/` — generated run artifacts (git-ignored)
- `.parallel-code/state/` — generated runtime state (git-ignored)

**Terms:**
- `conductor` — the orchestration layer being built; lives in
  `electron/conductor/`
- `role` — a function in a workflow (planner, implementer, reviewer,
  ui_verifier, fixer)
- `agent id` — the string key used in `AgentDef` registry, e.g. `claude-code`
- `RoleBinding` — maps one role to a primary agent id plus optional fallback
- `WorktreeRef` — returned by `ConductorCreateWorktree`; records path, branch,
  role, runId
- `ArtifactRef` — typed pointer to a file in a run's artifact directory
- `dry-run` — zero-side-effect preview of what a run would do
- `human gate` — a blocking approval step; the run does not advance until the
  user explicitly approves or rejects
- `run-id` — unique identifier for a conductor run, formatted
  `run_<YYYYMMDD>_<NNN>`

---

## Plan of Work

| Phase | OpenSpec Change | What it delivers |
|---|---|---|
| Preflight | (no spec) | Fix agent-id drift; narrow .gitignore; confirm yaml dep |
| 0a | `add-conductor-config` | Config load/validate/generate + role resolver |
| 0b | `add-conductor-auth-inspector` | API-key detection; subscription warnings |
| 0c | `add-conductor-scheduler` | 3/6 consumer caps + capacity plan (pure policy) |
| 1 | `add-conductor-dry-run` | Task classifier + dry-run preview (first UI surface) |
| 2a | `add-conductor-worktrees` | Worktree launch + protected-path policy |
| 2b | `add-conductor-artifacts` | Run artifact directory + handoff contract |
| 3 | `add-conductor-approval-gates` | Human gates + run states; loop closed |

---

## Concrete Steps

```bash
# Before touching any implementation file:
npx openspec validate --all --strict

# After each phase, type-check both renderer and electron:
npm run typecheck

# Run the full test suite:
npx vitest run

# Smoke test the dry-run surface (after Phase 1):
npm run dev
# Open the app → enter a task → trigger /conduct → verify dry-run dialog appears
# with correct role→agent assignments, no worktrees or processes created.
```

---

## Validation and Acceptance

- [ ] `npx openspec validate --all --strict` exits 0 before any implementation
  code is written and again before each phase is archived.
- [ ] `npm run typecheck` exits 0 (renderer + electron) after each phase.
- [ ] `npx vitest run` exits 0 or all failures documented in `final-summary.md`.
- [ ] All four workflow preset YAMLs exist under `.parallel-code/workflows/`:
  `simple-codex.yaml`, `plan-implement-review.yaml`, `ui-build-verify.yaml`,
  `bug-hunt.yaml`.
- [ ] The conduct dialog renders a dry-run preview for a sample task, showing
  correct role→agent assignments, without launching any agent or creating any
  file.
- [ ] Approving the dry-run launches agents via the existing `createTask` /
  `createWorktree` plumbing and writes artifacts to
  `.parallel-code/artifacts/runs/<run-id>/`.
- [ ] Human gates block merge and push; no gated op proceeds without explicit
  approval.
- [ ] Auth warnings appear when `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` is
  present; the warning shows the key name, not its value.
- [ ] The existing manual Parallel Code task flow is unchanged and its tests
  still pass.

---

## Idempotence and Recovery

- Config generation (`conductor.yaml`) checks for the file before writing;
  re-running `ConductorLoadConfig` on an existing config is safe.
- Worktree creation fails explicitly if the branch already exists; re-running
  produces an error result, not a silent duplicate.
- Artifact writes are idempotent for the same `(runId, kind)` pair because they
  write to fixed canonical paths; overwriting is safe within a run.
- Gate state is persisted in `.parallel-code/state/pending-gates.json`; a
  restart with a pending gate re-presents it rather than auto-rejecting.
- Run counter persisted in `.parallel-code/state/run-counter.json`; if corrupt,
  reset to `{ "date": "YYYYMMDD", "counter": 0 }`.

---

## Interfaces and Dependencies

### TypeScript Types (all in `src/ipc/types.ts`)

```typescript
type RoleName = 'planner' | 'implementer' | 'reviewer' | 'ui_verifier' | 'fixer'
type AgentId = string  // must exist in electron/ipc/agents.ts AgentDef registry

type RunState =
  | 'ready-for-review'
  | 'ready-for-merge'
  | 'blocked'
  | 'failed'
  | 'needs-human'
  | 'retry-once'

interface RoleBinding {
  roleId: RoleName
  primary: AgentId
  fallback?: AgentId
  mode?: 'plan' | 'implement' | 'review' | 'verify' | 'fix'
  purpose?: string
}

interface CapacityConfig {
  maxActiveAgents: number   // default 3
  hardCap: number           // default 6
  defaultEffort: 'low' | 'medium' | 'high'  // default 'medium'
}

interface AuthPolicy {
  warnOnApiKeys: boolean
  preferSubscriptionAuth: boolean          // default true
  blockApiKeysUnlessExplicit: boolean      // default true
  envApiKeys: string[]
}

interface ApprovalConfig {
  requirePlanApproval: boolean             // default true
  requireMergeApproval: boolean            // default true
  requireFixApproval: boolean              // default true
  requirePackageInstallApproval: boolean   // default true
  requireMigrationApproval: boolean        // default true
  requirePushApproval: boolean             // default true
  blockOnDenyPath: boolean                 // default true
  persistGatesAcrossRestarts: boolean      // default true
  beforeFirstWrite: boolean               // default false
  beforeCommit: boolean                    // default true
  beforeMerge: boolean                     // default true
  beforePush: boolean                      // default true
  beforePackageInstall: boolean            // default true
  beforeDatabaseMigration: boolean         // default true
  beforeDelete: boolean                    // default true
  beforeTouchingProtectedPaths: boolean    // default true
}

interface WorktreeConfig {
  baseDir: string       // default '.worktrees' (matches existing project convention)
  branchPrefix: string  // default 'conductor'
}

interface ConductorConfig {
  schemaVersion: '1'
  project: { name: string }
  agents: {
    roles: RoleBinding[]
    capacity: CapacityConfig
    authPolicy: AuthPolicy
  }
  workflows: { presets: string[] }
  worktrees: WorktreeConfig
  approval: ApprovalConfig
}

interface WorktreeRef {
  worktreePath: string
  branchName: string
  role: RoleName
  runId: string
}

interface ArtifactRef {
  runId: string
  kind: 'plan' | 'accepted-plan' | 'diff' | 'test-report' | 'code-review' | 'ui-review' | 'final-summary'
  path: string          // relative to artifact run dir
  producedByRole: RoleName
  createdAt: string     // ISO 8601
}
```

### IPC Channel Names (add to `IPC` enum in `electron/ipc/channels.ts`)

| Enum member | String value | Defined by |
|---|---|---|
| `ConductorLoadConfig` | `'conductor_load_config'` | add-conductor-config |
| `ConductorValidateConfig` | `'conductor_validate_config'` | add-conductor-config |
| `ConductorSaveConfig` | `'conductor_save_config'` | add-conductor-config |
| `ConductorResolveRole` | `'conductor_resolve_role'` | add-conductor-config |
| `ConductorInspectAuth` | `'conductor_inspect_auth'` | add-conductor-auth-inspector |
| `ConductorCheckCapacity` | `'conductor_check_capacity'` | add-conductor-scheduler |
| `ConductorDryRun` | `'conductor_dry_run'` | add-conductor-dry-run |
| `ConductorCreateWorktree` | `'conductor_create_worktree'` | add-conductor-worktrees |
| `ConductorCleanupWorktree` | `'conductor_cleanup_worktree'` | add-conductor-worktrees |
| `ConductorCheckProtectedPath` | `'conductor_check_protected_path'` | add-conductor-worktrees |
| `ConductorWriteArtifact` | `'conductor_write_artifact'` | add-conductor-artifacts |
| `ConductorListArtifacts` | `'conductor_list_artifacts'` | add-conductor-artifacts |
| `ConductorRequestApproval` | `'conductor_request_approval'` | add-conductor-approval-gates |
| `ConductorResolveApproval` | `'conductor_resolve_approval'` | add-conductor-approval-gates |

---

## Progress

- [ ] Preflight 1: Replace `claude`/`google_visual` with real agent ids in all
  7 specs (YYYY-MM-DD)
- [ ] Preflight 2: Narrow `.parallel-code/.gitignore` (YYYY-MM-DD)
- [ ] Preflight 3: Add `yaml` as direct dependency (human-gated install)
  (YYYY-MM-DD)
- [ ] Phase 0a: `add-conductor-config` — config load/validate/generate + role
  resolver (YYYY-MM-DD)
- [ ] Phase 0b: `add-conductor-auth-inspector` — API-key detection +
  subscription warnings (YYYY-MM-DD)
- [ ] Phase 0c: `add-conductor-scheduler` — 3/6 consumer caps + capacity plan
  (YYYY-MM-DD)
- [ ] Phase 1: `add-conductor-dry-run` — task classifier + dry-run preview
  (YYYY-MM-DD)
- [ ] Phase 2a: `add-conductor-worktrees` — worktree launch + protected-path
  policy (YYYY-MM-DD)
- [ ] Phase 2b: `add-conductor-artifacts` — run artifact directory + handoff
  contract (YYYY-MM-DD)
- [ ] Phase 3: `add-conductor-approval-gates` — human gates + run states
  (YYYY-MM-DD)

---

## Surprises & Discoveries

- **2026-06-04** Agent-id drift across all 7 specs: role bindings used `claude`
  (not `claude-code`) and `google_visual` (not `antigravity`). These ids are not
  in `electron/ipc/agents.ts` and would fail registry validation at runtime.
  Fixed in spec/tasks/proposal files before implementation.
- **2026-06-04** `.parallel-code/` fully git-ignored as a whole. Committed
  config (`conductor.yaml`, `roles.yaml`) would be untrackable. Resolution:
  create `.parallel-code/.gitignore` that ignores only `state/`, `artifacts/`,
  `worktrees/`, `agents/` rather than patching the root `.gitignore`.
- **2026-06-04** `yaml` package is only a transitive entry in
  `package-lock.json`, not a direct `dependencies` entry. Importing it without
  making it direct creates a fragile transitive dependency. Must add it as
  direct before use (requires human-gated install).
- **2026-06-04** Circular dependency between `add-conductor-artifacts` and
  `add-conductor-approval-gates`: the artifacts spec said "when a run starts"
  create the run directory, but a run cannot start until the dry-run is approved
  — which belongs to approval-gates. Resolution: `add-conductor-approval-gates`
  invokes the `ConductorWriteArtifact` utility to create the run directory on
  approval; `add-conductor-artifacts` provides the utility only.

---

## Decision Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-06-04 | Adopt ExecPlan format for Plan.md | Multi-session work requires structured working memory; ExecPlan provides required sections and update discipline |
| 2026-06-04 | `tasks.md` wins over `Plan.md` on IPC channel names | spec/tasks files are reviewed and authoritative; Plan.md is orientation — let the authoritative source win on conflicts |
| 2026-06-04 | Standardize on `ArtifactRef` (not `ConductorArtifact`) | `add-conductor-artifacts/tasks.md` and proposal both used `ArtifactRef`; Plan.md's `ConductorArtifact` was a one-off drift |
| 2026-06-04 | Run ID format: `run_<YYYYMMDD>_<NNN>` | Human-readable, sortable by date, zero-padded counter avoids collisions within a day; persisted in `state/run-counter.json` |
| 2026-06-04 | `ConductorCheckCapacity` (not `ConductorEvaluateCapacity`) | Consistent with `Check*` naming pattern used by other read-only query channels |
| 2026-06-04 | Types go in `src/ipc/types.ts` (augmenting existing file) | Creating `conductor-types.ts` would fragment the shared type surface; augmenting the existing file keeps all IPC types discoverable in one place |

---

## Outcomes & Retrospective

_(Fill at completion: what shipped, what was deferred, what would be done
differently next time.)_
