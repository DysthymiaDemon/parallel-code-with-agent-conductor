# Conductor Auth Inspector Specification

## ADDED Requirements

### Requirement: Detect subscription-bypassing API keys per agent

Before any agent thread is launched, the app SHALL inspect the environment for
the API-key variables configured for each agent the run will use, and SHALL
report which are present. Inspection is exposed through the
`ConductorInspectAuth` IPC channel.

#### Scenario: API key present for Codex

- **WHEN** the renderer sends `ConductorInspectAuth` for a run that uses the
  `codex` agent
- **AND** `OPENAI_API_KEY` or `CODEX_API_KEY` exists in the environment
- **THEN** the result classifies `codex` as `api_key_detected`
- **AND** the result lists the detected variable name(s)

#### Scenario: No API key present

- **WHEN** `ConductorInspectAuth` is sent for an agent whose configured
  `env_api_keys` are all absent from the environment
- **THEN** that agent is classified `subscription_preferred`
- **AND** no warning is produced for that agent

#### Scenario: Claude key detected

- **WHEN** the run uses `claude` and `ANTHROPIC_API_KEY` is present
- **THEN** `claude` is classified `api_key_detected`
- **AND** the warning's recommended action is to use the Claude subscription
  login

### Requirement: Never expose secret values

The app SHALL determine only the presence of API-key environment variables and
SHALL NOT include their values in any result, event, or log line.

#### Scenario: Result contains no secret value

- **WHEN** `ConductorInspectAuth` returns a result for an environment where
  `OPENAI_API_KEY` is set to a non-empty value
- **THEN** the result contains the variable *name* but not its value
- **AND** no log line emitted during the inspection contains the value

### Requirement: Block-unless-explicit honors policy

When `auth_policy.block_api_keys_unless_explicit` is true and an API key is
detected for an agent, the app SHALL mark that agent's per-run auth decision as
blocked until the user explicitly chooses to use the API key once.

#### Scenario: Detected key blocks pending explicit choice

- **WHEN** `block_api_keys_unless_explicit` is true
- **AND** an API key is detected for an agent in the run
- **THEN** the per-run decision for that agent is `blocked_pending_explicit`
- **AND** the available options include `use_subscription`, `use_api_key_once`,
  and `cancel`

#### Scenario: Explicit opt-in is recorded

- **WHEN** the user chooses `use_api_key_once` for an agent that was
  `blocked_pending_explicit`
- **THEN** the recorded per-run decision for that agent becomes
  `api_key_explicit`

#### Scenario: Policy disabled does not block

- **WHEN** `auth_policy.warn_on_api_keys` is true but
  `block_api_keys_unless_explicit` is false
- **AND** an API key is detected
- **THEN** a warning is produced
- **AND** the decision is not set to `blocked_pending_explicit`
