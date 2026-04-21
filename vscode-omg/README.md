# oh-my-gemini (OMG) for VS Code

Visualize oh-my-gemini agents and workflows directly in VS Code.

## Installation

Install from the VS Code Marketplace or via `.vsix`:

```
code --install-extension oh-my-gemini-vscode-0.1.0.vsix
```

## What it shows

| Panel | Contents |
|---|---|
| Active Workflows | `.omc/state/*-state.json` files — mode name, active/stopped, current phase |
| Agents | `.omc/state/subagent-tracker.json` — agent type, status icon, summary |
| Tasks | oh-my-gemini uses Claude Code's native task system — no local file to display |

## Status bar

Shows `$(zap) OMG: idle` when quiet, or `$(sync~spin) OMG: N agents running` when work is in progress. Click to open the agent quick-pick.

## Commands

- **OMG: Show Status** — quick-pick of current agents
- **OMG: Clear State** — informational (use the CLI to manage state)
