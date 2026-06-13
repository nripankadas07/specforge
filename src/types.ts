export type RepositoryCategory =
  | 'agent'
  | 'automation'
  | 'education'
  | 'mcp'
  | 'research'
  | 'systems'
  | 'ui'

export type RepositoryDimensions = {
  socialProof: number
  technicalDepth: number
  demoAppeal: number
  buildFeasibility: number
  moat: number
  risk: number
}

export type RepositorySignal = {
  id: string
  name: string
  owner: string
  stars: number
  language: string
  category: RepositoryCategory
  description: string
  url: string
  avatarUrl: string
  source: string
  signals: string[]
  dimensions: RepositoryDimensions
}

export type SourceSignal = {
  label: string
  platform: string
  signal: string
  url: string
}

export type ProjectMode = 'profile' | 'platform' | 'library'

export type ForgeOptions = {
  mode: ProjectMode
  safety: boolean
  evidence: boolean
  scope: number
}

export type ForgeNodeStatus = 'ready' | 'active' | 'verified' | 'blocked'

export type ForgeNode = {
  id: string
  label: string
  role: string
  x: number
  y: number
  duration: number
  confidence: number
  risk: number
  status: ForgeNodeStatus
  output: string
}

export type ForgeEdge = {
  from: string
  to: string
  kind: 'spec' | 'signal' | 'guardrail'
}

export type RunMetric = {
  label: string
  value: number
  tone: 'blue' | 'green' | 'amber' | 'pink'
}

export type RunEvent = {
  nodeId: string
  title: string
  detail: string
  elapsed: string
}

export type ForgeRun = {
  nodes: ForgeNode[]
  edges: ForgeEdge[]
  events: RunEvent[]
  metrics: RunMetric[]
  shipScore: number
}
