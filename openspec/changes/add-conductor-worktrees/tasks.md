## 1. Worktree creation

- [ ] 1.1 Add `electron/conductor/worktrees.ts` creating a worktree under the
  configured root (`.worktrees/`) on a fresh branch named
  `{workflow}-{role}-{slug}-{timestamp}`, reusing `electron/ipc/git.ts`.
- [ ] 1.2 Only create a writable worktree for writable roles
  (`implementer`, `fixer`); `fixer` reuses the implementer's worktree for the
  same work item.
- [ ] 1.3 Do not create a writable worktree for read-only roles
  (`planner`, `reviewer`).

## 2. Failure & dirty-state handling

- [ ] 2.1 If the repo working tree is dirty in a way that blocks worktree
  creation, return an explicit error result rather than proceeding.
- [ ] 2.2 If `git worktree add` fails, surface the failure; do not leave a
  partial branch/worktree silently.

## 3. Protected paths

- [ ] 3.1 Add `electron/conductor/protected-paths.ts` reading
  `.parallel-code/policies/protected-paths.yaml`.
- [ ] 3.2 Classify a target path as `deny`, `ask`, or `allow`: `deny_write`
  globs → `deny`; `ask_before_write` globs → `ask`; otherwise `allow`.
- [ ] 3.3 Expose `ConductorCheckProtectedPath` so a write can be checked before
  it happens.

## 4. Editor bridge

- [ ] 4.1 Provide an "Open Worktree in Editor" action using the configured
  editor command from the editor bridge (generic `{editor} {worktree_path}`).

## 5. IPC surface

- [ ] 5.1 Add `ConductorCreateWorktree` and `ConductorCheckProtectedPath` to the
  `IPC` enum and preload allowlist.
- [ ] 5.2 Add payload types to `src/ipc/types.ts`.

## 6. Verification

- [ ] 6.1 Unit tests: writable role yields a worktree under `.worktrees/` on a
  new branch; read-only role yields none; `.env` → `deny`; `package.json` →
  `ask`; `src/foo.ts` → `allow`; dirty/failed creation returns an explicit
  error.
- [ ] 6.2 `npm run typecheck` clean.
- [ ] 6.3 `openspec validate --all --strict` passes.
