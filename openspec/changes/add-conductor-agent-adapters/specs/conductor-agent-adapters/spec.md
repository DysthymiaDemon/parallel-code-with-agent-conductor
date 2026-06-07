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

### Requirement: Provider adapters do not own conductor workflow state

Provider thread, session, task, and approval state SHALL be correlated to the
conductor run but SHALL NOT supersede the conductor's durable run state.

#### Scenario: Provider session resumes

- **WHEN** a provider session is resumed after restart
- **THEN** the conductor reconciles it against durable conductor state
- **AND** provider state alone cannot advance the workflow
