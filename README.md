<p align="center">
  <img src="docs/assets/omp_logo.png" alt="oh-my-gemini" width="240" />
</p>

# oh-my-gemini

[![npm version](https://img.shields.io/npm/v/oh-my-gemini?color=cb3837)](https://www.npmjs.com/package/oh-my-gemini)
[![GitHub stars](https://img.shields.io/github/stars/jjongguet/oh-my-gemini?style=flat&color=yellow)](https://github.com/jjongguet/oh-my-gemini/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Sponsor](https://img.shields.io/badge/Sponsor-%E2%9D%A4%EF%B8%8F-red?style=flat&logo=github)](https://github.com/sponsors/jjongguet)

> **Sister projects:** [oh-my-claudecode (OMC)](https://github.com/Yeachan-Heo/oh-my-claudecode) | [oh-my-codex (OMX)](https://github.com/Yeachan-Heo/oh-my-codex)

**Multi-agent orchestration for Gemini CLI with OMG branding and OMP compatibility aliases.**

> **Transition status (2026-04-13):** this repo is actively migrating from legacy `oh-my-product` / `omp` surfaces to canonical `oh-my-gemini` / `omg` surfaces. Phase 1 target paths are `extensions/oh-my-gemini/` and `.omg/`. Legacy `omp` / `.omp` references still exist while compatibility work is in progress. See [`docs/analysis/2026-04-13-oh-my-gemini-phase-1-doc-and-quality-review.md`](docs/analysis/2026-04-13-oh-my-gemini-phase-1-doc-and-quality-review.md) for the audited gap list and migration order.

[Quick Start](#quick-start) | [Team Mode](#team-mode) | [Commands](#commands) | [Docs](docs/)

---

## Quick Start

```bash
npm install -g oh-my-gemini
omg setup --scope project
gemini
```

After setup, restart Gemini CLI for `/omg:*` commands to appear (`/omp:*` remains compatible during migration).

```bash
omg doctor                                    # check prerequisites
omg team run --task "..." --workers 2         # parallel work
omg hud --watch                               # live status
```

---

## Team Mode

tmux-first multi-worker orchestration with persistent state and lifecycle controls.

```bash
omg team run --task "review src/ for reliability gaps" --workers 4
omg team status --team oh-my-gemini --json
omg team resume --team oh-my-gemini
omg team shutdown --team oh-my-gemini --force
```

Default backend: `tmux` | Optional: `subagents` for role-tagged runs

---

## Commands

### CLI

| Command | Description |
|---------|-------------|
| `omg` | Launch Gemini CLI with the oh-my-gemini extension |
| `omg team run` | Start orchestrated team run |
| `omg team status/resume/shutdown/cancel` | Team lifecycle |
| `omg doctor` | Diagnose prerequisites |
| `omg verify` | Run validation suites |
| `omg hud` | Live team status overlay |
| `omg skill` | List/print reusable skill prompts |

### Slash Commands (inside Gemini CLI)

| Command | Description |
|---------|-------------|
| `/omg:autopilot` | End-to-end autonomous execution |
| `/omg:plan` | Phased execution plan with gates |
| `/omg:execute` | Immediate task implementation |
| `/omg:review` | Structured code review |
| `/omg:verify` | Acceptance validation |
| `/omg:debug` | Root cause investigation |
| `/omg:status` | Progress summary |
| `/omg:cancel` | Graceful stop |
| `/omg:handoff` | Context transfer document |

Full command reference: [`docs/omp/commands.md`](docs/omp/commands.md)

---

## Compatibility Note

User-facing command and documentation surfaces now use `omg` / `oh-my-gemini` first, with `omp` / `oh-my-product` kept as compatibility aliases during the migration.

Some internal compatibility identifiers intentionally remain unchanged for now:

- legacy hidden state and artifact paths
- legacy environment variable names
- legacy internal interop identifiers
- legacy internal type/class names
- the `omp_cli_tools` MCP server identifier used by setup and extension manifests

Those internal names are deferred to a later migration to avoid breaking state, protocol, and compatibility contracts.

---

## Requirements

- **Node.js 20+**
- **[Gemini CLI](https://github.com/google-gemini/gemini-cli)**
- **[tmux](https://github.com/tmux/tmux)** (`brew install tmux` / `apt install tmux`)

---

## Default Model

| Model | Free (OAuth) | Free (API Key) |
|-------|--------------|----------------|
| `gemini-3.1-flash-lite-preview` (default) | Yes | Yes |
| `gemini-3.1-pro-preview` (`--pro`) | Yes | Yes |

Default model on `omg` launch is `gemini-3.1-flash-lite-preview`. Use `omg --pro` for `gemini-3.1-pro-preview` (`omp --pro` also works).

All defaults work without a paid Gemini CLI coding plan — just log in via OAuth (Google Account) or use an API key. Override with `OMP_MODEL_HIGH`, `OMP_MODEL_MEDIUM`, `OMP_MODEL_LOW` env vars. Gemini 3.1, 3, and 2.5 models are all available via `-m` flag.

### Emergency Model Override

If a default model becomes unavailable, override immediately without code changes:

```bash
export OMP_MODEL_HIGH=<working-model>
export OMP_MODEL_MEDIUM=<working-model>
export OMP_MODEL_LOW=<working-model>
```

---

## License

MIT

---

<div align="center">

**[oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode) | [oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex)**

</div>

[![Star History Chart](https://api.star-history.com/svg?repos=jjongguet/oh-my-gemini&type=date&legend=top-left)](https://www.star-history.com/#jjongguet/oh-my-gemini&type=date&legend=top-left)

[![Sponsor on GitHub](https://img.shields.io/badge/Sponsor-%E2%9D%A4%EF%B8%8F-red?style=for-the-badge&logo=github)](https://github.com/sponsors/jjongguet)
