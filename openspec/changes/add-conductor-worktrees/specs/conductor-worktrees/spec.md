# Conductor Worktrees Specification

## ADDED Requirements

### Requirement: Writable roles run in an isolated worktree

The app SHALL create an isolated git worktree under the configured worktree root
for writable roles, on a fresh branch named
`{workflow}-{role}-{slug}-{timestamp}`, and SHALL NOT create a writable worktree
for read-only roles. Creation is exposed through `ConductorCreateWorktree`.

#### Scenario: Implementer gets a writable worktree

- **WHEN** `ConductorCreateWorktree` is requested for the `implementer` role of
  a run
- **THEN** a new worktree is created under `.worktrees/`
- **AND** it is checked out on a new branch whose name encodes the workflow,
  role, task slug, and a timestamp

#### Scenario: Reviewer gets no writable worktree

- **WHEN** worktree creation is requested for the `reviewer` or `planner` role
- **THEN** no writable worktree is created for that role

#### Scenario: Fixer reuses the implementer worktree

- **WHEN** the `fixer` role runs for the same work item as a prior
  `implementer` step
- **THEN** it operates in the implementer's existing worktree rather than a new
  one

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
`deny`, `ask`, or `allow`, exposed through `ConductorCheckProtectedPath`.

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

### Requirement: No merge or push from a conductor worktree

The app SHALL NOT merge or push from a conductor worktree without human
approval; worktree work stays local until a gate is satisfied.

#### Scenario: No automatic push

- **WHEN** a writable step completes in a worktree
- **THEN** the app does not push the branch
- **AND** does not merge it into the default branch
