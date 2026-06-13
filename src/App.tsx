import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import {
  BadgeCheck,
  BookOpen,
  Boxes,
  BrainCircuit,
  Check,
  CircleDot,
  Clipboard,
  Code2,
  Database,
  Download,
  Flame,
  GitBranch,
  LockKeyhole,
  Play,
  Radar,
  RefreshCw,
  ShieldCheck,
  SlidersHorizontal,
  SquareTerminal,
  Workflow,
} from 'lucide-react'
import './App.css'
import { evidenceDate, repositories, sourceSignals } from './data/repositories'
import { buildMarkdownBlueprint, downloadTextFile } from './lib/exporters'
import { calculatePortfolioScore, formatStars, rankRepositories } from './lib/scoring'
import { buildForgeRun } from './lib/workflow'
import type {
  ForgeNode,
  ForgeOptions,
  ForgeRun,
  ProjectMode,
  RepositorySignal,
  RunMetric,
} from './types'

const defaultSelection = ['build-your-own-x', 'n8n', 'spec-kit', 'awesome-mcp-servers']

const modeOptions: Array<{ id: ProjectMode; label: string }> = [
  { id: 'profile', label: 'Profile' },
  { id: 'platform', label: 'Platform' },
  { id: 'library', label: 'Library' },
]

const categoryLabels: Record<RepositorySignal['category'], string> = {
  agent: 'Agent',
  automation: 'Automation',
  education: 'Learning',
  mcp: 'MCP',
  research: 'Research',
  systems: 'Systems',
  ui: 'UI',
}

const statusLabel: Record<ForgeNode['status'], string> = {
  active: 'Active',
  blocked: 'Blocked',
  ready: 'Ready',
  verified: 'Verified',
}

