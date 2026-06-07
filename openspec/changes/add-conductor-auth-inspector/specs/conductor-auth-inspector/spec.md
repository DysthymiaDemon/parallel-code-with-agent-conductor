# Conductor Auth Inspector Specification

## ADDED Requirements

### Requirement: Auth inspection is provider-aware and secret-safe

Before launch, the app SHALL combine configured API-key-name presence with
secret-safe metadata reported by the selected provider adapter. It SHALL
classify posture as `api_key_detected`, `confirmed_subscription`,
`cloud_or_enterprise`, `unknown`, or `unauthenticated`. It SHALL NOT treat
absence of a key variable as proof of subscription auth.

#### Scenario: API key name is present

- **WHEN** a selected provider's configured API-key variable is present
- **THEN** its posture is `api_key_detected`
- **AND** the result contains the variable name but not its value

#### Scenario: No key name is present

- **WHEN** no configured API-key variable is present
- **AND** the adapter cannot confirm another auth route
- **THEN** posture is `unknown`
- **AND** the app does not claim subscription auth

#### Scenario: Adapter confirms consumer login

- **WHEN** the provider adapter can safely confirm a consumer-subscription login
- **THEN** posture is `confirmed_subscription`

#### Scenario: Adapter reports cloud or enterprise credentials

- **WHEN** the adapter reports a cloud, helper, or enterprise auth route
- **THEN** posture is `cloud_or_enterprise`
- **AND** the route requires an explicit per-run decision when policy requires it

### Requirement: Billing route never changes silently

For `api_key_detected`, `cloud_or_enterprise`, or `unknown` posture, the app
SHALL apply `auth_policy` and record an explicit per-run decision before launch.
The available decisions SHALL be `use_provider_default`, `use_api_key_once`,
`exclude_detected_keys`, and `cancel`.

#### Scenario: Block-unless-explicit holds launch

- **WHEN** policy blocks uncertain or API-key billing routes unless explicit
- **THEN** launch remains blocked until the user records a permitted decision

#### Scenario: Excluding keys is launch-scoped

- **WHEN** the user chooses `exclude_detected_keys`
- **THEN** the launch decision instructs the execution adapter to omit those
  names from the child environment
- **AND** `process.env` is unchanged

### Requirement: Secret values never leave the inspection boundary

The app SHALL NOT include credential values in any inspection result, event,
artifact, persistence record, or log line.

#### Scenario: Result and logs are redacted

- **WHEN** a configured key variable contains a non-empty secret value
- **THEN** results and logs may name the variable
- **AND** no result or log contains its value
