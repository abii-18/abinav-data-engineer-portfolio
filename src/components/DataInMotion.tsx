import { useEffect, useRef, useState } from 'react'
import './DataInMotion.css'

const metrics = [
  { value: 5000000, suffix: '+', kind: 'million', label: 'Financial records / day' },
  { value: 99.9, suffix: '%', kind: 'decimal', label: 'Pipeline success' },
  { value: 150, suffix: '+', kind: 'integer', label: 'Daily production runs' },
  { value: 40, suffix: '%', kind: 'integer', label: 'Faster queries' },
  { value: 3, suffix: '×', kind: 'integer', label: 'Faster data loads' },
  { value: 25, suffix: '%', kind: 'integer', label: 'Fewer recurring issues' },
]
const stages = [
  { name: 'S3', subtitle: 'INGEST', detail: 'Amazon S3 supports ingestion and raw data storage for the financial data platform.' },
  { name: 'GLUE', subtitle: 'TRANSFORM', detail: 'AWS Glue transforms incoming data. Airflow coordinates scheduling, dependencies and retries.' },
  { name: 'VALIDATE', subtitle: 'QUALITY', detail: 'Python and SQL checks help detect missing data, duplicates and inconsistencies before delivery.' },
  { name: 'REPORTING', subtitle: 'DELIVER', detail: 'Validated datasets support downstream financial reporting, with CloudWatch monitoring and L3 production support.' },
]
const format = (value: number, kind: string) => kind === 'million' ? `${(value / 1000000).toFixed(1).replace(/\\.0$/, '')}M` : kind === 'decimal' ? value.toFixed(1) : Math.floor(value).toString()
function useMotion() {
  const [paused, setPaused] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const time = useRef(0)
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0, previous = 0
    const tick = (now: number) => {
      if (previous) time.current += Math.min((now - previous) / 1000, .06)
      previous = now
      setSeconds(time.current)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [paused])
  return { seconds, paused, setPaused }
}
function Metric({ value, suffix, kind, label, seconds }: typeof metrics[number] & { seconds: number }) {
  const phase = (seconds % 6) / 6
  const progress = phase < .75 ? 1 - Math.pow(1 - phase / .75, 3) : 1
  return <div className="motion-metric"><strong>{format(value * progress, kind)}{suffix}</strong><span>{label}</span></div>
}
function ParticleField({ seconds }: { seconds: number }) {
  const blend = (1 - Math.cos(seconds * .9)) / 2
  return <svg className="motion-svg" viewBox="0 0 640 270" role="img" aria-label="Animated raw data particles organizing into a structured grid">
    <circle cx="320" cy="125" r="109" fill="none" stroke="#747785" strokeDasharray="3 7" opacity=".4" />
    <circle cx="320" cy="125" r="68" fill="none" stroke="#747785" opacity=".2" />
    {Array.from({ length: 180 }, (_, i) => {
      const angle = i * 2.39996
      const radius = 32 + (i * 37 % 115)
      const x = 320 + Math.cos(angle + seconds * .1) * radius
      const y = 125 + Math.sin(angle + seconds * .1) * radius * .82
      const gx = 205 + (i % 19) * 12.6
      const gy = 46 + Math.floor(i / 19) * 16
      return <circle key={i} cx={x * (1 - blend) + gx * blend} cy={y * (1 - blend) + gy * blend} r={i % 8 === 0 ? 2.8 : 1.7} fill={i % 7 === 0 ? '#98a7c7' : '#e6e7ef'} opacity={.28 + .72 * blend} />
    })}
    <text x="320" y="259" textAnchor="middle" fill="#a5a8b3" fontSize="11" letterSpacing="2">RAW SIGNALS → STRUCTURED DATA</text>
  </svg>
}
function ProductionFlow({ seconds }: { seconds: number }) {
  const [selected, setSelected] = useState<number | null>(null)
  const xs = [76, 239, 401, 564]
  return <><svg className="motion-svg" viewBox="0 0 640 224" role="img" aria-label="Interactive BMO production pipeline: S3 to Glue to validation to reporting">
    {xs.slice(0, 3).map((x, i) => <line key={i} x1={x + 46} y1="105" x2={xs[i + 1] - 46} y2="105" stroke="#858996" strokeDasharray="4 5" />)}
    {Array.from({ length: 65 }, (_, i) => {
      const p = (i / 65 + seconds * .12) % 1
      const z = p * 3, segment = Math.min(2, Math.floor(z)), f = z - segment
      return <circle key={i} cx={xs[segment] + 46 + (xs[segment + 1] - xs[segment] - 92) * f} cy={105 + (i % 7 - 3) * 3} r="2.3" fill={i % 6 === 0 ? '#9da9c5' : '#e8e9f0'} opacity={.2 + .8 * Math.sin(Math.PI * f)} />
    })}
    {stages.map((stage, i) => <g key={stage.name} role="button" tabIndex={0} aria-label={`Learn about ${stage.name}`} onClick={() => setSelected(i)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(i) } }} className="motion-node">
      <rect x={xs[i] - 45} y="67" width="90" height="76" rx="11" fill={selected === i ? '#292d37' : '#1a1b21'} stroke={selected === i ? '#f1f1f3' : '#888b98'} />
      <text x={xs[i]} y="99" textAnchor="middle" fill="#f1f1f3" fontSize="12" fontWeight="700">{stage.name}</text>
      <text x={xs[i]} y="121" textAnchor="middle" fill="#a4a6b1" fontSize="10">{stage.subtitle}</text>
    </g>)}
    <text x="320" y="209" textAnchor="middle" fill="#a5a8b3" fontSize="11" letterSpacing="1">AIRFLOW · 150+ DAILY PRODUCTION RUNS</text>
  </svg><div className="motion-stages">{stages.map((stage, i) => <div className="motion-stage" key={stage.name}><strong>{stage.name}</strong><small>{stage.subtitle}</small><div className="motion-track"><i style={{ width: `${Math.max(0, Math.min(100, (seconds * .55 % 4 - i) * 100))}%` }} /></div></div>)}</div><div className="motion-detail" aria-live="polite"><strong>{selected === null ? 'Explore the pipeline' : stages[selected].name}</strong><p>{selected === null ? 'Select a stage above to explore its role in the production workflow.' : stages[selected].detail}</p></div></>
}
export function DataInMotion() {
  const { seconds, paused, setPaused } = useMotion()
  return <section className="data-motion" aria-label="Data engineering in motion">
    <div className="motion-heading"><div><span className="motion-eyebrow">ABINAV S. / DATA ENGINEERING</span><h2>Data.<br /><em>In Motion.</em></h2><p>Building, optimizing and operating production pipelines that turn complex raw data into trustworthy, analytics-ready information.</p></div><button className="motion-control" type="button" onClick={() => setPaused(v => !v)} aria-pressed={paused}>{paused ? '▶ Play animations' : 'Ⅱ Pause animations'}</button></div>
    <div className="motion-metrics">{metrics.slice(0, 4).map(metric => <Metric key={metric.label} {...metric} seconds={seconds} />)}</div>
    <div className="motion-section"><div className="motion-section-label">01 / WHAT I DO</div><div className="motion-panel"><h3>From complexity to clarity.</h3><p>Ingestion · Transformation · Validation · Orchestration · Delivery</p><ParticleField seconds={seconds} /></div><p className="motion-description">I work across Python, SQL, Airflow and AWS to develop resilient ETL workflows, enforce data quality, improve performance and maintain production reliability.</p></div>
    <div className="motion-section"><div className="motion-section-label">02 / BMO PRODUCTION</div><h3 className="motion-section-title">Built for reliability.</h3><p className="motion-description">Financial data pipelines at Virtusa for BMO, from raw ingestion to validated downstream reporting and L3 operational ownership.</p><div className="motion-panel"><div className="motion-panel-top"><strong>PRODUCTION DATA FLOW</strong><span>VIRTUSA · BMO</span></div><ProductionFlow seconds={seconds} /></div><div className="motion-metrics motion-metrics-secondary">{metrics.slice(4).map(metric => <Metric key={metric.label} {...metric} seconds={seconds} />)}<div className="motion-metric"><strong>L3</strong><span>Production ownership</span></div></div></div>
    <p className="motion-disclaimer">Animated counters display resume-reported achievements, not live BMO telemetry. Pipeline particles are illustrative.</p>
  </section>
}
