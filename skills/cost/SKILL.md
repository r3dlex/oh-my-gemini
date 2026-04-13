---
name: cost
aliases: ["/cost", "token usage", "usage cost", "show spend"]
primaryRole: analyst
description: Summarize token usage and spend-style session metrics across time windows. Use when the user wants usage volume or cost trends.
---

# Cost Skill (oh-my-product)

## Quick Start

- Run `omp cost --period <daily|weekly|monthly>` and summarize the totals plus the most relevant trend notes.

Use this skill when the user wants visibility into usage volume or spend trends.

## Quick Start
- `omp cost`
- `omp cost --period daily`
- `omp cost --period weekly`
- `omp cost --period monthly`

## Related surfaces
- `omp sessions`
- `omp hud`

## Expected output
- selected period
- totals
- trend or breakdown notes
- any missing tracking caveats
