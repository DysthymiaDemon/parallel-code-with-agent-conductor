# ExecPlans — Format and Instructions for Codex

An **ExecPlan** is a living, self-contained document Codex reads and updates
throughout a multi-step implementation. It is Codex's working memory across
context resets and the single source of truth on what was done, what was found,
and what remains.

## When to use an ExecPlan

Use an ExecPlan for any task that spans multiple OpenSpec changes or takes more
than one session to complete. Single-file or single-function changes do not need
one; inline context in the task is sufficient.

For the **Conductor MVP**, the ExecPlan is at `Starter Pack/Plan.md`. Read it
before beginning any multi-change implementation work. The MVP uses one shared
ExecPlan across five milestone-scoped `/goal` runs; `Starter Pack/Goal.md`
defines each run's singular objective and stop condition.

## How to use an ExecPlan

1. **Read the plan before starting.** It records context, prior decisions, and
   known surprises you would otherwise re-derive from scratch.
2. **Check the box in Progress** immediately after completing each task. Add the
   date in `(YYYY-MM-DD)` format.
3. **Record unexpected findings in Surprises & Discoveries** the moment you
   discover them — a missing file, a conflicting type, a hidden dependency, an
   incorrect assumption in the spec.
4. **Log every non-obvious decision in the Decision Log** with date and
   rationale. Future sessions must not re-derive it.
5. **Do not fill Outcomes & Retrospective** until the entire plan is complete.
6. **Promote durable architecture decisions to `docs/adr/`.** The ExecPlan may
   summarize them, but decisions that constrain future implementations need a
   stable ADR and must not live only in a mutable plan.
7. **Require a Codex repository-validation gate.** A conceptual plan is not
   executable until Codex has inspected the actual repository and updated the
   plan with real affected files, existing patterns, tests, edge cases,
   dependency/migration risks, recovery behavior, and safer implementation
   order.
8. **Record an evidence and tooling plan.** Name the repository evidence,
   primary documentation, checks, and task-relevant skills/plugins/MCP servers
   that will be used. Explain why each external or write-capable tool is needed.
9. **Define the execution-feedback loop.** Name the earliest safe probe, its
   deterministic evaluator, attempt budget, changed retry strategy, and stop or
   escalation condition. Never use a protected or irreversible effect as a
   probe.
10. **Run one milestone per goal.** For the Conductor MVP, never ask one
    `/goal` run to complete the whole ExecPlan or cross a milestone checkpoint.
    Verify the current milestone's stop condition, record evidence and plan
    updates, then stop for the next human decision.

## Required Sections

Every ExecPlan contains these sections in this order. All are non-negotiable.

| Section                         | When to write        | What goes in it                                                          |
| ------------------------------- | -------------------- | ------------------------------------------------------------------------ |
| **Purpose / Big Picture**       | Before starting      | One paragraph: the outcome and why it matters                            |
| **Context and Orientation**     | Before starting      | Key files (full paths), stack, terms defined                             |
| **Plan of Work**                | Before starting      | Ordered phases; what each delivers                                       |
| **Concrete Steps**              | Before starting      | Exact commands: validate, typecheck, test                                |
| **Validation and Acceptance**   | Before starting      | Verifiable behavior, not just "the tests pass"                           |
| **Idempotence and Recovery**    | Before starting      | How to re-run safely if a step fails                                     |
| **Interfaces and Dependencies** | Before starting      | TypeScript types; IPC channel names + values                             |
| **Evidence and Tooling**        | Before starting      | Repo evidence, primary sources, relevant skills/plugins/MCP, permissions |
| **Feedback and Retry Strategy** | Before starting      | Safe probe, evaluator, attempt budget, changed retry, stop condition     |
| **Progress**                    | Updated continuously | Checkbox per task with date                                              |
| **Surprises & Discoveries**     | Updated continuously | Unexpected findings, one line + date                                     |
| **Decision Log**                | Updated continuously | Key decision, rationale, date                                            |
| **Outcomes & Retrospective**    | At completion only   | What shipped, what was skipped, lessons                                  |

## Rules

- The plan is **self-contained**. A Codex session with no prior conversation must
  be able to pick it up and continue without asking questions. Define every
  abbreviation and every file path.
- An ExecPlan may span multiple milestone goals, but each `/goal` must still
  have one clear objective and one verifiable stopping condition. The ExecPlan
  is shared working memory, not authorization to execute its entire backlog.
- Progress checkboxes track **task-group-level** completion (one per major task
  block in `tasks.md`), not line-by-line.
- Surprises belong in the plan, not in code comments. A future session reads
  the plan first; it may not read every comment.
- **The plan does not replace the specs.** OpenSpec changes in
  `openspec/changes/add-conductor-*/` remain the authoritative per-capability
  requirements. The plan records _why_ and _in what order_; the specs record
  _what_ behavior is required.
- **`tasks.md` wins over `Plan.md`** when the two disagree on IPC channel names,
  type names, or file paths. The spec files are authoritative; Plan.md is
  orientation.
- Research tools, plugins, MCP servers, and parallel agents provide evidence,
  not authority. Record useful sources and verify safety-critical claims against
  primary documentation, pinned versions, and repository behavior.
- Prefer progressive tool discovery and the smallest relevant skill set. Do not
  put detailed task-specific guidance into repository-wide instructions when a
  scoped skill or path-specific instruction would keep unrelated tasks cleaner.
- Prefer early evidence from safe, reversible, cheap, deterministically
  evaluable actions over extended speculative reflection. High-risk actions
  remain plan-first, dry-run or simulation first, and human-gated.
- A retry must respond to observed evidence by changing inputs, strategy, or
  preconditions. Bound retries and stop or escalate when feedback is ambiguous,
  no evaluator exists, or attempts make no progress.

## ExecPlan Skeleton

When starting a new plan for work outside the Conductor MVP, copy this skeleton:

---

````markdown
# ExecPlan: <Title>

## Purpose / Big Picture

<One paragraph: what this work achieves and why it matters.>

## Context and Orientation

**Architecture:** <2–3 sentences.>

**Key files:**

- `<path>` — <role>

**Terms:**

- `<term>` — <definition>

## Plan of Work

| Phase | Spec Change | What it delivers |
| ----- | ----------- | ---------------- |
| 0     | ...         | ...              |

## Concrete Steps

```bash
npx openspec validate --all --strict
npm run typecheck
npx vitest run
```
````

## Validation and Acceptance

- [ ] <User-visible or command-verifiable outcome>

## Idempotence and Recovery

<How to safely re-run each phase if interrupted.>

## Interfaces and Dependencies

<TypeScript types and IPC channel enum values.>

## Evidence and Tooling

<Repository evidence, primary sources, relevant skills/plugins/MCP, permissions,
and why each external tool is needed.>

## Feedback and Retry Strategy

<Earliest safe probe, deterministic evaluator, attempt budget, what must change
before retry, and stop or escalation condition.>

---

## Progress

- [ ] Preflight: <task> (YYYY-MM-DD)

## Surprises & Discoveries

_(Fill during implementation.)_

## Decision Log

| Date | Decision | Rationale |
| ---- | -------- | --------- |

## Outcomes & Retrospective

_(Fill at completion.)_

```

```
