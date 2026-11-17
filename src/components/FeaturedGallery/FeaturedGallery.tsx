import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion'
import './featuredGallery.css'

type Project = { name: string; category: string; subtitle: string; description: string; source: string; details: string; highlights: string[]; technologies: string[] }
const VIEWS = [
  { project: 0, image: '/architecture/retail-lakehouse.gif', label: 'Pipeline architecture' },
  { project: 2, image: '/projects/rolegraph-homepage.png', label: 'Atlas interface' },
  { project: 1, image: '/architecture/crickx.gif', label: 'Streaming architecture' },
  { project: 2, image: '/projects/rolegraph-analytics-overview.png', label: 'Analytics interface' },
  { project: 3, image: '/projects/databricks-retail.svg', label: 'Transformation flow' },
  { project: 2, image: '/projects/rolegraph-analytics-regions.png', label: 'Regional analytics interface' },
]

/** Render one staggered gallery column driven by native scroll progress. */
function GalleryColumn({ items, progress, index, reduce, projects }: {
  items: typeof VIEWS; progress: MotionValue<number>; index: number; reduce: boolean; projects: Project[]
}) {
  const y = useTransform(progress, [0, 1], index === 1 ? ['8%', '-3%'] : ['-3%', '3%'])
  return <motion.div className="fg-col" style={reduce ? undefined : { y }}>
    {items.map(view => {
      const project = projects[view.project]
      return <a key={view.image} className="fg-tile" href={project.details}
        target={project.details.startsWith('https:') ? '_blank' : undefined}
        rel={project.details.startsWith('https:') ? 'noopener noreferrer' : undefined}>
        <img src={view.image} alt={`${project.name}: ${view.label}`} loading="lazy" width="960" height="540" />
        <span className="fg-caption"><strong>{project.name}</strong><small>{view.label} ↗</small></span>
      </a>
    })}
  </motion.div>
}

/** Adapt the supplied animated gallery with real project views and an unpinned scroll reveal. */
export default function FeaturedGallery({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = Boolean(useReducedMotion())
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const rotateX = useTransform(scrollYProgress, [0, 1], [65, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1])
  return <section className={`fg-root${reduce ? ' fg-reduced' : ''}`} id="projects" aria-labelledby="featured-projects-title">
    <header className="fg-head"><p className="fg-eyebrow">SELECTED WORK</p><h2 id="featured-projects-title">Featured <em>projects</em></h2><p>Pipelines, platforms, and analytics I’ve designed and built.</p></header>
    <div ref={ref} className="fg-scroll">
      <motion.div className="fg-grid" style={reduce ? undefined : { rotateX, scale }}>
        {[0, 1, 2].map(index => <GalleryColumn key={index} index={index} projects={projects} progress={scrollYProgress} reduce={reduce} items={VIEWS.filter((_, i) => i % 3 === index)} />)}
      </motion.div>
    </div>
    {/* Keep project evidence and repository links available independently of the visual gallery. */}
    <div className="fg-project-details">{projects.map(project => <details key={project.name}><summary>{project.name}<span>{project.category}</span></summary><p>{project.description}</p><ul>{project.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul><p className="fg-tools">{project.technologies.join(' · ')}</p><a href={project.source} target="_blank" rel="noopener noreferrer">View source ↗</a></details>)}</div>
  </section>
}
