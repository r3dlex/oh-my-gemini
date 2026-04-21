---
name: wait
aliases: ["/wait", "rate limit wait", "resume later", "wait for quota"]
primaryRole: operator
description: Check rate-limit state and manage auto-resume behavior for blocked Gemini work. Use when Gemini execution is paused by quota or wait-state needs.
---

# Wait Skill (oh-my-gemini)

## Quick Start

- Run `omg wait` to inspect rate limits, then start or stop auto-resume as needed.

Use this skill when Gemini is rate limited or the user wants auto-resume behavior.

## Quick Start
- `omg wait`
- `omg wait --start`
- `omg wait --stop`

## Expected output
- current rate-limit status
- whether auto-resume is active
- the next recommended action
