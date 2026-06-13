import type { ForgeOptions, ForgeRun, RepositorySignal } from '../types'
import { evidenceDate, sourceSignals } from '../data/repositories'
import { formatStars } from './scoring'

export function buildMarkdownBlueprint(
  repositories: RepositorySignal[],
  run: ForgeRun,
  options: ForgeOptions,
) {
  const repoList = repositories
    .map(
      (repo) =>
        `- ${repo.owner}/${repo.name}: ${formatStars(repo.stars)} stars, ${repo.language}, ${repo.signals.join(', ')}`,
    )
    .join('\n')

  const milestones = run.nodes
    .map(
      (node) =>
        `- [ ] ${node.label}: ${node.role} Output: ${node.output} Confidence: ${node.confidence}/100.`,
    )
    .join('\n')

  const sources = sourceSignals
    .map((source) => `- ${source.platform}: ${source.label}. ${source.url}`)
    .join('\n')

  return `# SpecForge Blueprint

Generated: ${evidenceDate}
Mode: ${options.mode}
Ship score: ${run.shipScore}/100

## Thesis

Build a local-first spec-driven workflow studio that turns open-source trend evidence into a polished GitHub-profile project. The project borrows the durable pull of build-your-own learning, the clarity of awesome lists, the visual appeal of workflow builders, and the seriousness of spec-driven engineering.

## Evidence Set

${repoList}

## Milestones

${milestones}

## Launch Criteria

- Runnable without API keys.
- Explains the selection logic in code and docs.
- Ships with deterministic simulator tests.
- Exports a README-ready project brief.
- Makes safety and evidence visible instead of hiding them in prose.

## Sources

${sources}
`
}

export function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
