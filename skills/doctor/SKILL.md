---
name: doctor
aliases: ["/doctor", "health check", "diagnose install", "fix setup"]
primaryRole: diagnostician
description: Inspect setup, extension assets, runtime prerequisites, and state health. Use when the user needs environment, install, or state diagnostics.
---

# Doctor Skill (oh-my-gemini)

## Quick Start

- Run `omg doctor` and summarize the smallest safe fix for anything that fails.

Use this skill when the user needs environment or installation diagnostics.

## Quick Start
- `omg doctor`

## Typical checks
- Node, npm, Gemini CLI, tmux, and container runtime availability
- extension manifest, commands, and skills
- persisted state writeability and team state integrity

## Follow-up
If the issue is environmental, recommend `omg setup` or the smallest safe corrective action.
