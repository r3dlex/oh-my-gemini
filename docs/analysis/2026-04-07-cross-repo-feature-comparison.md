# Cross-Repository Feature Comparison: OMG vs OMC vs OMX

**Date:** 2026-04-07
**Method:** GitHub API + source inspection + 5-critic adversarial review (4 iterations)
**Supplements:** `2026-03-02-omg-omc-omx-capability-delta-matrix.md` (implementation-level deltas)

---

## 1. Repository Profiles

| | oh-my-gemini (OMG) | oh-my-claudecode (OMC) | oh-my-codex (OMX) |
|---|---|---|---|
| **Target CLI** | Gemini CLI (extension) | Claude Code (hooks/plugin) | OpenAI Codex CLI (hooks) |
| **Stars** | 74 | 25,404 | 17,895 |
| **Language** | TypeScript | TypeScript | TypeScript + Rust |
| **npm Package** | oh-my-gemini | oh-my-claude-sisyphus | oh-my-codex |
| **Version** | 0.5.9 | latest | 0.12.0 |
| **Extension Model** | Native `gemini-extension.json` | Claude `settings.json` hooks | `.codex/hooks.json` |
| **CLI Binary** | `omg` | (hooks-based, no binary) | `omx` |
| **State Dir** | `.omg/state/` | `.omc/state/` | `.omx/state/` |
| **In-Session Prefix** | `/omg:` (TOML) | `/oh-my-claudecode:` (skills) | `$` (AGENTS.md keywords) |

---

## 2. Agent Catalogs

### 2.1 OMG Agents

**Source:** `src/agents/definitions.ts` registers 20 agents (19 default + harsh-critic optional).
**Prompts:** `agents/*.md` contains 33 role prompt files (superset of definitions.ts).

