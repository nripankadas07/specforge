import type { RepositorySignal } from '../types'

const clamp = (value: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(value)))

export function normalizeStars(stars: number, maxStars: number) {
  if (stars <= 0 || maxStars <= 0) return 0

  const floor = Math.log10(50_000)
  const score = ((Math.log10(stars) - floor) / (Math.log10(maxStars) - floor)) * 100
  return clamp(score)
}

export function calculateRepoScore(repo: RepositorySignal, maxStars: number) {
  const starMass = normalizeStars(repo.stars, maxStars)
  const dimensions = repo.dimensions
  const weighted =
    starMass * 0.18 +
    dimensions.technicalDepth * 0.2 +
    dimensions.demoAppeal * 0.18 +
    dimensions.buildFeasibility * 0.16 +
    dimensions.socialProof * 0.14 +
    dimensions.moat * 0.18 -
    dimensions.risk * 0.08

  return clamp(weighted)
}

export function rankRepositories(repositories: RepositorySignal[]) {
  const maxStars = Math.max(...repositories.map((repo) => repo.stars))

  return repositories
    .map((repo) => ({
      repo,
      score: calculateRepoScore(repo, maxStars),
      starMass: normalizeStars(repo.stars, maxStars),
    }))
    .sort((a, b) => b.score - a.score)
}

export function formatStars(stars: number) {
  if (stars >= 1_000_000) return `${(stars / 1_000_000).toFixed(1)}M`
  if (stars >= 100_000) return `${Math.round(stars / 1000)}k`
  if (stars >= 10_000) return `${(stars / 1000).toFixed(1)}k`
  return new Intl.NumberFormat('en-US').format(stars)
}

export function calculatePortfolioScore(repositories: RepositorySignal[]) {
  if (repositories.length === 0) return 0

  const avg = repositories.reduce(
    (total, repo) => {
      total.depth += repo.dimensions.technicalDepth
      total.demo += repo.dimensions.demoAppeal
      total.feasible += repo.dimensions.buildFeasibility
      total.moat += repo.dimensions.moat
      total.risk += repo.dimensions.risk
      return total
    },
    { depth: 0, demo: 0, feasible: 0, moat: 0, risk: 0 },
  )

  const count = repositories.length
  const score =
    (avg.depth / count) * 0.28 +
    (avg.demo / count) * 0.26 +
    (avg.feasible / count) * 0.18 +
    (avg.moat / count) * 0.2 -
    (avg.risk / count) * 0.1 +
    Math.min(10, count * 2)

  return clamp(score)
}
