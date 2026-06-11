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

The app SHALL apply `auth_policy` and record an explicit per-run decision before
launch for `api_key_detected`, `cloud_or_enterprise`, or `unknown` posture. The
available decisions SHALL include `use_subscription_cli`,
`use_provider_default`, `use_api_key_once`, `exclude_detected_keys`, and
`cancel`. `use_api_key_once` and non-subscription `use_provider_default` SHALL
be unavailable under `subscription_only`.

#### Scenario: Block-unless-explicit holds launch

- **WHEN** policy blocks uncertain or API-key billing routes unless explicit
- **THEN** launch remains blocked until the user records a permitted decision

#### Scenario: Excluding keys is launch-scoped

- **WHEN** the user chooses `exclude_detected_keys`
- **THEN** the launch decision instructs the execution adapter to omit those
  names from the child environment
- **AND** `process.env` is unchanged

### Requirement: Subscription-only is the built-in auth policy

The built-in auth policy SHALL be `subscription_only`. Under this policy, the
app SHALL launch only the installed provider CLI route approved for subscription
usage, SHALL omit configured API-key names from the child environment, SHALL
permit provider-owned interactive login when posture is `unknown` or
`unauthenticated`, and SHALL reject API-key, cloud, enterprise, SDK-credit, or
headless-credit routes.

#### Scenario: Ambient API key exists under subscription-only policy

- **WHEN** a configured provider API-key variable is present
- **AND** policy is `subscription_only`
- **THEN** the launch decision is `use_subscription_cli`
- **AND** the strict child environment omits every configured API-key name for
  that provider
- **AND** the app does not mutate `process.env`

#### Scenario: Subscription login is not yet confirmed

- **WHEN** posture is `unknown` or `unauthenticated`
- **AND** the selected installed CLI supports interactive subscription login
- **THEN** the app may launch that native interactive CLI with
  `use_subscription_cli`
- **AND** the CLI remains responsible for prompting or completing login

#### Scenario: Non-subscription route is the only available route

- **WHEN** only API-key, cloud, enterprise, SDK-credit, or headless-credit
  execution is available
- **AND** policy is `subscription_only`
- **THEN** launch fails closed with the rejected billing route
- **AND** the app does not offer or perform silent fallback

#### Scenario: Codex subscription route is confirmed

- **WHEN** Codex App Server reports managed ChatGPT authentication
- **THEN** posture is `confirmed_subscription`
- **AND** `use_subscription_cli` preserves that route

#### Scenario: Claude API key would override subscription login

- **WHEN** `ANTHROPIC_API_KEY` is present for a subscription-only Claude launch
- **THEN** the child environment omits `ANTHROPIC_API_KEY`
- **AND** native interactive Claude owns subscription OAuth

### Requirement: Secret values never leave the inspection boundary

The app SHALL NOT include credential values in any inspection result, event,
artifact, persistence record, or log line.

#### Scenario: Result and logs are redacted

- **WHEN** a configured key variable contains a non-empty secret value
- **THEN** results and logs may name the variable
- **AND** no result or log contains its value
