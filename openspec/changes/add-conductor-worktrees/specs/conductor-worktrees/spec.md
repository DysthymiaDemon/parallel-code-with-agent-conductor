# Conductor Worktrees Specification

## ADDED Requirements

### Requirement: Writable roles run in an isolated worktree

The app SHALL create an isolated git worktree under the configured worktree root
for writable roles, on a fresh branch named
`{workflow}-{role}-{slug}-{timestamp}`, and SHALL NOT create a writable worktree
for read-only roles. Creation is exposed through `ConductorCreateWorktree`, which
returns a `WorktreeRef`.

`ConductorCreateWorktree` returns a typed reference:

```
WorktreeRef {
  worktreePath: string
  branchName: string
  role: RoleName
  runId: string
}
```

The conductor persists each run's `WorktreeRef`s (in run state) so subsequent
steps can look up a worktree by `role` + `runId`.

Branch-name construction:

- `{workflow}` = the selected workflow id (e.g. `plan-implement-review`).
- `{role}` = the role id (e.g. `implementer`).
- `{timestamp}` = `YYYYMMDD` (UTC).
- `{slug}` = first 20 chars of the task text with non-alphanumeric chars
  replaced by `-`, lowercased and trimmed to `[a-z0-9-]`.
- The total branch name is truncated to 100 chars.
- Example: `bug-hunt-implementer-fix-login-butto-20260604`.

#### Scenario: Implementer gets a writable worktree

- **WHEN** `ConductorCreateWorktree` is requested for the `implementer` role of
  a run
- **THEN** a new worktree is created under `.worktrees/`
- **AND** it is checked out on a new branch whose name encodes the workflow,
  role, task slug, and a `YYYYMMDD` timestamp
- **AND** the returned `WorktreeRef` records the `worktreePath`, `branchName`,
  `role`, and `runId`

#### Scenario: Reviewer gets no writable worktree

- **WHEN** worktree creation is requested for the `reviewer` or `planner` role
- **THEN** no writable worktree is created for that role

#### Scenario: Fixer reuses the implementer worktree

- **WHEN** `ConductorCreateWorktree` is called for role `fixer` with the same
  `runId` as a prior `implementer` step
- **THEN** the existing implementer worktree path is returned rather than
  creating a new one
- **AND** the returned `WorktreeRef` references the implementer's
  `worktreePath` and `branchName`

### Requirement: Dirty repo and creation failure are explicit

The app SHALL surface an explicit error when the repository state prevents
worktree creation or when the underlying git operation fails, and SHALL NOT
proceed as if a worktree exists.

#### Scenario: Creation failure surfaces

- **WHEN** the underlying `git worktree add` fails
- **THEN** `ConductorCreateWorktree` returns an error result describing the
  failure
- **AND** the run does not advance to a writable step

### Requirement: Protected-path policy classifies writes

The app SHALL classify a target path against the protected-paths policy as
`deny`, `ask`, or `allow`, exposed through `ConductorCheckProtectedPath`. When
the policy file `.parallel-code/policies/protected-paths.yaml` does not exist,
the app SHALL use a built-in default policy.

Built-in default (used when the policy file is absent):

- `deny_write`: `.env`, `.env.*`, `secrets/**`, `credentials/**`
- `ask_before_write`: `package.json`, `package-lock.json`, `migrations/**`

#### Scenario: Secret path is denied

- **WHEN** a write to `.env` (or a `secrets/**` path) is checked
- **THEN** the classification is `deny`

#### Scenario: Lockfile requires asking

- **WHEN** a write to `package.json` or a lockfile (or a `migrations/**` path)
  is checked
- **THEN** the classification is `ask`

#### Scenario: Ordinary source is allowed

- **WHEN** a write to an ordinary source file (e.g. `src/foo.ts`) is checked
- **THEN** the classification is `allow`

#### Scenario: Missing policy file uses built-in default

- **WHEN** `.parallel-code/policies/protected-paths.yaml` does not exist
- **THEN** the app uses the built-in default policy: `deny_write` for `.env`,
  `.env.*`, `secrets/**`, `credentials/**`; `ask_before_write` for
  `package.json`, `package-lock.json`, `migrations/**`
- **AND** a write to `.env` is still classified `deny`

#### Scenario: Denied write fails the run

- **WHEN** a write targets a `deny`-classified path
- **THEN** the write is refused
- **AND** the run transitions to `failed` with error detail identifying the
  denied path

### Requirement: Worktree cleanup is explicit and gated

The app SHALL remove a conductor worktree only through `ConductorCleanupWorktree`,
and SHALL NOT remove a worktree that still has uncommitted or unmerged work
without an explicit caller request.

#### Scenario: Cleanup removes a finished worktree

- **WHEN** `ConductorCleanupWorktree` is called with a `WorktreeRef` for a run
  whose work is complete
- **THEN** the worktree directory and its branch registration are removed
- **AND** the run's persisted `WorktreeRef` for that role is cleared

#### Scenario: Cleanup of unknown ref is a no-op error

- **WHEN** `ConductorCleanupWorktree` is called with a ref that does not match a
  persisted worktree
- **THEN** an explicit error result is returned
- **AND** no unrelated worktree is removed

### Requirement: No merge or push from a conductor worktree

The app SHALL NOT merge or push from a conductor worktree without human
approval; worktree work stays local until a gate is satisfied.

#### Scenario: No automatic push

- **WHEN** a writable step completes in a worktree
- **THEN** the app does not push the branch
- **AND** does not merge it into the default branch
