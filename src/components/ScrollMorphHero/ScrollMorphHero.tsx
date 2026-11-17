import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import './scrollMorphHero.css'

// Local assets keep every card independent of third-party image hosts.
const TECHNOLOGIES = [
  ['Python', 'python', '#ffd343'], ['Airflow', 'airflow-icon', '#44c9c0'],
  ['PySpark', 'apache-spark', '#ff8a49'], ['Databricks', 'databricks', '#ff6255'],
  ['Snowflake', 'snowflake-icon', '#5cc7f0'], ['dbt', 'dbt-icon', '#ff8b71'],
  ['Kafka', 'kafka-icon', '#b7a3fa'], ['PostgreSQL', 'postgresql', '#6fa9da'],
  ['AWS Glue', 'aws-glue', '#d79af3'], ['Redshift', 'aws-redshift', '#91a5ff'],
  ['Amazon S3', 'aws-s3', '#91c969'], ['Lambda', 'aws-lambda', '#ffb14e'],
  ['Docker', 'docker-icon', '#4bb5fa'], ['React', 'react', '#61dafb'],
  ['TypeScript', 'typescript', '#68a9ed'], ['Django', 'django', '#44b78b'],
  ['Parquet', 'apacheparquet', '#65c8c6'], ['Git', 'git', '#f5836f'],
  ['Grafana', 'grafana', '#ffa650'], ['Pandas', 'pandas-icon', '#b6a3ef'],
] as const

type Phase = 'scatter' | 'line' | 'circle'
type Target = { x: number; y: number; rotate: number; scale: number; opacity: number }

/** Blend circle and arc coordinates using bounded scroll progress. */
function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress
}

/** Render the supplied hero's animated card with a local technology logo. */
function TechnologyCard({ technology, target, reduced }: {
  technology: typeof TECHNOLOGIES[number]; target: Target; reduced: boolean
}) {
  const [name, logo, color] = technology
  return <motion.li className="smh-card" initial={false} animate={target}
    transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 40, damping: 15 }}
    style={{ '--smh-brand': color } as CSSProperties}>
    <div className="smh-card-inner">
      <img src={`/logos/${logo}.svg`} alt="" width="32" height="32" draggable="false" />
      <span>{name}</span>
    </div>
  </motion.li>
}

/** Play scatter → line → circle, then morph into an arc with native page scroll. */
export default function ScrollMorphHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const reduced = Boolean(useReducedMotion())
  const [phase, setPhase] = useState<Phase>('scatter')
  const [size, setSize] = useState({ width: 1200, height: 760 })
  const [progress, setProgress] = useState(0)
  const [origin, setOrigin] = useState(0)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 40, damping: 20 })
  useMotionValueEvent(smoothProgress, 'change', setProgress)

  // Resize the geometry against the visible stage, rather than assuming a desktop viewport.
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const observer = new ResizeObserver(([entry]) => setSize({
      width: entry.contentRect.width, height: entry.contentRect.height,
    }))
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  // Finish the intro before accepting a circle-to-arc transition, even if scrolled early.
  useEffect(() => {
    if (reduced) return
    setPhase('scatter')
    const lineTimer = window.setTimeout(() => setPhase('line'), 500)
    const circleTimer = window.setTimeout(() => {
      setOrigin(scrollYProgress.get())
      setPhase('circle')
    }, 2500)
    return () => { clearTimeout(lineTimer); clearTimeout(circleTimer) }
  }, [reduced, scrollYProgress])

  const morph = phase === 'circle' ? Math.min(1, Math.max(0, (progress - origin) / Math.max(.15, 1 - origin) * 1.8)) : 0
  const radius = Math.min(size.width * .34, size.height * .35, 290)
  const spacing = Math.min(70, (size.width - 64) / TECHNOLOGIES.length)
  const cardScale = Math.min(1, size.width / 650)

  return <section ref={sectionRef} className={`smh-root${reduced ? ' smh-reduced' : ''}`} aria-label="Data engineering toolkit">
    <div ref={stageRef} className="smh-stage" data-phase={reduced ? 'static' : phase}>
      <div className="smh-intro" style={{ opacity: reduced ? 1 : phase === 'circle' ? Math.max(0, 1 - morph * 2) : 0, visibility: reduced || (phase === 'circle' && morph < .5) ? 'visible' : 'hidden' }}>
        <p className="smh-eyebrow">HELLO, I’M</p>
        <h1>Abinav S<span>.</span></h1>
        <p className="smh-role">Data Engineer</p>
        <a href="#engineering-impact" className="smh-explore">Explore my work <span aria-hidden="true">↓</span></a>
      </div>
      <div className="smh-arc-content" style={{ opacity: reduced ? 0 : Math.max(0, (morph - .55) / .45), visibility: morph > .55 ? 'visible' : 'hidden' }}>
        <p className="smh-eyebrow">THE TOOLS. THE CRAFT.</p>
        <h2>From raw data<br />to reliable systems.</h2>
        <p>Data engineering · Distributed systems · Data platforms</p>
      </div>
      <ul className="smh-cards" aria-label="Technologies I build with">
        {TECHNOLOGIES.map((technology, index) => {
          // Deterministic scatter avoids hydration/random-layout surprises on remount.
          const scatterAngle = index * 2.39996
          let target: Target = {
            x: Math.cos(scatterAngle) * size.width * .4,
            y: Math.sin(scatterAngle) * size.height * .37,
            rotate: (index % 7 - 3) * 22, scale: .6, opacity: .7,
          }
          if (phase === 'line') target = {
            x: (index - (TECHNOLOGIES.length - 1) / 2) * spacing,
            y: 0, rotate: 0, scale: Math.min(1, spacing / 64), opacity: 1,
          }
          if (phase === 'circle') {
            const angle = index / TECHNOLOGIES.length * Math.PI * 2 - Math.PI / 2
            // The lower arc follows the reference, keeping its apex in the visible stage.
            const arcRadius = Math.max(size.width * .65, size.height * .85)
            const arcAngle = (-155 + index / (TECHNOLOGIES.length - 1) * 130) * Math.PI / 180
            target = {
              x: lerp(Math.cos(angle) * radius, Math.cos(arcAngle) * arcRadius, morph),
              y: lerp(Math.sin(angle) * radius, Math.sin(arcAngle) * arcRadius + arcRadius + size.height * .08, morph),
              rotate: lerp(angle * 180 / Math.PI + 90, arcAngle * 180 / Math.PI + 90, morph),
              scale: lerp(cardScale, 1.5 * cardScale, morph), opacity: 1,
            }
          }
          if (reduced) target = { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
          return <TechnologyCard key={technology[0]} technology={technology} target={target} reduced={reduced} />
        })}
      </ul>
      {!reduced && <p className="smh-scroll-hint">{phase === 'circle' ? 'SCROLL TO EXPLORE' : 'ASSEMBLING THE TOOLKIT'}<span aria-hidden="true">↓</span></p>}
    </div>
  </section>
}
