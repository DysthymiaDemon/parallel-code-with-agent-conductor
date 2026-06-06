# Conductor Dry-Run Specification

## ADDED Requirements

### Requirement: Deterministic task classification

The app SHALL map a described task to one of the four fixed workflows using
deterministic keyword rules, and SHALL prefer an explicit `--workflow=` override
over classification. Matching SHALL be case-insensitive. The result SHALL report
which matched signal keywords drove the selection so the dry-run preview can
display them.

The classifier signal sets are:

- **`ui-build-verify`** — UI signals: `button`, `modal`, `form`, `dialog`,
  `sidebar`, `style`, `animation`, `color`, `icon`, `theme`, `font`, `visual`,
  `render`, `screen`, `layout`, `component`, `css`, `ui`, `page`, `responsive`.
- **`bug-hunt`** — bug signals: `fix`, `bug`, `regression`, `broken`, `error`,
  `crash`.
- **`plan-implement-review`** — selected for substantive feature/backend tasks
  with no UI or bug signals.
- **`simple-codex`** — default fallback for a single-agent, codex-only task that
  matches no other signal set.

Precedence when signals overlap: explicit `--workflow=` override, then UI
signals, then bug signals, then `plan-implement-review` for feature work, then
`simple-codex` as the fallback.

#### Scenario: UI task selects ui-build-verify

- **WHEN** a `/conduct` task contains UI signals (e.g. "responsive onboarding
  screen")
- **THEN** the classifier selects the `ui-build-verify` workflow
- **AND** the result lists the matched UI signal keywords (`responsive`,
  `screen`)

#### Scenario: Matching is case-insensitive

- **WHEN** a `/conduct` task contains a signal in mixed case (e.g. "Fix the
  Modal CSS")
- **THEN** the classifier matches the signal regardless of case
- **AND** the result lists the matched keywords as configured (lowercased)

#### Scenario: Bug task selects bug-hunt

- **WHEN** a `/conduct` task contains bug signals and no UI signals (e.g. "fix
  the login token refresh regression")
- **THEN** the classifier selects the `bug-hunt` workflow
- **AND** the result lists the matched bug keywords (`fix`, `regression`)

#### Scenario: Feature task selects plan-implement-review

- **WHEN** a `/conduct` task has no UI and no bug signals (e.g. "add a CSV
  export endpoint to the reports service")
- **THEN** the classifier selects the `plan-implement-review` workflow

#### Scenario: Unmatched task falls back to simple-codex

- **WHEN** a `/conduct` task matches no UI, bug, or feature signal set
- **THEN** the classifier selects the `simple-codex` workflow as the default
  single-agent fallback

#### Scenario: Explicit workflow override wins

- **WHEN** a `/conduct` task passes `--workflow=plan-implement-review`
- **AND** the task text would otherwise classify as `ui-build-verify`
- **THEN** the selected workflow is `plan-implement-review`

### Requirement: Dry-run preview without side effects

When invoked with `--dry-run`, the app SHALL produce a preview of the planned
run and SHALL NOT launch any agent, create any worktree, or write any project
file. The preview is produced through the `ConductorDryRun` IPC channel.

#### Scenario: Preview contents

- **WHEN** the renderer sends `ConductorDryRun` for a task
- **THEN** the result includes the selected workflow, the role→agent
  assignments, the planned worktree paths, the required permissions, the
  expected artifacts, the capacity plan, and any auth warnings

#### Scenario: No side effects during dry run

- **WHEN** `ConductorDryRun` completes
- **THEN** no agent process has been spawned
- **AND** no directory has been created under `.worktrees/`
- **AND** no file has been written under the project working tree

### Requirement: Role overrides apply before resolution

The app SHALL apply command-line role overrides before resolving roles to
agents in the preview.

#### Scenario: Implementer override changes the assignment

- **WHEN** a `/conduct` task passes `--implementer=codex`
- **AND** the config binds `implementer→claude-code`
- **THEN** the preview's `implementer` assignment is `codex`

### Requirement: Explicit approval gate before proceeding

The app SHALL require an explicit approve or cancel decision after the preview,
and a cancel SHALL leave the system unchanged.

#### Scenario: Cancel leaves no trace

- **WHEN** the user cancels after viewing a dry-run preview
- **THEN** no run is started
- **AND** no worktree, artifact directory, or agent process is created

#### Scenario: Approval is required to advance

- **WHEN** a dry-run preview is shown
- **THEN** the run does not advance to execution until the user explicitly
  approves it

### Requirement: Four fixed workflow presets exist as data

The app SHALL read the four fixed workflow presets from
`.parallel-code/workflows/*.yaml` as data, and SHALL generate any missing preset
from the built-in default on first use. Each preset is an ordered list of steps;
each step binds a `role` to its `agent` (a real agent id), declares its input and
output artifacts, and marks whether it is a human gate. The minimal step
structure for each preset is:

**`simple-codex.yaml`** — single-agent implement:

| Step | role | agent | inputs | outputs | gate |
|---|---|---|---|---|---|
| 1 | implementer | codex | — | implementation.diff, test-report.json, final-summary.md | — |

**`plan-implement-review.yaml`** — plan → gate → implement → review → gate:

| Step | role | agent | inputs | outputs | gate |
|---|---|---|---|---|---|
| 1 | planner | claude-code | — | plan.md | — |
| 2 | (gate) | — | plan.md | accepted-plan.md | plan-approval |
| 3 | implementer | codex | accepted-plan.md | implementation.diff, test-report.json | — |
| 4 | reviewer | claude-code | accepted-plan.md, implementation.diff, test-report.json | code-review.md, final-summary.md | — |
| 5 | (gate) | — | code-review.md, final-summary.md | — | final-approval |

**`ui-build-verify.yaml`** — plan → implement → UI verify → review:

| Step | role | agent | inputs | outputs | gate |
|---|---|---|---|---|---|
| 1 | planner | claude-code | — | plan.md | — |
| 2 | (gate) | — | plan.md | accepted-plan.md | plan-approval |
| 3 | implementer | codex | accepted-plan.md | implementation.diff, test-report.json | — |
| 4 | ui_verifier | antigravity (fallback gemini) | implementation.diff | ui-review.md | — |
| 5 | reviewer | claude-code | implementation.diff, ui-review.md | code-review.md, final-summary.md | — |
| 6 | (gate) | — | code-review.md, final-summary.md | — | final-approval |

**`bug-hunt.yaml`** — implement fix → review → fix loop:

| Step | role | agent | inputs | outputs | gate |
|---|---|---|---|---|---|
| 1 | implementer | codex | — | implementation.diff, test-report.json, final-summary.md | — |
| 2 | reviewer | claude-code | implementation.diff, test-report.json | code-review.md | — |
| 3 | fixer | codex | code-review.md, implementation.diff | implementation.diff, test-report.json, final-summary.md | — |
| 4 | (gate) | — | code-review.md, final-summary.md | — | final-approval |

#### Scenario: Missing preset generated from default

- **WHEN** a workflow preset YAML referenced by the classifier is absent from
  `.parallel-code/workflows/`
- **THEN** the app generates it from the built-in default with the step
  structure above
- **AND** the generated preset binds each role to a real agent id

#### Scenario: Preset steps bind real agent ids

- **WHEN** a workflow preset is loaded
- **THEN** every step's `agent` is an id present in the `AgentDef` registry
- **AND** no step references a placeholder id such as `claude` or `google_visual`
