---
name: cancel
aliases: ["/cancel", "stop work", "abort", "halt"]
primaryRole: coordinator
description: Stop active workflow state safely and preserve resumable context. Use when the user wants to stop, abort, or checkpoint ongoing work.
---

# Cancel Skill (oh-my-product)

## Quick Start

- Use `omp team cancel --team <name>` or `omp team shutdown --team <name>` to stop safely and preserve resumable context.

Use this skill when the user wants to stop an active workflow or leave a safe checkpoint.

## Quick Start
- prefers graceful shutdown over abrupt interruption
- summarizes what completed, what is in progress, and what remains reusable
- points to concrete stop commands when available

## Primary commands
- `omp team cancel --team <name>`
- `omp team shutdown --team <name>`
- `omp skill handoff`
- `omp skill status`

## Output
Return:
- current objective
- what was cancelled
- persisted state or artifact locations
- recommended next step for resuming later
