# ADR 0004: Use Risk-Calibrated Execution-Feedback Loops

- **Status:** Accepted
- **Date:** 2026-06-10

## Context

Tool-using agents can spend additional inference on speculative reflection, or
they can obtain evidence from compilers, tests, schemas, browsers, and other
environment responses. Research including Reflexion, ReAct, and
Reflect-Retry-Reward supports feedback-grounded correction, while studies of
intrinsic self-correction show that reflection without reliable external
feedback is inconsistent.

The 2025 Reflect-Retry-Reward paper reports improvements as high as 34.7% on
math equation writing and 18.1% on function calling. These are results from one
experimental framework, not universal expected gains. Industry guidance also
recommends agents obtain ground truth from environment results at each step and
use stopping conditions such as iteration limits.

Acting early is not universally safe. Some effects are irreversible, costly,
credential-bearing, externally visible, or ambiguous after interruption.

## Decision

The conductor uses a risk-calibrated
`reason -> act -> observe -> reflect -> retry` loop:

1. Plan enough to identify risk, permissions, evaluator, and a safe first probe.
2. Prefer the smallest reversible, cheap, deterministically evaluable action.
3. Record its outcome and use that evidence to revise the plan.
4. Retry only with changed inputs, strategy, or preconditions and within a
   bounded attempt budget.
5. Stop or escalate when evidence is ambiguous, no evaluator exists, attempts
   make no progress, or the next action crosses a protected boundary.

Protected, irreversible, expensive, credential-bearing, safety-critical, and
externally visible effects are never probes. They require applicable planning,
simulation or dry-run, human approval, and final broker authorization.
Ambiguous external effects require reconciliation and are never blindly
retried.

## Consequences

- Plans and workflow manifests must name safe probes, evaluators, retry budgets,
  and stop conditions.
- Run history must preserve attempt evidence and changed retry rationale.
- Deterministic environment feedback is preferred over ungrounded model
  self-critique.
- Upfront planning remains mandatory where action risk demands it.

## Evidence

- Reflexion: <https://arxiv.org/abs/2303.11366>
- ReAct: <https://arxiv.org/abs/2210.03629>
- Reflect, Retry, Reward: <https://arxiv.org/abs/2505.24726>
- Large Language Models Cannot Self-Correct Reasoning Yet:
  <https://arxiv.org/abs/2310.01798>
- When Can LLMs Actually Correct Their Own Mistakes?:
  <https://arxiv.org/abs/2406.01297>
- Large Language Models have Intrinsic Self-Correction Ability:
  <https://arxiv.org/abs/2406.15673>
- Anthropic, Building Effective Agents:
  <https://www.anthropic.com/engineering/building-effective-agents>
