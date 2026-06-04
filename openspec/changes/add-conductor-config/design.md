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

This change only reads/writes `conductor.yaml` and `roles.yaml`. To avoid
committing nothing useful while keeping generated dirs ignored, the
implementation adds nested ignore rules so `state/`, `artifacts/`, and
`agents/` stay ignored while `conductor.yaml`/`roles.yaml`/`workflows/`/
`policies/` are trackable. The exact `.gitignore` mechanics are an
implementation detail; the **requirement** is only that committed config and
generated state never share a writer and that defaulting never overwrites an
existing committed file.

## Validation model

Validation is schema-shaped and returns the *first actionable* problem with a
path (e.g. `roles.implementer.primary: unknown agent 'codx'`). Unknown agent
ids are validated against the live `AgentDef` registry, not a hardcoded list,
so adding an agent to the registry automatically makes it bindable. A missing
`conductor.yaml` is **not** an error — it triggers default generation. A present
but malformed `conductor.yaml` **is** an error and never silently falls back to
defaults (silent fallback would mask a typo that changes which agent runs).

## Role resolution precedence

```text
1. explicit command override   (e.g. /conduct ... --implementer=codex)
2. .parallel-code/conductor.yaml roles block
3. .parallel-code/roles.yaml
4. built-in defaults (Ameen's Default)
```

Resolution returns the primary agent if available in the registry, otherwise
the first available fallback, otherwise an explicit "unresolved role" result
(never a silent substitution). Availability here means "present in the registry
and not disabled" — auth/installation checks belong to `add-conductor-auth-inspector`.

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
