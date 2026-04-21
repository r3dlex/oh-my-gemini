---
name: ask
aliases: ["/ask", "advisor", "ask gemini", "run advisor prompt"]
primaryRole: advisor
description: Run a focused Gemini advisor prompt and save the reusable result artifact. Use when the user wants a quick advisor-style answer without a full workflow.
---

# Ask Skill (oh-my-gemini)

## Quick Start

- Run `omg ask gemini --prompt "<prompt>"` for a fast advisor answer and save the artifact.

Use this skill when the user wants a quick advisor-style answer from Gemini without launching a full workflow.

## Quick Start
- `omg ask gemini --prompt "<prompt>"`
- `omg ask gemini --agent-prompt <role> --prompt "<prompt>"`

## Artifact location
Results should be stored under:
- `.omg/artifacts/ask/`

## Good use cases
- second opinion on a design
- implementation suggestions before coding
- role-shaped advice for planner, reviewer, or debugger prompts
