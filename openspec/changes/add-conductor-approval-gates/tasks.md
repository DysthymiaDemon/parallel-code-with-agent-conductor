## 1. Gate mechanism

- [ ] 1.1 Add `electron/conductor/approvals.ts` exposing a gate that pauses the
  run, emits an approval request, and resolves only on an explicit decision.
- [ ] 1.2 Read which operations are gated from the `approval` policy block of
  `ConductorConfig`.
- [ ] 1.3 Represent a decision as `approved` / `rejected`; a rejected or
  unresolved gate leaves the gated operation undone.
- [ ] 1.4 On dry-run approval, assign a run id (`run_<YYYYMMDD>_<NNN>`) and
  create the run directory by invoking the `add-conductor-artifacts`
  run-directory utility. Cancel assigns no id and creates no directory.
- [ ] 1.5 Persist pending gate state in
  `.parallel-code/state/pending-gates.json`; on app restart, re-present a
  pending gate rather than auto-rejecting it; remove a gate from the file once
  resolved.

## 2. Mandatory workflow gates

- [ ] 2.1 Enforce a plan-approval gate between the planner and implementer steps
  (references `plan.md`; on approve, writes `accepted-plan.md`).
- [ ] 2.2 Enforce a final-approval gate before any commit/merge (references
  `final-summary.md` / final diff).

## 3. Risky-operation gates

- [ ] 3.1 Gate commit, push, merge, package install, database migration, and
  delete per policy; none proceed without `approved`.
- [ ] 3.2 For protected paths: an `ask` classification raises a gate; a `deny`
  classification is refused outright with no gate option (MVP) and transitions
  the run to `failed` with the denied path in the error detail.

## 4. IPC surface

- [ ] 4.1 Add `ConductorRequestApproval` (`'conductor_request_approval'`) and
  `ConductorResolveApproval` (`'conductor_resolve_approval'`) to the `IPC` enum
  and preload allowlist.
- [ ] 4.2 Add payload types to `src/ipc/types.ts`.
- [ ] 4.3 Add an approval prompt surface in `src/conductor/`.

## 5. Verification

- [ ] 5.1 Unit tests: approving a dry-run creates the run dir and assigns a
  `run_<YYYYMMDD>_<NNN>` id while cancel creates neither; implementer cannot
  start before plan approval; merge cannot proceed before final approval; a
  rejected gate leaves the operation undone; `deny` protected path is refused
  with no approve path and transitions the run to `failed`; `ask` path raises a
  gate that proceeds only on approve; a pending gate persisted to
  `pending-gates.json` is re-presented after restart.
- [ ] 5.2 `npm run typecheck` clean.
- [ ] 5.3 `openspec validate --all --strict` passes.
