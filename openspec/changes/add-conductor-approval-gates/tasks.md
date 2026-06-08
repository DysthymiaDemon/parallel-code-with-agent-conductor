## 1. Gate mechanism

- [ ] 1.1 Add `electron/conductor/approvals.ts` for explicit approve/reject
      decisions bound to immutable run-store effect intents.
- [ ] 1.2 On dry-run approval, freeze the approved manifest, allocate the run
      transactionally, and create its artifact directory; cancel creates neither.
- [ ] 1.3 Persist pending/resolved gates through `add-conductor-run-store`;
      do not create a separate pending-gates file.
- [ ] 1.4 Revalidate intent, approval, and expected state at the privileged
      operation broker before execution.

## 2. Mandatory and risky gates

- [ ] 2.1 Require plan approval before implementation and final approval before
      commit/merge.
- [ ] 2.2 Gate commit, push, merge, install, migration, delete, and `ask` paths
      per policy; refuse `deny` paths outright.

## 3. Lifecycle and IPC

- [ ] 3.1 Update the run store's orthogonal execution/readiness/outcome fields
      for pending, rejected, approved, failed, and recovery-required gates.
- [ ] 3.2 Add request/resolve IPC channels, secret-free payloads, and approval UI.

## 4. Verification

- [ ] 4.1 Test immutable manifest binding, restart, stale expected state,
      duplicate resolution, denied paths, and mandatory gates.
- [ ] 4.2 Run `npm run typecheck` and `npm run check:spec`.
