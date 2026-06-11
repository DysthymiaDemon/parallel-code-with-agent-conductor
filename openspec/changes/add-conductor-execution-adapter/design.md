# Design: Conductor Execution Adapter

## Decisions

### Approved manifest is the execution input

The adapter does not re-resolve mutable config after approval. It loads the
immutable approved manifest from the run store and verifies its digest.

### Provider adapters own provider integration

The execution layer invokes the selected `AgentAdapter`. Approved billing route
is preserved first; structured interfaces are preferred only within that route.
Native interactive PTY is a first-class adapter when it is the supported
subscription route. The execution layer never silently substitutes API-key,
cloud, enterprise, SDK-credit, headless-credit, or different-provider
execution.

### Privilege is enforced at final effect boundaries

Prompts and an adapter-only restricted flag are not security controls. A
privileged-operation broker authorizes immutable effect intents at the final
backend entrypoints that mutate Git, files, dependencies, databases, or remote
state. Existing manual flows retain their current authorization path.

### Sandbox profiles fail closed

Writable and read-only conductor roles receive explicit macOS/Linux sandbox
profiles, minimal allowlisted child environments, canonical path checks, and
separate artifact access. If the required profile cannot be enforced, launch
fails. Worktrees remain Git-integration isolation, not filesystem containment.
Provider-specific native profiles may expose only the provider-owned login
facility required by the approved subscription CLI. Antigravity stays native
while its keychain-backed login cannot authenticate inside Docker.

### Run store owns lifecycle and recovery

The execution adapter emits transitions and effect outcomes through
`add-conductor-run-store`; it does not maintain parallel JSON state. Ambiguous
effects are reconciled or require human recovery and are never blindly retried.
