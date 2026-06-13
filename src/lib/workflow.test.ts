import { describe, expect, it } from 'vitest'
import { repositories } from '../data/repositories'
import { buildForgeRun } from './workflow'

const selected = repositories.filter((repo) =>
  ['build-your-own-x', 'n8n', 'spec-kit', 'awesome-mcp-servers'].includes(repo.id),
)

describe('workflow simulator', () => {
  it('builds a connected run from repository evidence', () => {
    const run = buildForgeRun(selected, {
      mode: 'profile',
      safety: true,
      evidence: true,
      scope: 72,
    })

    expect(run.nodes).toHaveLength(6)
    expect(run.edges).toHaveLength(6)
    expect(run.events[0].nodeId).toBe('signal-intake')
    expect(run.shipScore).toBeGreaterThan(78)
  })

  it('lowers confidence when safety is disabled', () => {
    const safeRun = buildForgeRun(selected, {
      mode: 'profile',
      safety: true,
      evidence: true,
      scope: 72,
    })
    const riskyRun = buildForgeRun(selected, {
      mode: 'profile',
      safety: false,
      evidence: true,
      scope: 72,
    })

    expect(safeRun.shipScore).toBeGreaterThan(riskyRun.shipScore)
    expect(riskyRun.nodes.find((node) => node.id === 'guardrails')?.status).toBe('blocked')
  })

  it('applies scope pressure to ambitious builds', () => {
    const focusedRun = buildForgeRun(selected, {
      mode: 'profile',
      safety: true,
      evidence: true,
      scope: 60,
    })
    const overloadedRun = buildForgeRun(selected, {
      mode: 'profile',
      safety: true,
      evidence: true,
      scope: 98,
    })

    expect(focusedRun.shipScore).toBeGreaterThanOrEqual(overloadedRun.shipScore)
  })
})
