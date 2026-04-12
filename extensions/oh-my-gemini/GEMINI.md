# oh-my-gemini Extension Context

This is the canonical Gemini CLI extension surface for **oh-my-gemini (OMG)**.

## Available namespaces
- `/omg:*` — preferred OMG command namespace
- `/omp:*` — legacy compatibility namespace

## Extension assets
- `commands/omg` re-exports the current OMG command set
- `commands/omp` keeps legacy command aliases available
- `agents/` and `skills/` reuse the shared repo catalogs

Prefer OMG-branded surfaces for new workflows while legacy OMP paths remain available during migration.
