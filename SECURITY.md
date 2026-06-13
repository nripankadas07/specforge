# Security Policy

SpecForge is a local-first planning and demo app. It does not require API keys, write to your filesystem from the browser, or call LLM services at runtime.

## Supported Versions

Security fixes target the latest `main` branch.

## Reporting

Please open a GitHub issue for non-sensitive security concerns. If a report contains sensitive details, share only the minimal public reproduction and note that more detail is available privately.

## Security Boundaries

- Repository evidence is static application data.
- Exported blueprints are generated in the browser.
- The app does not execute generated workflow steps.
- The GitHub Pages build is static output from Vite.

## Dependency Hygiene

Use:

```bash
npm audit
npm run lint
npm run test
npm run build
```
