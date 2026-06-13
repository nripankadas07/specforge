# SpecForge

SpecForge is a local-first workflow studio for turning open-source trend evidence into a spec-driven portfolio project.

It was designed as a GitHub-profile piece: polished enough to demo, technical enough to inspect, and grounded in current high-star project patterns instead of generic app ideas.

## Why This Exists

The highest-signal repositories I verified on 2026-06-13 cluster around four durable ideas:

- Build-your-own learning and technical depth.
- Curated developer knowledge and awesome-list discovery.
- Visual AI workflow builders and agent orchestration.
- Spec-driven development, guardrails, and MCP-style tooling.

SpecForge combines those ideas into a runnable product: pick high-signal inspirations, simulate a spec-first build workflow, inspect confidence and risk, then export a README-ready blueprint.

## Features

- Trend radar backed by a fixed, source-linked dataset of high-star GitHub repositories.
- Repository scoring engine that weighs stars, technical depth, demo appeal, feasibility, moat, and risk.
- Interactive workflow graph with deterministic event simulation.
- Guardrail and evidence toggles that change the ship score and node status.
- Exportable Markdown blueprint for project planning or README drafts.
- Pure TypeScript scoring and workflow modules covered by Vitest tests.
- Responsive dashboard UI with real repository avatars and no API key requirement.

## Tech Stack

- React 19
- TypeScript 6
- Vite 8
- Vitest
- Lucide React

## Quick Start

```bash
npm install
npm run dev
```

Quality gates:

```bash
npm run lint
npm run test
npm run build
```

## Architecture

```text
src/
  data/
    repositories.ts      verified source dataset
  lib/
    scoring.ts           portfolio scoring and ranking logic
    workflow.ts          deterministic workflow simulator
    exporters.ts         Markdown export utilities
  App.tsx                product shell and interaction wiring
  App.css                dashboard visual system
```

Read more in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Research Sources

- GitHub high-star baseline: https://api.github.com/search/repositories?q=stars:%3E100000&sort=stars&order=desc
- GitHub AI repository query: https://api.github.com/search/repositories?q=topic:ai%20stars:%3E20000&sort=stars&order=desc
- GitHub MCP repository query: https://api.github.com/search/repositories?q=topic:mcp%20stars:%3E5000&sort=stars&order=desc
- GitHub Trending: https://github.com/trending
- OSSInsight AI trending: https://ossinsight.io/trending/ai
- Hacker News spec-driven workflow discussion: https://news.ycombinator.com/item?id=48413629
- Hacker News composable agent discussion: https://news.ycombinator.com/item?id=47350516

Details are in [docs/RESEARCH.md](docs/RESEARCH.md).

## Project Standard

SpecForge is intentionally local-first. It does not call LLM APIs, scrape live social media, or require credentials at runtime. The repository data is fixed inside the app so demos are stable, repeatable, and reviewable.

## License

MIT
