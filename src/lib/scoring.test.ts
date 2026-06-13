import { describe, expect, it } from 'vitest'
import { repositories } from '../data/repositories'
import {
  calculatePortfolioScore,
  calculateRepoScore,
  formatStars,
  normalizeStars,
  rankRepositories,
} from './scoring'

describe('scoring', () => {
  it('normalizes stars on a log scale', () => {
    expect(normalizeStars(514_816, 514_816)).toBe(100)
    expect(normalizeStars(57_258, 514_816)).toBeGreaterThan(0)
  })

  it('ranks portfolio-worthy repositories by more than raw stars', () => {
    const ranked = rankRepositories(repositories)
    expect(ranked[0].score).toBeGreaterThan(80)
    expect(ranked.find((item) => item.repo.id === 'n8n')?.score).toBeGreaterThan(70)
  })

  it('penalizes risky clones even when social proof is high', () => {
    const maxStars = Math.max(...repositories.map((repo) => repo.stars))
    const openclaw = repositories.find((repo) => repo.id === 'openclaw')
    const specKit = repositories.find((repo) => repo.id === 'spec-kit')

    expect(openclaw).toBeDefined()
    expect(specKit).toBeDefined()
    expect(calculateRepoScore(specKit!, maxStars)).toBeGreaterThan(
      calculateRepoScore(openclaw!, maxStars) - 12,
    )
  })

  it('scores a combined thesis as a stronger profile project', () => {
    const selected = repositories.filter((repo) =>
      ['build-your-own-x', 'n8n', 'spec-kit', 'awesome-mcp-servers'].includes(repo.id),
    )

    expect(calculatePortfolioScore(selected)).toBeGreaterThan(75)
  })

  it('formats stars compactly', () => {
    expect(formatStars(514_816)).toBe('515k')
    expect(formatStars(57_258)).toBe('57.3k')
  })
})
