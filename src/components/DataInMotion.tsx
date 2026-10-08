import { useEffect, useRef, useState } from 'react'
import './DataInMotion.css'

const metrics = [
  { value: 5000000, suffix: '+', kind: 'million', label: 'Events/day' },
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
const format = (value: number, kind: string) => kind === 'million' ? `${(value / 1000000).toFixed(1).replace(/\.0$/, '')}M` : kind === 'decimal' ? value.toFixed(1) : Math.floor(value).toString()
function useMotion() {
  const [seconds, setSeconds] = useState(0)
  const time = useRef(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setSeconds(-1); return }
    let frame = 0, previous = 0
    const tick = (now: number) => {
      if (previous) time.current = time.current + Math.min((now - previous) / 1000, .06)
      previous = now
      setSeconds(time.current)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])
  return seconds
}
function Metric({ value, suffix, kind, label, seconds }: typeof metrics[number] & { seconds: number }) {
  const phase = seconds < 0 ? 1 : (seconds % 6) / 6
  const progress = phase < .75 ? 1 - Math.pow(1 - phase / .75, 3) : 1
  return <div className="motion-metric"><strong>{format(value * progress, kind)}{suffix}</strong><span>{label}</span></div>
}
function ParticleField({ seconds }: { seconds: number }) {
  const blend = seconds < 0 ? 1 : (1 - Math.cos(seconds * .9)) / 2
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
      return <circle key={i} cx={x * (1 - blend) + gx * blend} cy={y * (1 - blend) + gy * blend} r={i % 8 === 0 ? 2.8 : 1.7} fill={i % 7 === 0 ? '#bcbcbc' : '#e6e7ef'} opacity={.28 + .72 * blend} />
    })}
    <text x="320" y="259" textAnchor="middle" fill="#a5a8b3" fontSize="11" letterSpacing="2">RAW SIGNALS → STRUCTURED DATA</text>
  </svg>
}
function Orbit({ seconds }: { seconds: number }) {
  const positions = [[350,35],[570,113],[490,286],[210,286],[130,113]]
  const labels = ['S3','GLUE','QUALITY','REDSHIFT','REPORT']
  return <div className="motion-visual"><div className="motion-visual-header"><small>01 / INFRASTRUCTURE</small><strong>Cloud Infrastructure Orbit</strong><span>{seconds < 0 ? 'STATIC' : 'LIVE · LOOP ' + (Math.floor(seconds / 6) + 1)}</span></div><svg className="motion-svg" viewBox="0 0 700 340" role="img" aria-label="Airflow orchestrating S3, Glue, Quality, Redshift and Reporting">
    <circle cx="350" cy="166" r="118" fill="none" stroke="#484848" strokeDasharray="5 7"/><circle cx="350" cy="166" r="84" fill="none" stroke="#303030"/>
    {positions.map(([x,y],i)=><g key={i}><line x1="350" y1="166" x2={x} y2={y} stroke="#525252" strokeDasharray="4 5"/><rect x={x-52} y={y-27} width="104" height="54" rx="10" fill="#1a1a1a" stroke="#858585"/><text x={x} y={y+4} textAnchor="middle" fill="#f5f5f5" fontSize="13" fontWeight="700">{labels[i]}</text></g>)}
    {Array.from({length:45},(_,i)=>{const angle=i*.78+seconds*.65,r=105+i%7*6;return <circle key={i} cx={350+Math.cos(angle)*r} cy={166+Math.sin(angle)*r*.75} r={i%6===0?3:2} fill={i%4===0?'#aaaaaa':'#dddddd'}/>})}
    <rect x="292" y="139" width="116" height="54" rx="10" fill="#1a1a1a" stroke="#858585"/><text x="350" y="160" textAnchor="middle" fill="#f5f5f5" fontSize="13" fontWeight="700">AIRFLOW</text><text x="350" y="178" textAnchor="middle" fill="#aaaaaa" fontSize="9">ORCHESTRATION</text>
  </svg><p>S3 · Glue · Quality · Redshift · Reporting — orchestrated with Airflow</p></div>
}
function TransformationMatrix({ seconds }: { seconds: number }) {
  const pct=seconds < 0 ? 100 : Math.round((seconds % 6) / 6 * 100)
  return <div className="motion-visual"><div className="motion-visual-header"><small>02 / DATA PROCESSING</small><strong>Data Transformation Matrix</strong><span>{seconds<0?'STATIC':'LIVE · LOOP '+(Math.floor(seconds/6)+1)}</span></div><svg className="motion-svg" viewBox="0 0 700 300" role="img" aria-label="Raw data particles becoming curated data through PySpark and SQL">
    {Array.from({length:9},(_,i)=><line key={'h'+i} x1="210" x2="490" y1={35+i*27} y2={35+i*27} stroke="#303030"/>)}
    {Array.from({length:14},(_,i)=><line key={'v'+i} x1={210+i*21.5} x2={210+i*21.5} y1="35" y2="251" stroke="#303030"/>)}
    {Array.from({length:100},(_,i)=>{const progress=(i/100+seconds/4.2)%1,x=45+610*progress,raw=145+Math.sin(i*2.4)*103,grid=65+Math.floor(i/14)*24;return <circle key={i} cx={x} cy={raw*(1-progress)+grid*progress} r={i%8===0?2.8:1.6} fill={i%7===0?'#aaaaaa':'#dddddd'}/>})}
    <rect x="274" y="103" width="152" height="90" rx="16" fill="#1a1a1a" stroke="#858585"/><text x="350" y="141" textAnchor="middle" fill="#f5f5f5" fontSize="16" fontWeight="700">TRANSFORM</text><text x="350" y="168" textAnchor="middle" fill="#aaaaaa" fontSize="11">PYSPARK / SQL</text><text x="93" y="156" textAnchor="middle" fill="#d0d0d0" fontSize="13">RAW</text><text x="608" y="156" textAnchor="middle" fill="#d0d0d0" fontSize="13">CURATED</text>
  </svg><div className="motion-progress-label"><span>RAW → TRANSFORM → CURATED</span><span>{pct}%</span></div><div className="motion-progress"><i style={{width:pct+'%'}}/></div></div>
}
export function DataInMotion() {
  const seconds = useMotion()
  const firstSectionSeconds = seconds
  return <section className="data-motion" aria-label="Data engineering in motion">
    <div className="motion-heading"><div><span className="motion-eyebrow">ABINAV S. / DATA ENGINEERING</span><h2>Data.<br /><em>In Motion.</em></h2><p>Building, optimizing and operating production pipelines that turn complex raw data into trustworthy, analytics-ready information.</p></div></div>
    <div className="motion-metrics">{metrics.slice(0, 4).map(metric => <Metric key={metric.label} {...metric} seconds={firstSectionSeconds} />)}</div>
    <div className="motion-section"><div className="motion-section-label">01 / WHAT I DO</div><div className="motion-panel"><h3>From complexity to clarity.</h3><p>Ingestion · Transformation · Validation · Orchestration · Delivery</p><ParticleField seconds={firstSectionSeconds} /></div><p className="motion-description">I work across Python, SQL, Airflow and AWS to develop resilient ETL workflows, enforce data quality, improve performance and maintain production reliability.</p></div>
    <div className="motion-section"><div className="motion-section-label">02 / BMO PRODUCTION</div><h3 className="motion-section-title">Built for reliability.</h3><p className="motion-description">Financial data pipelines at Virtusa for BMO, from raw ingestion to validated downstream reporting and L3 operational ownership.</p><Orbit seconds={seconds} /><TransformationMatrix seconds={seconds} /><div className="motion-metrics motion-metrics-secondary">{metrics.slice(4).map(metric => <Metric key={metric.label} {...metric} seconds={seconds} />)}<div className="motion-metric"><strong>L3</strong><span>Production ownership</span></div></div></div>
    <p className="motion-disclaimer">Animated counters display resume-reported achievements, not live BMO telemetry. Pipeline particles are illustrative.</p>
  </section>
}
