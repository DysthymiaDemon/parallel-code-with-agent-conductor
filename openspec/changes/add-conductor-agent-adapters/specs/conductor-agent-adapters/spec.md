# Conductor Agent Adapters Specification

## ADDED Requirements

### Requirement: Provider-neutral adapter contract

The app SHALL drive conductor agents through a provider-neutral adapter
contract that reports supported capabilities, adapter version, lifecycle
events, approval requests, cancellation results, auth posture, and provider
backpressure.

#### Scenario: Structured adapter selected

- **WHEN** a resolved agent has a supported structured control interface
- **THEN** the conductor selects its structured adapter
- **AND** the conductor does not depend on terminal-text parsing for lifecycle
  state available through that interface

#### Scenario: PTY fallback is explicit

- **WHEN** an agent has no supported structured control interface
- **THEN** the conductor may select a PTY fallback adapter
- **AND** the dry-run identifies the reduced capability set

### Requirement: Approved billing route takes precedence over adapter structure

The app SHALL preserve the billing route approved in the run manifest before
preferring a structured adapter. It SHALL NOT select SDK credits, API-key
billing, cloud credentials, enterprise credentials, or another provider merely
because that route exposes a more structured interface.

#### Scenario: Structured interface changes billing route

- **WHEN** a structured provider interface would change the approved
  subscription billing route
- **THEN** the conductor does not select that interface
- **AND** selects a capable native interactive adapter or fails closed

#### Scenario: Subscription-backed PTY is approved

- **WHEN** native interactive PTY is the supported route for the approved
  subscription login
- **THEN** PTY is a first-class provider adapter for that step
- **AND** its reduced capabilities are recorded without treating the billing
  route as a fallback

### Requirement: Required adapter capabilities fail closed

The app SHALL refuse to launch a conductor step when the selected adapter lacks
a capability required by the step's approved execution manifest.

#### Scenario: Required approval channel unavailable

- **WHEN** a step requires provider approval forwarding
- **AND** the selected adapter cannot surface provider approval requests
- **THEN** the step does not launch
- **AND** the run records the unsupported required capability

### Requirement: Provider credentials remain provider-owned

The app SHALL invoke official provider software for authentication and SHALL
NOT extract, copy, return, log, or persist provider credential values.

#### Scenario: Auth posture without token extraction

- **WHEN** an adapter reports an authenticated provider session
- **THEN** the result contains only secret-safe auth metadata
- **AND** no OAuth token, refresh token, API-key value, or credential-file
  content is returned

### Requirement: Subscription-only default uses installed CLIs

The built-in subscription-only policy SHALL use locally installed official
provider software and SHALL preserve provider-owned interactive login:
`codex app-server` with managed ChatGPT login (or native Codex PTY fallback),
native interactive `claude`, and native interactive `agy`.

#### Scenario: Claude subscription step resolves

- **WHEN** a Claude role uses the built-in subscription-only policy
- **THEN** the selected adapter launches native interactive `claude`
- **AND** does not launch `claude -p` or an Agent SDK process

#### Scenario: Antigravity subscription step resolves

- **WHEN** an Antigravity role uses the built-in subscription-only policy
- **THEN** the selected adapter launches native interactive `agy`
- **AND** does not select Docker execution while its keychain-backed login is
  unavailable there

#### Scenario: Consumer Gemini CLI is selected after transition

- **WHEN** the consumer-subscription profile selects Gemini CLI on or after
  June 18, 2026
- **THEN** the adapter reports it unavailable
- **AND** does not silently switch to API-key, enterprise, or cloud billing

### Requirement: Provider adapters do not own conductor workflow state

Provider thread, session, task, and approval state SHALL be correlated to the
conductor run but SHALL NOT supersede the conductor's durable run state.

#### Scenario: Provider session resumes

- **WHEN** a provider session is resumed after restart
- **THEN** the conductor reconciles it against durable conductor state
- **AND** provider state alone cannot advance the workflow
