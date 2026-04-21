---
name: cost
aliases: ["/cost", "token usage", "usage cost", "show spend"]
primaryRole: analyst
description: Summarize token usage and spend-style session metrics across time windows. Use when the user wants usage volume or cost trends.
---

# Cost Skill (oh-my-gemini)

## Quick Start

- Run `omg cost --period <daily|weekly|monthly>` and summarize the totals plus the most relevant trend notes.

Use this skill when the user wants visibility into usage volume or spend trends.

## Quick Start
- `omg cost`
- `omg cost --period daily`
- `omg cost --period weekly`
- `omg cost --period monthly`

## Related surfaces
- `omg sessions`
- `omg hud`

## Expected output
- selected period
- totals
- trend or breakdown notes
- any missing tracking caveats
