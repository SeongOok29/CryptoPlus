# Repository Guidelines

## Project Structure & Module Organization
- Place application code in `src/cryptoplus/` (package root) with clear submodules by domain (e.g., `wallet/`, `exchanges/`, `utils/`).
- Keep tests in `tests/` mirroring the `src/` layout (e.g., `tests/wallet/test_transfer.py`).
- Store CLI/scripts in `scripts/` and long-form docs in `docs/`. Keep static assets in `assets/`.
- Configuration lives in `configs/` with environment-specific files (e.g., `configs/dev.yaml`, `configs/prod.yaml`).

## Build, Test, and Development Commands
- If a Makefile exists:
  - `make setup` — install dependencies and pre-commit hooks.
  - `make dev` — run the local app/watchers.
  - `make test` — run the full test suite with coverage.
  - `make build` — produce a production build or distributable package.
- Without Makefile, use stack defaults, for example:
  - Python: `poetry install`, `poetry run pytest -q`, `poetry build`.
  - Node: `npm ci`, `npm test`, `npm run build`.
  - Docker: `docker compose up -d` for local services.

## Coding Style & Naming Conventions
- Use formatter + linter: Python with Black and isort; JavaScript/TypeScript with Prettier and ESLint.
- Indentation: 4 spaces (Python), 2 spaces (YAML/JSON/TS/JS).
- Naming: `snake_case` for modules/files, `PascalCase` for classes/types, `camelCase` for variables/functions, `UPPER_SNAKE_CASE` for constants and env vars.
- Keep functions small and pure where possible; prefer dependency injection over globals.

## Testing Guidelines
- Mirror production modules in `tests/`; name Python tests `test_*.py` or JS/TS tests `*.test.ts`.
- Aim for meaningful coverage on core logic; include edge cases and error paths.
- Example: `pytest -q` or `npm test`. Add fixtures under `tests/fixtures/`.

## Commit & Pull Request Guidelines
- Follow Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`.
- Write focused commits; include rationale in the body when non-trivial.
- PRs must include: clear summary, linked issue (if any), screenshots or logs for UX/CLI changes, and notes on testing/rollout.
- Keep PRs small and reviewable; prefer incremental changes over big-bang merges.

## Security & Configuration
- Never commit secrets. Use `.env` (ignored) and provide `.env.example`.
- Validate inputs at boundaries; sanitize external data; avoid broad exception catches.
- Review third-party dependencies periodically; pin or lock versions.
