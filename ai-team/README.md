# Codex AI Team

This package documents the Codex-facing workflows that ship with the self-evolving agent runtime in `agent_system/`.

It also points to the file-backed memory produced by that runtime in `agent_memory/` and `agent_skills/`.

## Folder Layout

```text
ai-team/
  README.md
  workflows/
    learn-from-run.md
    run-agent-system.md
```

## Runtime Workflow

1. `run-agent-system.md` is the entrypoint for running the Planner → Architect → Builder → Evaluator → Reflection loop from Codex.
2. `learn-from-run.md` is the follow-up workflow for inspecting the resulting episode, reflection, and extracted skill.
3. The runtime writes reusable artifacts into `agent_memory/episodic/`, `agent_memory/semantic/`, and `agent_skills/`.

## How To Use

Use the runnable agent system when you want Codex to exercise the full Planner → Architect → Builder → Evaluator → Reflection loop through the CLI:

```bash
npm run agent -- "Build a SaaS analytics dashboard"
npm run agent:plan -- "Design a billing subsystem"
npm run agent:execute -- "Debug a Python dependency error"
npm run agent:learn -- --episode latest
```

Codex workflow order:

1. Open `ai-team/workflows/run-agent-system.md`.
2. Start with `npm run agent:plan` when the task is risky or exploratory.
3. Run `npm run agent` or `npm run agent:execute` once execution is approved.
4. Open `ai-team/workflows/learn-from-run.md` and inspect the resulting episode and extracted skill.

The same runtime is available to Claude Code through the terminal and the `claude_provider.ts` adapter.

## Large Codebase Guidance

When the repository is large, keep the workflow incremental:

- Planner scopes work to the smallest shippable slice
- Architect defines stable contracts before touching implementation
- Builder changes a narrow module set per pass
- Reviewer checks the actual diff first, then surrounding contracts

This keeps Codex effective without requiring the full codebase in every step.
