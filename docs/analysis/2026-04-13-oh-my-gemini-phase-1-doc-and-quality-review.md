# oh-my-gemini Phase 1 documentation and quality review

Date: 2026-04-13  
Scope: Phase 1 foundation review for the oh-my-gemini 1.0.0 implementation effort.

## Why this document exists

The repository already contains most of the orchestration runtime needed for `oh-my-gemini`, but the public documentation and several naming-critical implementation surfaces still describe the older `oh-my-product` / `omp` shape. This review captures the current baseline, the highest-value Phase 1 gaps, and the safest migration order.

## Evidence snapshot

Current repo evidence from this task's audit:

- `package.json` still publishes `oh-my-product` and exposes `omp` / `oh-my-product` bins.
- `gemini-extension.json` is still rooted at the package root and still declares `oh-my-product` metadata.
- No canonical `extensions/oh-my-gemini/` subtree exists yet.
- Runtime and installer surfaces still persist to `.omp/` in multiple locations (`src/installer/*`, `src/state/*`, `src/lib/worktree-paths.ts`, `src/notifications/index.ts`).
- MCP URIs and server naming still use `omp://` / `oh-my-product-mcp` in `src/mcp/server.ts` and `src/mcp/client.ts`.
- Top-level docs (`README.md`, `GEMINI.md`, `CONTRIBUTING.md`) still describe the repo as `oh-my-product`.

## Highest-value Phase 1 gaps

| Area | Current state | Target state | Risk / note |
| --- | --- | --- | --- |
| Package identity | `package.json` uses `oh-my-product` and `omp` | `oh-my-gemini` with `omg`-first user-facing naming | Requires compatibility plan for existing consumers |
| Extension layout | Root `gemini-extension.json` and root assets | Canonical `extensions/oh-my-gemini/` manifest/context/commands/agents scaffold | Additive-first move is safest |
| Runtime state | `.omp/` is the durable default | `.omg/` should become the canonical runtime root | Needs compatibility reads before write-path flips |
| Command namespace | `/omp:*`, `omp`, `oh-my-product` dominate docs and prompts | `omg`, `oh-my-gemini`, and OMG-native extension docs | Avoid breaking existing scripted flows during rollout |
| MCP identity | `omp://...` and `oh-my-product-mcp` | OMG-native resource identity | Rename only after consumers tolerate aliasing |
| Contributor docs | Main guides still describe the legacy brand | Docs should explain the migration and canonical target paths | Safe to update immediately |

## Safe migration order

1. **Document the target clearly first**  
   Tell contributors that the canonical destination is `extensions/oh-my-gemini/`, `.omg/`, and OMG branding, while legacy `omp` / `.omp` compatibility may remain temporarily.
2. **Add canonical extension scaffolding before removing root compatibility**  
   Create the new extension subtree first, then decide whether root assets become wrappers, mirrors, or generated outputs.
3. **Flip runtime writes only after compatibility reads exist**  
   `.omg/` should not become the only runtime path until `.omp/` state can still be discovered or migrated deterministically.
4. **Rename public entrypoints before deep internal identifiers**  
   Package name, extension metadata, docs, and command aliases deliver the most visible Phase 1 value with less internal blast radius than immediate MCP/type-level renames.
5. **Treat MCP/resource identifiers as a later-phase compatibility problem**  
   Renaming `omp://` URIs and MCP server ids is valuable, but riskier than Phase 1 doc and entrypoint work.

## Documentation fixes landed with this review

- `README.md` now calls out the active OMG migration and points readers to this review.
- `GEMINI.md` now points at the real shared architecture doc path (`docs/architecture/omp-core.md`) instead of the stale `context/omp-core.md` path, and it also records the OMG transition target.

## Recommended next implementation checks

Before calling Phase 1 done, verify all of the following:

- `extensions/oh-my-gemini/` exists with manifest/context/commands/agents scaffolding.
- Session/bootstrap code can initialize `.omg/` state intentionally.
- User-facing docs and metadata prefer `oh-my-gemini` / `omg`.
- Compatibility notes explain which `omp` / `.omp` surfaces remain temporary aliases.
- Build, typecheck, and targeted tests pass after the migration slice.

## Remaining documentation backlog

These files still likely need a later dedicated pass once implementation settles:

- `CONTRIBUTING.md`
- `docs/omp/*`
- `docs/i18n/README.*.md`
- command/agent/skill prompt copy that still says `oh-my-product`

That work is better done after the core entrypoints and extension layout stop moving.