function App() {
  const rankedRepositories = useMemo(() => rankRepositories(repositories), [])
  const [selectedIds, setSelectedIds] = useState(defaultSelection)
  const [options, setOptions] = useState<ForgeOptions>({
    mode: 'profile',
    safety: true,
    evidence: true,
    scope: 72,
  })
  const [isRunning, setIsRunning] = useState(false)
  const [activeEvent, setActiveEvent] = useState(5)
  const [selectedNodeId, setSelectedNodeId] = useState('spec-contract')
  const [copied, setCopied] = useState(false)

  const selectedRepositories = useMemo(
    () => repositories.filter((repo) => selectedIds.includes(repo.id)),
    [selectedIds],
  )

  const run = useMemo(
    () => buildForgeRun(selectedRepositories, options),
    [selectedRepositories, options],
  )

  const blueprint = useMemo(
    () => buildMarkdownBlueprint(selectedRepositories, run, options),
    [selectedRepositories, run, options],
  )

  const portfolioScore = useMemo(
    () => calculatePortfolioScore(selectedRepositories),
    [selectedRepositories],
  )

  const selectedNode =
    run.nodes.find((node) => node.id === selectedNodeId) ?? run.nodes.find((node) => node.status === 'active')

  useEffect(() => {
    if (!isRunning) return

    const timer = window.setInterval(() => {
      setActiveEvent((current) => {
        if (current >= run.events.length - 1) {
          setIsRunning(false)
          return current
        }

        return current + 1
      })
    }, 740)

    return () => window.clearInterval(timer)
  }, [isRunning, run.events.length])

  const toggleRepo = (id: string) => {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.length <= 2 ? current : current.filter((repoId) => repoId !== id)
      }

      return [...current.slice(-4), id]
    })
  }

  const updateOptions = (next: Partial<ForgeOptions>) => {
    setOptions((current) => ({ ...current, ...next }))
  }

  const playRun = () => {
    setActiveEvent(0)
    setIsRunning(true)
  }

  const copyBlueprint = async () => {
    const copyWithTextarea = () => {
      const field = document.createElement('textarea')
      field.value = blueprint
      field.setAttribute('readonly', 'true')
      field.style.position = 'fixed'
      field.style.left = '-9999px'
      document.body.appendChild(field)
      field.select()
      const success = document.execCommand('copy')
      document.body.removeChild(field)
      return success
    }

    let didCopy: boolean

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(blueprint)
        didCopy = true
      } catch {
        didCopy = copyWithTextarea()
      }
    } else {
      didCopy = copyWithTextarea()
    }

    if (didCopy) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } else {
      downloadTextFile('specforge-blueprint.md', blueprint)
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="SpecForge navigation">
        <a className="brand" href="https://github.com" target="_blank" rel="noreferrer">
          <span className="brand-mark" aria-hidden="true">
            <Workflow size={22} />
          </span>
          <span>
            <strong>SpecForge</strong>
            <small>Signal to spec</small>
          </span>
        </a>

        <nav className="nav-list">
          <a href="#radar">
            <Radar size={18} />
            Radar
          </a>
          <a href="#studio">
            <BrainCircuit size={18} />
            Studio
          </a>
          <a href="#blueprint">
            <BookOpen size={18} />
            Blueprint
          </a>
        </nav>

        <div className="source-stack">
          <p className="eyebrow">Evidence date</p>
          <strong>{evidenceDate}</strong>
          <span>{sourceSignals.length} source families tracked</span>
        </div>

        <div className="sidebar-footer">
          <GitBranch size={18} />
          <span>Built to pin on a GitHub profile</span>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Local-first project intelligence</p>
            <h1>Spec-driven agent workflow studio</h1>
          </div>

          <div className="topbar-actions">
            <button className="button ghost" type="button" onClick={copyBlueprint}>
              {copied ? <Check size={17} /> : <Clipboard size={17} />}
              {copied ? 'Copied' : 'Copy brief'}
            </button>
            <button
              className="button primary"
              type="button"
              onClick={() => downloadTextFile('specforge-blueprint.md', blueprint)}
            >
              <Download size={17} />
              Export
            </button>
          </div>
        </header>

        <section className="overview-grid" aria-label="Project overview">
          <div className="score-panel">
            <div className="section-kicker">
              <BadgeCheck size={18} />
              Profile fit
            </div>
            <ScoreRing score={run.shipScore} label="Ship score" />
            <div className="metric-list">
              {run.metrics.map((metric) => (
                <MetricBar key={metric.label} metric={metric} />
              ))}
            </div>
          </div>

          <div className="thesis-panel">
            <div className="thesis-copy">
              <p className="eyebrow">Build thesis</p>
              <h2>
                Combine build-your-own credibility, curated knowledge, visual workflow control, and
                spec-first engineering.
              </h2>
              <p>
                Current score: {portfolioScore}/100 across {selectedRepositories.length} selected
                references.
              </p>
            </div>
            <div className="thesis-tags" aria-label="Selected thesis tags">
              {selectedRepositories.flatMap((repo) => repo.signals.slice(0, 1)).map((signal) => (
                <span key={signal}>{signal}</span>
              ))}
            </div>
          </div>

          <div className="control-strip">
            <div className="section-kicker">
              <SlidersHorizontal size={18} />
              Mode
            </div>
            <div className="segmented" role="tablist" aria-label="Project mode">
              {modeOptions.map((mode) => (
                <button
                  key={mode.id}
                  className={options.mode === mode.id ? 'active' : ''}
                  type="button"
                  onClick={() => updateOptions({ mode: mode.id })}
                >
                  {mode.label}
                </button>
              ))}
            </div>
            <Toggle
              checked={options.safety}
              icon={<ShieldCheck size={17} />}
              label="Guardrails"
              onChange={(checked) => updateOptions({ safety: checked })}
            />
            <Toggle
              checked={options.evidence}
              icon={<Database size={17} />}
              label="Evidence"
              onChange={(checked) => updateOptions({ evidence: checked })}
            />
          </div>
        </section>

        <section id="radar" className="radar-section" aria-labelledby="radar-title">
          <div className="section-header">
            <div>
              <p className="eyebrow">Repository radar</p>
              <h2 id="radar-title">High-star inspirations ranked for a buildable profile project</h2>
            </div>
            <span className="status-pill">
              <RefreshCw size={15} />
              API verified
            </span>
          </div>
          <TrendRadar
            rankedRepositories={rankedRepositories}
            selectedIds={selectedIds}
            onToggle={toggleRepo}
          />
        </section>

        <section id="studio" className="studio-grid" aria-labelledby="studio-title">
          <div className="studio-panel">
            <div className="section-header compact">
              <div>
                <p className="eyebrow">Workflow studio</p>
                <h2 id="studio-title">SpecForge run graph</h2>
              </div>
              <button className="button primary" type="button" onClick={playRun}>
                <Play size={17} />
                Run
              </button>
            </div>

            <WorkflowCanvas
              run={run}
              activeNodeId={run.events[activeEvent]?.nodeId}
              selectedNodeId={selectedNode?.id}
              onSelect={setSelectedNodeId}
            />
          </div>

          <aside className="inspector" aria-label="Workflow inspector">
            <div className="scope-control">
              <label htmlFor="scope">Scope pressure</label>
              <div className="scope-value">{options.scope}</div>
              <input
                id="scope"
                type="range"
                min="45"
                max="100"
                value={options.scope}
                onChange={(event) => updateOptions({ scope: Number(event.currentTarget.value) })}
              />
            </div>

            {selectedNode ? <NodeInspector node={selectedNode} /> : null}

            <div className="timeline">
              {run.events.map((event, index) => (
                <button
                  key={event.nodeId}
                  className={index <= activeEvent ? 'done' : ''}
                  type="button"
                  onClick={() => {
                    setActiveEvent(index)
                    setSelectedNodeId(event.nodeId)
                  }}
                >
                  <span>{event.elapsed}</span>
                  <strong>{event.title}</strong>
                  <small>{event.detail}</small>
                </button>
              ))}
            </div>
          </aside>
        </section>

        <section id="blueprint" className="blueprint-grid" aria-labelledby="blueprint-title">
          <div className="blueprint-panel">
            <div className="section-header compact">
              <div>
                <p className="eyebrow">Generated brief</p>
                <h2 id="blueprint-title">README-ready project narrative</h2>
              </div>
              <button className="button ghost" type="button" onClick={copyBlueprint}>
                <Clipboard size={17} />
                Copy
              </button>
            </div>
            <pre>{blueprint}</pre>
          </div>

          <div className="evidence-panel">
            <div className="section-kicker">
              <LockKeyhole size={18} />
              Evidence chain
            </div>
            <div className="source-list">
              {sourceSignals.map((source) => (
                <a key={source.label} href={source.url} target="_blank" rel="noreferrer">
                  <span>{source.platform}</span>
                  <strong>{source.label}</strong>
                  <small>{source.signal}</small>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function ScoreRing({ score, label }: { score: number; label: string }) {
  const style = { '--score': `${score * 3.6}deg` } as CSSProperties

  return (
    <div className="score-ring" style={style} aria-label={`${label}: ${score} out of 100`}>
      <div>
        <strong>{score}</strong>
        <span>{label}</span>
      </div>
    </div>
  )
}

function MetricBar({ metric }: { metric: RunMetric }) {
  const style = { '--value': `${metric.value}%` } as CSSProperties

  return (
    <div className={`metric-bar ${metric.tone}`} style={style}>
      <span>{metric.label}</span>
      <strong>{metric.value}</strong>
      <i aria-hidden="true" />
    </div>
  )
}

function Toggle({
  checked,
  icon,
  label,
  onChange,
}: {
  checked: boolean
  icon: ReactNode
  label: string
  onChange: (checked: boolean) => void
}) {
  return (
    <button
      className={`toggle ${checked ? 'checked' : ''}`}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
    >
      {icon}
      <span>{label}</span>
      <i aria-hidden="true" />
    </button>
  )
}

function TrendRadar({
  rankedRepositories,
  selectedIds,
  onToggle,
}: {
  rankedRepositories: ReturnType<typeof rankRepositories>
  selectedIds: string[]
  onToggle: (id: string) => void
}) {
  return (
    <div className="repo-grid">
      {rankedRepositories.slice(0, 12).map(({ repo, score, starMass }) => {
        const selected = selectedIds.includes(repo.id)
        const style = { '--score': `${score}%`, '--stars': `${starMass}%` } as CSSProperties

        return (
          <button
            key={repo.id}
            className={`repo-card ${selected ? 'selected' : ''}`}
            type="button"
            onClick={() => onToggle(repo.id)}
            style={style}
          >
            <span className="repo-card-top">
              <img src={repo.avatarUrl} alt="" width="42" height="42" loading="lazy" />
              <span>
                <strong>{repo.name}</strong>
                <small>{repo.owner}</small>
              </span>
              {selected ? <Check size={17} /> : <CircleDot size={17} />}
            </span>
            <span className="repo-meta">
              <span>{formatStars(repo.stars)} stars</span>
              <span>{repo.language}</span>
              <span>{categoryLabels[repo.category]}</span>
            </span>
            <span className="repo-description">{repo.description}</span>
            <span className="repo-bars">
              <i aria-hidden="true" />
              <b aria-hidden="true" />
            </span>
            <span className="repo-score">
              <Flame size={15} />
              {score} fit
            </span>
          </button>
        )
      })}
    </div>
  )
}

function WorkflowCanvas({
  run,
  activeNodeId,
  selectedNodeId,
  onSelect,
}: {
  run: ForgeRun
  activeNodeId?: string
  selectedNodeId?: string
  onSelect: (id: string) => void
}) {
  const nodeById = new Map(run.nodes.map((node) => [node.id, node]))

  return (
    <div className="canvas-wrap">
      <svg className="edge-layer" viewBox="0 0 100 80" preserveAspectRatio="none" aria-hidden="true">
        {run.edges.map((edge) => {
          const from = nodeById.get(edge.from)
          const to = nodeById.get(edge.to)
          if (!from || !to) return null

          return (
            <line
              key={`${edge.from}-${edge.to}`}
              className={`edge ${edge.kind}`}
              x1={from.x + 8}
              y1={from.y + 5}
              x2={to.x + 8}
              y2={to.y + 5}
            />
          )
        })}
      </svg>
      {run.nodes.map((node) => {
        const style = { left: `${node.x}%`, top: `${node.y}%` } as CSSProperties
        const active = node.id === activeNodeId
        const selected = node.id === selectedNodeId

        return (
          <button
            key={node.id}
            className={`workflow-node ${node.status} ${active ? 'active' : ''} ${
              selected ? 'selected' : ''
            }`}
            type="button"
            style={style}
            onClick={() => onSelect(node.id)}
          >
            <span>{statusLabel[node.status]}</span>
            <strong>{node.label}</strong>
            <small>{node.confidence}% confidence</small>
          </button>
        )
      })}
    </div>
  )
}

function NodeInspector({ node }: { node: ForgeNode }) {
  return (
    <div className="node-inspector">
      <div className="node-title">
        <GitBranch size={18} />
        <span>{statusLabel[node.status]}</span>
      </div>
      <h3>{node.label}</h3>
      <p>{node.role}</p>
      <div className="node-stats">
        <span>
          <Code2 size={15} />
          {node.duration}m
        </span>
        <span>
          <SquareTerminal size={15} />
          {node.confidence}
        </span>
        <span>
          <Boxes size={15} />
          {node.risk}
        </span>
      </div>
      <div className="node-output">{node.output}</div>
    </div>
  )
}

export default App
