# Product Spec

## Objective

Build a local-first app that helps a developer turn high-signal open-source trends into a portfolio project brief and executable workflow.

## Primary User

A developer preparing a GitHub profile project who wants evidence, technical credibility, and a polished demo surface.

## Requirements

- Display a ranked radar of high-star open-source inspirations.
- Allow selecting at least two and at most five repository inspirations.
- Compute a project score from the selected evidence set.
- Simulate a spec-driven workflow with visible node status, risk, confidence, and output.
- Provide toggles for evidence and guardrails.
- Provide a scope control that affects the ship score.
- Generate an exportable Markdown blueprint.
- Run without API keys or external runtime services.
- Include automated tests for the scoring and workflow logic.

## Non-Goals

- It is not a live social-media scraper.
- It is not an LLM agent framework.
- It is not a clone of n8n, Langflow, Dify, or any other referenced project.
- It does not make autonomous changes to local files.

## Acceptance Criteria

- `npm run lint` passes.
- `npm run test` passes.
- `npm run build` passes.
- The app remains usable on desktop and mobile widths.
- Exported Markdown includes the selected evidence, milestones, launch criteria, and sources.

## Current Status

Implemented as a React and TypeScript Vite app with a deterministic local simulator.
