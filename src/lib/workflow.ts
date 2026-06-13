import type {
  ForgeEdge,
  ForgeNode,
  ForgeOptions,
  ForgeRun,
  RepositorySignal,
  RunMetric,
} from '../types'
import { calculatePortfolioScore } from './scoring'

const clamp = (value: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(value)))

const average = (repos: RepositorySignal[], selector: (repo: RepositorySignal) => number) => {
  if (repos.length === 0) return 0
  return repos.reduce((sum, repo) => sum + selector(repo), 0) / repos.length
}

export function buildForgeRun(repositories: RepositorySignal[], options: ForgeOptions): ForgeRun {
  const depth = average(repositories, (repo) => repo.dimensions.technicalDepth)
  const demo = average(repositories, (repo) => repo.dimensions.demoAppeal)
  const feasibility = average(repositories, (repo) => repo.dimensions.buildFeasibility)
  const risk = average(repositories, (repo) => repo.dimensions.risk)
  const portfolioScore = calculatePortfolioScore(repositories)
  const safetyBoost = options.safety ? 10 : -4
  const evidenceBoost = options.evidence ? 8 : -3
  const scopePenalty = Math.max(0, options.scope - 72) * 0.18

  const metrics: RunMetric[] = [
    { label: 'Signal fit', value: clamp(portfolioScore + evidenceBoost * 0.3), tone: 'blue' },
    { label: 'Technical depth', value: clamp(depth + options.scope * 0.08), tone: 'green' },
    { label: 'Demo pull', value: clamp(demo + (options.mode === 'profile' ? 6 : 0)), tone: 'pink' },
    { label: 'Risk control', value: clamp(100 - risk + safetyBoost), tone: 'amber' },
  ]

  const shipScore = clamp(
    portfolioScore * 0.34 +
      feasibility * 0.24 +
      demo * 0.18 +
      depth * 0.16 +
      safetyBoost +
      evidenceBoost -
      scopePenalty,
  )

  const nodes: ForgeNode[] = [
    {
      id: 'signal-intake',
      label: 'Signal Intake',
      role: 'Rank high-star repositories and social developer signals.',
      x: 8,
      y: 16,
      duration: 4,
      confidence: clamp(82 + evidenceBoost),
      risk: clamp(18 - evidenceBoost),
      status: 'verified',
      output: `${repositories.length} references compressed into a build thesis.`,
    },
    {
      id: 'spec-contract',
      label: 'Spec Contract',
      role: 'Turn the thesis into requirements, non-goals, acceptance tests, and constraints.',
      x: 34,
      y: 10,
      duration: 6,
      confidence: clamp(78 + evidenceBoost + options.scope * 0.08),
      risk: clamp(26 - evidenceBoost),
      status: 'active',
      output: 'Spec pack with project promise, user stories, and evaluation gates.',
    },
    {
      id: 'workflow-graph',
      label: 'Workflow Graph',
      role: 'Design a visible agent/workflow system that can be inspected without external APIs.',
      x: 62,
      y: 18,
      duration: 8,
      confidence: clamp(demo),
      risk: clamp(34 + scopePenalty),
      status: 'ready',
      output: 'Interactive graph with deterministic simulation and event trace.',
    },
    {
      id: 'guardrails',
      label: 'Guardrails',
      role: 'Add local-first defaults, threat notes, dry-run behavior, and export boundaries.',
      x: 22,
      y: 56,
      duration: 5,
      confidence: clamp(74 + safetyBoost),
      risk: clamp(42 - safetyBoost),
      status: options.safety ? 'verified' : 'blocked',
      output: options.safety
        ? 'Safety checks enabled before any generated workflow is marked shippable.'
        : 'Risk accepted: automation runs without full guardrail review.',
    },
    {
      id: 'build-loop',
      label: 'Build Loop',
      role: 'Ship the working UI, domain logic, tests, and GitHub-ready documentation.',
      x: 50,
      y: 58,
      duration: 12,
      confidence: clamp(feasibility + options.scope * 0.05),
      risk: clamp(30 + scopePenalty),
      status: 'ready',
      output: 'Runnable app, pure TypeScript engine, and test harness.',
    },
    {
      id: 'release-kit',
      label: 'Release Kit',
      role: 'Package README, screenshots, roadmap, and first issues for a profile launch.',
      x: 80,
      y: 54,
      duration: 4,
      confidence: shipScore,
      risk: clamp(22 + scopePenalty - evidenceBoost),
      status: shipScore > 76 ? 'verified' : 'ready',
      output: 'Publish checklist and generated project narrative.',
    },
  ]

  const edges: ForgeEdge[] = [
    { from: 'signal-intake', to: 'spec-contract', kind: 'signal' },
    { from: 'spec-contract', to: 'workflow-graph', kind: 'spec' },
    { from: 'spec-contract', to: 'guardrails', kind: 'guardrail' },
    { from: 'guardrails', to: 'build-loop', kind: 'guardrail' },
    { from: 'workflow-graph', to: 'build-loop', kind: 'spec' },
    { from: 'build-loop', to: 'release-kit', kind: 'spec' },
  ]

  const events = nodes.map((node, index) => ({
    nodeId: node.id,
    title: node.label,
    detail: node.output,
    elapsed: `${nodes.slice(0, index + 1).reduce((sum, current) => sum + current.duration, 0)}m`,
  }))

  return { nodes, edges, events, metrics, shipScore }
}
