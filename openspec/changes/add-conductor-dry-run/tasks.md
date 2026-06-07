## 0. Workflow preset files

- [ ] 0.1 Provide four fixed workflow presets in memory when absent, and persist
  them only on explicit initialize: `simple-codex.yaml`,
  `plan-implement-review.yaml`, `ui-build-verify.yaml`, `bug-hunt.yaml`.
  Include their step definitions with the correct agent ids per the spec's
  workflow-preset tables (`planner→claude-code`, `implementer→codex`,
  `reviewer→claude-code`, `ui_verifier→antigravity` fallback `gemini`,
  `fixer→codex`). Never use placeholder ids (`claude`, `google_visual`).
- [ ] 0.2 Validate every step's `agent` against the `AgentDef` registry on load.

## 1. Task classifier

- [ ] 1.1 Add `electron/conductor/classify.ts` with deterministic,
  case-insensitive keyword rules mapping a task string to a workflow:
  - UI signals (`button`, `modal`, `form`, `dialog`, `sidebar`, `style`,
    `animation`, `color`, `icon`, `theme`, `font`, `visual`, `render`, `screen`,
    `layout`, `component`, `css`, `ui`, `page`, `responsive`) →
    `ui-build-verify`.
  - Bug signals (`fix`, `bug`, `regression`, `broken`, `error`, `crash`) →
    `bug-hunt`.
  - Substantive feature/backend tasks with no UI or bug signals →
    `plan-implement-review`.
  - Default fallback for a single-agent codex-only task matching no signal set →
    `simple-codex`.
- [ ] 1.2 Honor an explicit workflow override field ahead of classification.
- [ ] 1.3 Return the chosen workflow plus the matched signal keywords that drove
  the choice (for display/audit in the dry-run preview).

## 2. Dry-run composition

- [ ] 2.1 Add `electron/conductor/dry-run.ts` that, for a task, resolves each
  workflow role to an agent (config resolver), runs the auth inspector for those
  agents, and runs capacity evaluation for the planned steps.
- [ ] 2.2 Assemble a preview: selected workflow, role→agent assignments, planned
  worktrees (paths only, not created), required permissions, expected artifacts,
  capacity plan, and auth warnings.
- [ ] 2.3 Apply request role overrides before resolution.
- [ ] 2.4 Include selected adapter capabilities/auth posture and a versioned
  manifest draft with effective-config/policy digests.

## 3. Entry point & approval

- [ ] 3.1 Wire the conduct dialog/request to produce the preview without side
  effects.
- [ ] 3.2 Require an explicit approve/cancel result; cancel performs no writes
  and launches nothing.
- [ ] 3.3 Add a `src/conductor/` preview view rendering the dry-run result.

## 4. IPC surface

- [ ] 4.1 Add `ConductorDryRun` to the `IPC` enum and preload allowlist.
- [ ] 4.2 Add request/response payload types to `src/ipc/types.ts`.

## 5. Verification

- [ ] 5.1 Unit tests: a backend feature task selects `plan-implement-review`; a
  UI task selects `ui-build-verify`; a bug task (`fix`/`regression`) selects
  `bug-hunt`; an unmatched task falls back to `simple-codex`; matching is
  case-insensitive; workflow/role request overrides apply; the preview includes
  adapter capability, capacity, auth, gate, and manifest-digest details; a
  cancel produces zero side effects.
- [ ] 5.2 `npm run typecheck` clean.
- [ ] 5.3 `openspec validate --all --strict` passes.
