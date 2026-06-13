# Contributing

Thanks for taking a look at SpecForge.

This project is intentionally small and local-first. Contributions should keep the core promise intact: deterministic project scoring, inspectable workflow simulation, and no required API keys.

## Local Setup

```bash
npm install
npm run dev
```

## Quality Gates

Run these before opening a pull request:

```bash
npm run lint
npm run test
npm run build
```

## Contribution Guidelines

- Keep scoring and workflow changes deterministic.
- Add or update tests for logic changes under `src/lib`.
- Keep UI changes responsive at desktop and mobile widths.
- Do not introduce required remote services or secrets.
- Document new evidence sources in `docs/RESEARCH.md`.

## Good First Changes

- Add a new scoring profile.
- Add a new repository evidence snapshot.
- Improve keyboard accessibility in the workflow graph.
- Add a CLI exporter for generated blueprints.
