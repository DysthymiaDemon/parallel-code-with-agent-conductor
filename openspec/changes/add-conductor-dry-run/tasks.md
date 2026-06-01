## 1. Task classifier

- [ ] 1.1 Add `electron/conductor/classify.ts` with deterministic rules mapping
  a task string to a workflow: UI signals (ui, screen, page, responsive,
  component, layout, css) → `ui-build-verify`; otherwise → `plan-implement-review`.
- [ ] 1.2 Honor an explicit `--workflow=` override ahead of classification.
- [ ] 1.3 Return the chosen workflow plus the signals that drove the choice (for
  display/audit).

## 2. Dry-run composition

- [ ] 2.1 Add `electron/conductor/dry-run.ts` that, for a task, resolves each
  workflow role to an agent (config resolver), runs the auth inspector for those
  agents, and runs capacity evaluation for the planned steps.
- [ ] 2.2 Assemble a preview: selected workflow, role→agent assignments, planned
  worktrees (paths only, not created), required permissions, expected artifacts,
  capacity plan, and auth warnings.
- [ ] 2.3 Apply command-line role overrides (e.g. `--implementer=codex`) before
  resolution.

## 3. Entry point & approval

- [ ] 3.1 Wire `/conduct <task> --dry-run` to produce the preview without side
  effects.
- [ ] 3.2 Require an explicit approve/cancel result; cancel performs no writes
  and launches nothing.
- [ ] 3.3 Add a `src/conductor/` preview view rendering the dry-run result.

## 4. IPC surface

- [ ] 4.1 Add `ConductorDryRun` to the `IPC` enum and preload allowlist.
- [ ] 4.2 Add request/response payload types to `src/ipc/types.ts`.

## 5. Verification

- [ ] 5.1 Unit tests: a backend task selects `plan-implement-review`; a UI task
  selects `ui-build-verify`; `--workflow=` overrides classification;
  `--implementer=` override changes the resolved agent; the preview includes a
  capacity plan and auth warnings; a cancel produces zero side effects.
- [ ] 5.2 `npm run typecheck` clean.
- [ ] 5.3 `openspec validate --all --strict` passes.
