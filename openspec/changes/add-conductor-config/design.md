# Design — Add Conductor Config

## Committed config vs. generated runtime state

`.parallel-code/` is already `.gitignore`d and used by existing MCP/Docker
coordination as runtime state. Making it the home of durable conductor config
creates a collision risk: durable, human-edited, version-worthy files would sit
next to disposable generated files. The split is therefore explicit and
enforced by where each writer is allowed to write.

```text
.parallel-code/
  conductor.yaml        # committed, human-edited (this change writes the default)
  roles.yaml            # committed, optional role overrides
  workflows/            # committed, later changes
  policies/             # committed, later changes
  state/                # generated, git-ignored (later changes)
  artifacts/            # generated, git-ignored (later changes)
  agents/               # generated, git-ignored (later changes)
```

This change only reads/writes `conductor.yaml` and `roles.yaml`. Because the
root `.gitignore` currently ignores `.parallel-code/` wholesale, a nested
`.parallel-code/.gitignore` cannot make descendants trackable. The root ignore
rules must instead ignore `.parallel-code/*` and explicitly negate the durable
config files/directories. Verify the result with `git add -An`: durable config
must be addable while generated `state/`, `artifacts/`, and `agents/` remain
ignored.

## Validation model

Validation is schema-shaped and returns the _first actionable_ problem with a
path (e.g. `roles.implementer.primary: unknown agent 'codx'`). Unknown agent
ids are validated against the live `AgentDef` registry, not a hardcoded list,
so adding an agent to the registry automatically makes it bindable. A missing
`conductor.yaml` is **not** an error and resolves to in-memory defaults without
writing. Persisting defaults is an explicit initialization action. A present
but malformed `conductor.yaml` **is** an error and never silently falls back to
defaults (silent fallback would mask a typo that changes which agent runs).

## Role resolution precedence

```text
1. explicit conduct-dialog override
2. .parallel-code/roles.yaml   (overlay — replaces, does not merge)
3. .parallel-code/conductor.yaml roles block
4. built-in defaults (Ameen's Default)
```

`roles.yaml` has higher precedence than `conductor.yaml` because it is an
overlay: a binding it defines replaces the entire corresponding binding from
`conductor.yaml` rather than merging with it.

Validation requires every configured primary and fallback id to exist in the
registry. Resolution then returns the primary adapter if it is currently
available, otherwise the first currently available fallback, otherwise an
explicit "unresolved role" result. Registry membership and runtime availability
are distinct concepts; capability/availability discovery belongs to
`add-conductor-agent-adapters`, while auth posture belongs to
`add-conductor-auth-inspector`.

## Built-in auth policy

The built-in config uses `subscription_only`. It preserves installed-CLI
provider login, excludes detected API-key variables from conductor child
environments, and rejects API-key, cloud, enterprise, SDK-credit, and
headless-credit routes. Codex prefers managed ChatGPT login, Claude uses native
subscription OAuth, and Google consumer use goes through native Antigravity.
Gemini CLI is not a built-in consumer fallback after June 18, 2026.

## IPC Channel Namespace

New conductor channels use the `Conductor*` prefix exclusively. The existing
`SetCoordinatorModeEnabled` and `MCP_*` channels in `electron/ipc/channels.ts`
belong to the separate `coordinator-mcp-backend` OpenSpec change and must not
be modified by any `add-conductor-*` change.

## TypeScript Types Location

All conductor TypeScript types are added to `src/ipc/types.ts` (augmenting the
existing file). Do not create a new `src/ipc/conductor-types.ts` — that would
fragment the shared type surface and make IPC types harder to discover.

## Why no agent launches here

Keeping this change pure (config + resolution, zero process spawning, zero
working-tree writes) makes it independently testable and reviewable, and lets
every downstream change depend on a stable contract.
