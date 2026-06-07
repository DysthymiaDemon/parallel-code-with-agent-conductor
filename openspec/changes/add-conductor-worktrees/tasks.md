## 1. Worktree creation

- [ ] 1.1 Add `electron/conductor/worktrees.ts` creating a worktree under the
  configured root (`.worktrees/`) on a fresh branch named
  `{workflow}-{role}-{slug}-{timestamp}`, reusing `electron/ipc/git.ts`. Branch
  rules: `{timestamp}` = `YYYYMMDD` (UTC); `{slug}` = first 20 chars of task
  text, non-alphanumeric → `-`, lowercased to `[a-z0-9-]`; total name truncated
  to 100 chars. Return a `WorktreeRef { worktreePath, branchName, role, runId }`.
- [ ] 1.2 Only create a writable worktree for writable roles
  (`implementer`, `fixer`); when `ConductorCreateWorktree` is called for `fixer`
  with the same `runId` as a prior `implementer` step, return the existing
  implementer worktree path rather than creating a new one.
- [ ] 1.3 Do not create a writable worktree for read-only roles
  (`planner`, `reviewer`).
- [ ] 1.4 Persist each run's `WorktreeRef`s through `add-conductor-run-store`
  so subsequent steps can look up a worktree by `role` + `runId`.

## 2. Failure & dirty-state handling

- [ ] 2.1 If the repo working tree is dirty in a way that blocks worktree
  creation, return an explicit error result rather than proceeding.
- [ ] 2.2 If `git worktree add` fails, surface the failure; do not leave a
  partial branch/worktree silently.

## 3. Protected paths

- [ ] 3.1 Add `electron/conductor/protected-paths.ts` reading
  `.parallel-code/policies/protected-paths.yaml`. When the file is absent, use
  the built-in default: `deny_write` for `.env`, `.env.*`, `secrets/**`,
  `credentials/**`; `ask_before_write` for `package.json`, `package-lock.json`,
  `migrations/**`.
- [ ] 3.2 Classify a target path as `deny`, `ask`, or `allow`: `deny_write`
  globs → `deny`; `ask_before_write` globs → `ask`; otherwise `allow`. A
  `deny`-classified write transitions the run to `failed` with the denied path.
- [ ] 3.3 Expose `ConductorCheckProtectedPath` so a write can be checked before
  it happens.
- [ ] 3.4 Canonicalize paths, resolve symlinks, and reject policy evaluation
  that escapes the approved repository/worktree roots.

## 4. Editor bridge

- [ ] 4.1 Provide an "Open Worktree in Editor" action using the configured
  editor command from the editor bridge (generic `{editor} {worktree_path}`).

## 5. IPC surface

- [ ] 5.1 Add `ConductorCreateWorktree` (`'conductor_create_worktree'`),
  `ConductorCleanupWorktree` (`'conductor_cleanup_worktree'`), and
  `ConductorCheckProtectedPath` (`'conductor_check_protected_path'`) to the
  `IPC` enum and preload allowlist.
- [ ] 5.2 Add payload types to `src/ipc/types.ts`.

## 6. Verification

- [ ] 6.1 Unit tests: writable role yields a worktree under `.worktrees/` on a
  new branch and returns a `WorktreeRef`; `fixer` with the same `runId` reuses
  the implementer worktree; read-only role yields none; `.env` → `deny`;
  `package.json` → `ask`; `src/foo.ts` → `allow`; a missing policy file uses the
  built-in default (`.env` still `deny`); a `deny` write transitions the run to
  `failed`; dirty/failed creation returns an explicit error; symlink/path
  traversal is rejected; shared Git metadata cannot be mutated except through
  the privileged-operation broker.
- [ ] 6.2 `npm run typecheck` clean.
- [ ] 6.3 `openspec validate --all --strict` passes.
