# shooters-open

An open-source derivative release based on the upstream project `jay6697117/shooters`.

- Upstream: `https://github.com/jay6697117/shooters`
- License: `MIT`

This repository keeps the gameplay code, server code, assets, and test scripts required to continue development and deployment, while excluding local tooling, generated output, and runtime data.

## Included

- `assets/`
- `scripts/`
- `server/`
- `src/`
- `index.html`
- `admin.html`
- `server.mjs`
- `.env.example`
- `package.json`
- `assets.json`
- `ecosystem.config.cjs`
- `LICENSE`

## Excluded

- `.claude/`
- `.codex/`
- `.planning/`
- `.npm-cache/`
- `node_modules/`
- `output/`
- local runtime data and records
- handover notes, audit docs, screenshots, and zip archives

## Attribution

This project is a secondary development release derived from the upstream repository above. The original MIT license text is preserved in `LICENSE` and should remain included in redistributions.

## Quick Start

1. Create `.env` based on `.env.example`
2. Run `node server.mjs`
3. On first startup, the server will create required runtime files under `data/`
