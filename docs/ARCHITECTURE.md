# Architecture

SpecForge separates product UI from project intelligence so the repository can be evaluated like a real app instead of a static showcase.

## Data Layer

`src/data/repositories.ts` contains a fixed evidence snapshot from 2026-06-13. Each repository signal has:

- identity fields: owner, name, URL, avatar, language, stars
- category fields: agent, automation, education, MCP, research, systems, UI
- source and evidence notes
- normalized project dimensions: social proof, technical depth, demo appeal, feasibility, moat, and risk

The app uses fixed data by design. GitHub profile demos should not break because a rate limit, API schema, or private token changed.

## Scoring Engine

`src/lib/scoring.ts` exposes three core functions:

- `normalizeStars`: log-scales large star counts so one mega-repo does not dominate every result
- `calculateRepoScore`: ranks a single repository by stars plus product fit dimensions
- `calculatePortfolioScore`: scores a selected project thesis across multiple inspirations

This means the UI is not hand-sorted. The project can be extended with new evidence without rewriting presentation logic.

## Workflow Simulator

`src/lib/workflow.ts` converts selected repositories and build options into a deterministic run:

- signal intake
- spec contract
- workflow graph
- guardrails
- build loop
- release kit

Each node has confidence, risk, duration, status, and an output artifact. The run also produces event timeline entries and dashboard metrics.

## Export Boundary

`src/lib/exporters.ts` generates a Markdown blueprint that can be copied or downloaded. This keeps export logic outside React components and makes it testable later.

## UI Composition

`src/App.tsx` is intentionally a single product shell, while core logic lives in modules. The UI includes:

- sidebar navigation
- project score overview
- mode toggles and scope control
- repository radar
- workflow graph canvas
- node inspector and event timeline
- generated blueprint preview
- evidence chain

## Extension Ideas

- Add a GitHub Actions workflow for lint, tests, and build.
- Add a command-line exporter for blueprint generation.
- Add screenshot generation for README assets.
- Add an optional live GitHub fetcher with cached fallback data.
- Add custom scoring profiles for backend, AI, data, and frontend portfolios.