| Category | Agents |
|----------|--------|
| **Strategy** | planner, architect, analyst, critic |
| **Execution** | executor, deep-executor |
| **Quality** | verifier, quality-reviewer, code-reviewer, security-reviewer |
| **Domain** | test-engineer, build-fixer, designer, writer, qa-tester, scientist |
| **Utility** | explore, debugger, git-master, code-simplifier, document-specialist (deprecated) |
| **Optional** | harsh-critic |
| **Prompt-only (in agents/*.md)** | product-manager, ux-researcher, information-architect, product-analyst, style-reviewer, api-reviewer, performance-reviewer, dependency-expert, quality-strategist, vision, tracer, researcher, consultant |

### 2.2 OMC Agents

**Source:** Claude Code native subagent types (19 specialized).

| Category | Agents |
|----------|--------|
| **Strategy** | planner, architect, analyst, critic |
| **Execution** | executor |
| **Quality** | code-reviewer, security-reviewer, verifier |
| **Domain** | test-engineer, designer, writer, qa-tester, scientist |
| **Utility** | explore, debugger, tracer, git-master, code-simplifier, document-specialist |

### 2.3 OMX Agents

**Source:** `src/agents/definitions.ts` registers 29 agents in 5 categories.

| Category | Agents |
|----------|--------|
| **Build & Analysis (9)** | explore, analyst, planner, architect, debugger, executor, team-executor, verifier, code-simplifier |
| **Review (6)** | style-reviewer, quality-reviewer, api-reviewer, security-reviewer, performance-reviewer, code-reviewer |
| **Domain (10)** | dependency-expert, test-engineer, quality-strategist, build-fixer, designer, writer, qa-tester, git-master, researcher, vision |
| **Product (4)** | product-manager, ux-researcher, information-architect, product-analyst |
| **Coordination (2)** | critic, vision |

### 2.4 Agent Gap Summary

| Agent | OMG | OMC | OMX | Notes |
|-------|-----|-----|-----|-------|
| tracer | prompt-only (agents/tracer.md) | Full subagent | - | OMG has prompt but not in definitions.ts registry |
| team-executor | - | - | Yes | OMX-specific for team worker context |
| vision | prompt-only | - | Yes | Multimodal agent, untapped Gemini opportunity |
| researcher | prompt-only | - | Yes | Source-backed comparisons |
| consultant | prompt-only | - | - | OMG-exclusive |

---

## 3. Team Orchestration

### 3.1 Architecture Comparison

| Aspect | OMG | OMC | OMX |
|--------|-----|-----|-----|
| **Backend** | tmux panes + subagents + gemini-spawn | Claude Code native teams (TeamCreate/TeamDelete) | tmux panes + git worktrees |
| **Control Plane** | Deterministic state machine (task-lifecycle.ts, mailbox-lifecycle.ts, failure-taxonomy.ts) | Simpler task/message via TaskCreate/TaskUpdate | SQLite-backed task state with claim/release |
| **Worker Types** | Gemini-native only | Claude-only (native subagents) | codex, claude, gemini (multi-provider) |
| **Pipeline** | plan→exec→verify→fix (built into team-orchestrator.ts:332-414) | team-plan→team-prd→team-exec→team-verify→team-fix (5 separate stages) | Same 5-stage as OMC |
| **Fix Loop** | Built into orchestrator with configurable maxFixAttempts (DEFAULT_FIX_LOOP_CAP=3) | Separate team-fix command | configurable max_fix_attempts |
| **Scaling** | Via subagents-catalog | Via agent spawning | Dynamic scaling + rebalance-policy.ts |
| **Communication** | Mailbox lifecycle with notification/delivery tracking | SendMessage between teammates | Inbox/mailbox with dispatch/broadcast/DM |
| **Monitoring** | team/live.toml + omg hud | HUD statusline | omx hud --watch |

### 3.2 Team CLI Commands

| Command | OMG | OMC | OMX |
|---------|-----|-----|-----|
| Start team | `omg team run` | `/team N:executor "..."` | `omx team N:type "..."` |
| Cancel | `omg team cancel` | `/cancel` | `omx team shutdown` |
| Status | `omg team status` | HUD-based | `omx team status` |
| Resume | `omg team resume` | - | `omx team resume` |
| Shutdown | `omg team shutdown` | SendMessage shutdown_request | `omx team shutdown` |
| Worker run | `omg worker run` (internal) | N/A (native subagents) | worker bootstrap |

### 3.3 Team Subcommands (OMG-Exclusive)

OMG has 8 team subcommands in `commands/omg/team/`:
- `run.toml` — Core orchestration entry (plan→exec→verify→fix→completed|failed)
- `plan.toml` — Implementation plan stage
- `prd.toml` — PRD-quality scope lock
- `exec.toml` — Execute implementation
- `verify.toml` — Verify results
- `assemble.toml` — Dynamic team roster composition with approval gate
- `live.toml` — Live tmux worker pane orchestration
- `subagents.toml` — Subagent backend orchestration

---

## 4. Execution Modes

| Mode | OMG | OMC | OMX | Notes |
|------|-----|-----|-----|-------|
| **Autopilot** | `src/modes/autopilot.ts` | Full skill | Pipeline orchestrator → RALPLAN → teams → ralph | |
| **Ralph** | `src/modes/ralph.ts` | Full skill | Contract + persistence system | OMX has most structured implementation |
| **Ultrawork** | `src/modes/ultrawork.ts` | Full skill | Full implementation | Parallel execution in all three |
| **UltraQA** | Name registered only (`mode-names.ts:15`) — NO implementation | Full skill | Full implementation | **OMG genuine gap** |
| **Pipeline** | Deprecated (#1131) | Active | Deprecated (merged into team) | OMG and OMX both deprecated it |
| **Team** | 8 subcommands + tmux | Native Claude teams | tmux + worktrees | Different architectures |
| **Ralplan** | `commands/omg/consensus.toml` + `skills/ralplan/` | Full skill | Full implementation | All three have it |
| **Deep-Interview** | `skills/deep-interview/` | Full skill | With math gating | OMX has most sophisticated gating |
| **Ecomode** | - | - | Merged into ultrawork | OMX-exclusive concept |

---

## 5. CLI Surface Comparison

### 5.1 OMG CLI Commands (27 TypeScript files in `src/cli/commands/`)

**Setup & Config:** setup, update, uninstall, extension-path
**Diagnostics:** doctor (35.7KB), verify, version
**Team:** team-run, team-cancel, team-shutdown, team-status, team-resume
**Worker:** worker-run (internal)
**Execution:** launch, ask
**Monitoring:** hud, cost, sessions
**Dev:** prd, skill, wait, tools, mcp

### 5.2 OMG In-Session Commands (47 TOML files in `commands/omg/`)

**Team (8):** team/{run, plan, prd, exec, verify, assemble, live, subagents}
**Modes:** team, autopilot, ralph, ultrawork, loop
**Lifecycle:** launch, stop, cancel
**Config:** mode, reasoning, approval, memory, rules, hud, hud-setup, hud-compact, hud-off, hud-on, configure-notifications, setup
**Planning:** consensus, deep-interview, intent
**Quality:** review, verify, debug
**Task Mgmt:** taskboard, workspace
**Optimization:** optimize, checkpoint
**Learning:** learn
**Utilities:** ask, cost, doctor, execute, handoff, help, mcp, plan, sessions, status, tools, wait

### 5.3 OMC Terminal CLI Commands (`omc` binary)

| Command | Usage | Description |
|---------|-------|-------------|
| `omc setup` | `omc setup` | Install hooks, skills, CLAUDE.md scaffolding |
| `omc doctor` | `omc doctor` | Check installation health |
| `omc hud` | `omc hud [--watch]` | HUD statusline management |
| `omc ask` | `omc ask claude\|codex\|gemini "prompt"` | Route prompt to specific provider CLI, capture artifact |
| `omc team` | `omc team N:codex\|gemini\|claude "task"` | Spawn N tmux workers of specified CLI type |
| `omc autoresearch` | `omc autoresearch --mission "topic"` | Launch thin-supervisor auto-research |
| `omc wait` | `omc wait --start` | Auto-resume on rate limit reset |
| `omc config-stop-callback` | `omc config-stop-callback telegram\|discord\|slack --enable ...` | Configure notification integrations |

**Key distinction:** OMC's `omc team` spawns external CLI processes (Codex/Gemini/Claude) as tmux panes. In-session `/team` uses Claude Code's native `TeamCreate` to spawn internal subagents. These are two different mechanisms.

### 5.4 OMC In-Session Skills (~40+)

| Category | Skills |
|----------|--------|
| **Execution** | `/team N:executor "..."`, `/autopilot "..."`, `/ralph "..."`, `/ultrawork` (`/ulw`), `/ultraqa` |
| **Planning** | `/deep-interview "..."`, `/ralplan "..."`, `/plan "..."` |
| **Multi-Model** | `/ccg` (Claude+Codex+Gemini), `/ask claude\|codex\|gemini "..."` |
| **Quality** | `/simplify`, `/ai-slop-cleaner` (`/deslop`) |
| **Tracing** | `/trace`, `/deep-dive` (trace→interview pipeline) |
| **Scheduling** | `/loop 5m /foo`, `/schedule` (remote cron agents) |
| **Context** | `/external-context`, `/deepinit` |
| **Management** | `/cancel`, `/hud`, `/configure-notifications`, `/learner`, `/skill` |
| **Sessions** | `/project-session-manager` (worktree isolation) |

### 5.5 OMX Terminal CLI Commands (`omx` binary)

| Command | Usage | Description |
|---------|-------|-------------|
| `omx` | `omx [--yolo] [--high] [--madmax]` | Launch Codex CLI with HUD auto-attach |
| `omx exec` | `omx exec "prompt"` | Run codex non-interactively with OMX overlay |
| `omx setup` | `omx setup [--scope user\|project]` | Install skills, prompts, MCP servers, AGENTS.md |
| `omx uninstall` | `omx uninstall` | Remove OMX configuration |
| `omx doctor` | `omx doctor [--team]` | Check installation (--team for swarm runtime) |
| `omx cleanup` | `omx cleanup` | Kill orphaned MCP servers, stale dirs |
| `omx ask` | `omx ask claude\|gemini "prompt"` | Ask provider CLI, write artifact |
| `omx resume` | `omx resume` | Resume previous interactive session |
| `omx explore` | `omx explore --prompt "query"` | Read-only codebase exploration |
| `omx session` | `omx session "query"` | Search prior session transcripts |
| `omx agents-init` | `omx agents-init [path]` | Bootstrap AGENTS.md files |
| `omx deepinit` | `omx deepinit [path]` | Alias for agents-init |
| `omx agents` | `omx agents` | Manage Codex native agent TOML files |
| `omx team` | `omx team N:codex\|claude\|gemini "task"` | Spawn N parallel tmux workers with git worktrees |
| `omx ralph` | `omx ralph "task"` | Launch Codex with ralph persistence mode |
| `omx autoresearch` | `omx autoresearch --mission "topic"` | Launch auto-research supervisor |
| `omx hud` | `omx hud [--watch] [--json] [--preset=NAME]` | HUD statusline |
| `omx sparkshell` | `omx sparkshell <cmd>` | Native Rust shell sidecar |
| `omx hooks` | `omx hooks init\|status\|validate\|test` | Manage hook plugins |
| `omx tmux-hook` | `omx tmux-hook init\|status\|validate\|test` | Manage tmux prompt injection |
| `omx status` | `omx status` | Show active modes |
| `omx cancel` | `omx cancel` | Cancel active execution modes |
| `omx reasoning` | `omx reasoning [low\|medium\|high\|xhigh]` | Set reasoning effort |
| `omx version` | `omx version` | Version info |

**Key flags:** `--yolo` (no confirm), `--high`/`--xhigh` (reasoning), `--madmax` (bypass approvals), `--spark` (fast workers), `-w, --worktree` (git worktree), `--discord`/`--slack`/`--telegram` (notifications)

### 5.6 OMX In-Session Skills (36, `$name` prefix)

| Category | Skills |
|----------|--------|
| **Execution** | `$ralph`, `$autopilot`, `$ultrawork`, `$ultraqa`, `$team`, `$ecomode` |
| **Planning** | `$deep-interview`, `$ralplan`, `$plan` |
| **Agent Shortcuts** | `$analyze`, `$tdd`, `$build-fix`, `$code-review`, `$security-review` |
| **Specialized** | `$visual-verdict`, `$web-clone`, `$deepsearch`, `$frontend-ui-ux`, `$git-master` |
| **Quality** | `$review`, `$ai-slop-cleaner`, `$trace` |
| **Management** | `$cancel`, `$doctor`, `$help`, `$note`, `$skill`, `$hud`, `$omx-setup` |
| **Config** | `$configure-notifications`, `$ralph-init`, `$pipeline`, `$swarm` (team alias) |

---

### 5.7 CLI Interface Comparison Matrix

| CLI Feature | OMG (`omg`) | OMC (`omc`) | OMX (`omx`) |
|-------------|-------------|-------------|-------------|
| **Launch** | `omg launch` | N/A (hooks auto-load) | `omx` (auto-HUD) |
| **Team spawn** | `omg team run --task "..." --workers N` | `omc team N:codex "..."` | `omx team N:type "..."` |
| **Team status** | `omg team status` | N/A (HUD) | `omx team status` |
| **Team resume** | `omg team resume` | N/A | `omx team resume` |
| **Team shutdown** | `omg team shutdown` | N/A | `omx team shutdown` |
| **Multi-provider ask** | `omg ask` (Gemini only) | `omc ask claude\|codex\|gemini` | `omx ask claude\|gemini` |
| **Multi-provider workers** | Gemini-only | codex/gemini/claude | codex/claude/gemini |
| **Diagnostics** | `omg doctor` | `omc doctor` | `omx doctor [--team]` |
| **Setup** | `omg setup` | `omc setup` | `omx setup [--scope]` |
| **HUD** | `omg hud` | `omc hud` | `omx hud [--watch\|--preset]` |
| **Cost tracking** | `omg cost` | N/A | N/A |
| **Session mgmt** | `omg sessions` | N/A | `omx session` (search) |
| **Wait/rate-limit** | `omg wait` | `omc wait --start` | N/A |
| **MCP server** | `omg mcp serve` | N/A | N/A (4 built-in) |
| **PRD generation** | `omg prd` | N/A (skill) | N/A (skill) |
| **Skill mgmt** | `omg skill` | N/A (skill) | N/A (skill) |
| **Tools mgmt** | `omg tools` | N/A | N/A |
| **Read-only explore** | N/A | N/A | `omx explore --prompt` |
| **Shell sidecar** | N/A | N/A | `omx sparkshell <cmd>` |
| **Resume session** | N/A | N/A | `omx resume` |
| **AGENTS.md bootstrap** | N/A | N/A | `omx agents-init`/`deepinit` |
| **Ralph from terminal** | N/A | N/A | `omx ralph "task"` |
| **Autoresearch** | N/A | `omc autoresearch` | `omx autoresearch` |
| **Reasoning CLI** | N/A (in-session) | N/A | `omx reasoning [level]` |
| **Aggressive flags** | N/A | N/A | `--yolo`, `--madmax`, `--high` |
| **Worktree launch** | N/A | N/A | `omx -w [name]` |
| **Hook mgmt CLI** | N/A | N/A | `omx hooks init\|validate\|test` |
| **Cleanup orphans** | N/A | N/A | `omx cleanup` |
| **Notifications CLI** | N/A | `omc config-stop-callback` | `--discord\|--slack\|--telegram` |
| **Extension path** | `omg extension` | N/A | N/A |
| **Uninstall** | `omg uninstall` | N/A | `omx uninstall` |

### 5.8 CLI Gap Analysis for OMG

**OMG has, others don't (CLI-level):**
- `omg cost` — Token cost tracking CLI
- `omg mcp serve` — Built-in MCP server
- `omg prd` — Direct PRD generation CLI
- `omg tools` — Tool management CLI
- `omg extension` — Extension path resolution
- `omg team cancel` — Explicit cancel command

**OMX has, OMG doesn't (CLI-level):**
- `omx explore --prompt` — Read-only codebase exploration
- `omx sparkshell <cmd>` — Native Rust shell sidecar
- `omx resume` — Resume previous session
- `omx agents-init` / `omx deepinit` — AGENTS.md bootstrap
- `omx ralph "task"` — Direct ralph launch from terminal
- `omx autoresearch` — Autoresearch from terminal
- `omx reasoning` — Reasoning effort from terminal
- `omx hooks init|status|validate|test` — Hook management CLI
- `omx cleanup` — Orphan process cleanup
- `--yolo`, `--madmax`, `--high` — Aggressive mode flags
- `-w, --worktree` — Git worktree launch
- Multi-provider team workers (codex/claude/gemini)

**OMC has, OMG doesn't (CLI-level):**
- `omc team N:codex|gemini "..."` — Multi-provider team spawn
- `omc ask codex|gemini "..."` — Multi-provider ask
- `omc autoresearch --mission` — Autoresearch from terminal
- `omc config-stop-callback` — Notification config CLI

---

## 6. Features OMG Has That Others Don't

| Feature | Evidence | Strategic Value |
|---------|----------|----------------|
| **Native Gemini extension** | `gemini-extension.json` | Only OMG is a first-class Gemini CLI extension |
| **Intent classification** | `commands/omg/intent.toml` | Automatic workflow routing based on task shape |
| **Approval posture** | `commands/omg/approval.toml` | Configurable autonomy (suggest/auto/full-auto) |
| **Taskboard** | `commands/omg/taskboard.toml` | Task ledger with stable IDs, ownership, dependencies |
| **Workspace management** | `commands/omg/workspace.toml` | Lane inspection, audit, worktree management |
| **Team assembly** | `commands/omg/team/assemble.toml` | Dynamic roster with approval gate |
| **Team live mode** | `commands/omg/team/live.toml` | tmux worker pane orchestration |
| **Team subagents** | `commands/omg/team/subagents.toml` | Subagent backend orchestration |
| **Context optimization** | `commands/omg/optimize.toml` + skill | Active context/cache optimization |
| **Checkpoint** | `commands/omg/checkpoint.toml` | Session checkpoint snapshots |
| **Cost tracking CLI** | `src/cli/commands/cost.ts` + skill | Token cost monitoring |
| **MCP server** | `src/cli/commands/mcp.ts` | Direct MCP ecosystem integration |
| **Reasoning effort** | `commands/omg/reasoning.toml` | Per-teammate depth/cost control |
| **Conditional rules** | `commands/omg/rules.toml` | Context-triggered rule injection |
| **Handoff skill** | `skills/handoff/` | Resume-ready context transfer |
| **Control plane** | `src/team/control-plane/` | Deterministic task-lifecycle, mailbox-lifecycle, failure-taxonomy |
| **33 agent prompts** | `agents/*.md` | Richest agent prompt library of the three |

---

## 7. Genuine Gaps in OMG (vs OMC/OMX)

| # | Feature | Source | Status | Implementation Notes |
|---|---------|--------|--------|---------------------|
| 1 | **UltraQA mode** | OMC+OMX | Name registered, no impl | Needs 7+ file changes: mode-names.ts, mode-registry, keyword-detector, modes/index.ts, session-end state, metrics, new ultraqa.ts. Requires Mode Extensibility ADR first. |
| 2 | **`/trace` causal tracing** | OMC | Missing | Needs tracer agent added to definitions.ts (prompt exists at agents/tracer.md). Competing-hypothesis state schema needed. |
| 3 | **`/deep-dive` pipeline** | OMC | Missing | 2-stage: trace→deep-interview. Depends on /trace. |
| 4 | **`/ai-slop-cleaner`** | OMC+OMX | Missing | Regression-safe deletion-first cleanup. Can leverage code-reviewer + code-simplifier. |
| 5 | **`/external-context`** | OMC | Missing | ⚠️ Cannot use document-specialist (deprecated). Needs new agent or un-deprecation. |
| 6 | **`deepinit`** | OMC | Missing | Deep codebase init with hierarchical AGENTS.md. Risk: Gemini CLI may ship natively. |
| 7 | **`/schedule`** | OMC | Missing | Remote cron agents. Platform API dependent. |
| 8 | **`/project-session-manager`** | OMC | Missing | Git worktree + tmux session isolation. |
| 9 | **CCG tri-model** | OMC | Missing | Cross-model synthesis. Low relevance for Gemini-native. |
| 10 | **Multi-provider workers** | OMX | Missing | OMX can spawn codex/claude/gemini workers. OMG is Gemini-only. |
| 11 | **Rust crates** | OMX | Missing | Performance crates (explore, mux, runtime, sparkshell). Different tech choice. |
| 12 | **4 MCP servers** | OMX | Partial | OMG has 1 MCP server. OMX has state, memory, trace, code-intel servers. |

---

## 8. Competitive Landscape (Gemini CLI Ecosystem)

| Extension | Stars | Overlap with OMG |
|-----------|-------|-----------------|
| **conductor** (Google official) | 3,389 | Team orchestration — direct competitor |
| **ralph** (Google official) | 281 | Ralph persistence loops — direct competitor |
| **jules** (Google official) | 364 | Autonomous agent — competes with autopilot |
| **gemini-cli-prompt-library** | 369 | Prompt/skill library |
| **skill-porter** | 150 | Skill porting |

**Implication:** OMG must differentiate from Google's own extensions, not just from OMC/OMX. Features Google ships natively become OMG's liabilities.

---

## 9. Strategic Recommendations (5-Critic Consensus)

### The Core Insight

> "What does OMC have that we don't?" is the wrong question.
> **"What can ONLY OMG do?"** is the right question.

### OMG's Unique Advantages (Unexploited)

1. **1M context window** — Whole-repo planning without RAG. No other CLI has this.
2. **Multimodal vision agent** — Image/diagram-driven coding flows. vision agent prompt exists but unused.
3. **Native extension ecosystem** — `gemini-extension.json` distribution via Gemini CLI marketplace.
4. **MCP-as-Server posture** — Other tools (OMC, OMX, third-party) call OMG via MCP.
5. **Intent + Approval + Taskboard** — Composable autonomy stack unique to OMG.
6. **Deterministic control plane** — Task-lifecycle + mailbox-lifecycle + failure-taxonomy. Most rigorous of the three.

### Recommended Priority Order

| Priority | Action | Rationale |
|----------|--------|-----------|
| **P0** | Audit feature usage; remove/document undiscoverable features | 47 commands but only 14% visible to users. Subtraction-first. |
| **P0** | Align with PRD P0: reliability hardening, watchdog, heartbeat | Project's own PRD says this is P0. |
| **P1** | Deepen Gemini-native advantages (1M context, multimodal, MCP) | Competitive differentiation Google cannot replicate. |
| **P1** | Extension marketplace presence (gemini-cli-extensions org listing) | Distribution is the bottleneck, not features. |
| **P2** | UltraQA mode (IF demand exists + Mode Extensibility ADR first) | Only genuine mode gap, but needs 7+ file changes. |
| **P2** | /trace + /ai-slop-cleaner (IF demand signal from users) | Valuable but demand-contingent. |
| **P3** | Everything else (deepinit, schedule, session-manager, CCG) | Low priority; Google may ship natively. |

---

## 10. Methodology & Corrections Log

### Data Collection
- OMG: Direct filesystem inspection + source-level verification
- OMC: GitHub API (tree traversal) + WebFetch (README, docs website)
- OMX: GitHub API + WebFetch + repo contents API

### Adversarial Review (5 Independent Critics)

| # | Perspective | Verdict | Key Contribution |
|---|------------|---------|-----------------|
| 1 | Technical Architecture | REJECT | UltraQA needs 7+ files, document-specialist deprecated, mode extensibility ADR needed |
| 2 | Product & UX | REJECT | Discoverability crisis (14% visible), subtraction-first, JTBD framing needed |
| 3 | Maintenance & Sustainability | ACCEPT-W/RES | Testing strong (97 files), but 1-3 person team can't sustain 6-9 new features |
| 4 | Ecosystem & Strategy | REJECT | Wrong frame (OMC parity vs Gemini-native), contradicts project PRD, Google competition |
| 5 | Competitive Strategy | REJECT | 74 stars = pre-PMF, distribution > features, subtraction before addition |

### Corrections Across 4 Iterations

| Iteration | Errors Found | Source |
|-----------|-------------|--------|
| 1→2 | 12 false negatives (features listed as gaps that exist) | Architect |
| 2→3 | team-fix in orchestrator; 3 phantom commands; 9 missing commands | Critic |
| 3→4 | 6 phantom TOMLs; 17 omitted TOMLs; agent count 20 not 21+; document-specialist deprecated | 5 Critics |

### Key Lesson
> Directory listing and filename matching are unreliable inventory methods. All claims must be verified with `grep` + file read against actual source code.
