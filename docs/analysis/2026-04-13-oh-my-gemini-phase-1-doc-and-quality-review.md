# oh-my-gemini Phase 1 documentation and quality review

Date: 2026-04-13  
Scope: Phase 1 foundation review for the oh-my-gemini 1.0.0 implementation effort.

## Why this document exists

The repository already contains most of the orchestration runtime needed for `oh-my-gemini`, but the latest audit still found stale `oh-my-gemini` copy in command prompts, contributor docs, and operator runbooks, plus deeper implementation/config drift in adjacent source surfaces. This review captures the current baseline, the highest-value Phase 1 gaps, and the safest migration order.

## Evidence snapshot

Current repo evidence from this task's audit:

- `package.json` now publishes `oh-my-gemini`, but still intentionally keeps `omg` / `oh-my-gemini` CLI aliases for compatibility.
- Root and nested `gemini-extension.json` manifests exist, but their settings/MCP surfaces still require implementation-side verification.
- Runtime and installer surfaces still persist to `.omg/` in multiple locations (`src/installer/*`, `src/state/*`, `src/lib/worktree-paths.ts`, `src/notifications/index.ts`).
- MCP URIs, server naming, and some team-runtime compatibility env aliases still use `omg://`, `OMG_*`, or `OMX_*` identifiers by design or for backward compatibility.
- Contributor docs and Gemini command prompt TOMLs still had stale `oh-my-gemini` copy before this remediation pass.
- Operator docs referenced “OMX Team” ambiguously even when they specifically meant the external `omx team` validation path for oh-my-gemini.

## Highest-value Phase 1 gaps

| Area | Current state | Target state | Risk / note |
| --- | --- | --- | --- |
| Package identity | `package.json` uses `oh-my-gemini` and `omg` | `oh-my-gemini` with `omg`-first user-facing naming | Requires compatibility plan for existing consumers |
| Extension layout | Root `gemini-extension.json` and root assets | Canonical `extensions/oh-my-gemini/` manifest/context/commands/agents scaffold | Additive-first move is safest |
| Runtime state | `.omg/` is the durable default | `.omg/` should become the canonical runtime root | Needs compatibility reads before write-path flips |
| Command namespace | `/omg:*`, `omg`, `oh-my-gemini` dominate docs and prompts | `omg`, `oh-my-gemini`, and OMG-native extension docs | Avoid breaking existing scripted flows during rollout |
| MCP identity | `omg://...` and `oh-my-gemini-mcp` | OMG-native resource identity | Rename only after consumers tolerate aliasing |
| Contributor docs | Main guides still describe the legacy brand | Docs should explain the migration and canonical target paths | Safe to update immediately |

## Safe migration order

1. **Document the target clearly first**  
   Tell contributors that the canonical destination is `extensions/oh-my-gemini/`, `.omg/`, and OMG branding, while legacy `omg` / `.omg` compatibility may remain temporarily.
2. **Add canonical extension scaffolding before removing root compatibility**  
   Create the new extension subtree first, then decide whether root assets become wrappers, mirrors, or generated outputs.
3. **Flip runtime writes only after compatibility reads exist**  
   `.omg/` should not become the only runtime path until `.omg/` state can still be discovered or migrated deterministically.
4. **Rename public entrypoints before deep internal identifiers**  
   Package name, extension metadata, docs, and command aliases deliver the most visible Phase 1 value with less internal blast radius than immediate MCP/type-level renames.
5. **Treat MCP/resource identifiers as a later-phase compatibility problem**  
   Renaming `omg://` URIs and MCP server ids is valuable, but riskier than Phase 1 doc and entrypoint work.

## Documentation fixes landed with this review

- `README.md` calls out the active OMG migration and points readers to this review.
- `GEMINI.md` points at the real shared architecture doc path (`docs/architecture/omg-core.md`) and records the OMG transition target.
- Command prompt TOMLs under `commands/omg/` now refer to `oh-my-gemini` instead of the stale `oh-my-gemini` product name while preserving `omg` compatibility examples.
- `docs/omg/*`, `docs/setup/install-scopes.md`, `docs/architecture/{omg-core,runtime-backend}.md`, and the live `omx team` operator docs now distinguish canonical OMG branding from intentional `omg`/`omx` compatibility/runtime surfaces more explicitly.

## Recommended next implementation checks

Before calling Phase 1 done, verify all of the following:

- `extensions/oh-my-gemini/` exists with manifest/context/commands/agents scaffolding.
- Session/bootstrap code can initialize `.omg/` state intentionally.
- User-facing docs and metadata prefer `oh-my-gemini` / `omg`.
- Compatibility notes explain which `omg` / `.omg` surfaces remain temporary aliases.
- Build, typecheck, and targeted tests pass after the migration slice.

## Remaining documentation backlog

These files still likely need a later dedicated pass once implementation settles:

- `CONTRIBUTING.md`
- `README.md` (explicitly deferred in this pass per task ordering: update last after the broader remediation settles)
- `docs/i18n/README.*.md`
- source comments/help text that still mention older sister-tool or Claude-specific provenance where that wording is no longer helpful to operators

That work is better done after the core entrypoints, extension layout, and hook/config implementation work stop moving.
